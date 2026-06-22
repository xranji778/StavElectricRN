import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { colors } from '../theme/colors';
import { getProfessionTheme } from '../theme/professionThemes';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { loadEvents, saveEvent, deleteEvent } from '../data/storage';
import { ensurePermission, scheduleEventNotification, cancelNotification } from '../utils/notifications';
import ScreenHeader from '../components/ScreenHeader';

LocaleConfig.locales['he'] = {
  monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
  monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
  dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
  today: 'היום',
};
LocaleConfig.defaultLocale = 'he';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDateTime(dateISO, timeHHMM) {
  if (!dateISO) return null;
  const [y, m, d] = dateISO.split('-').map(Number);
  const [h, mi] = (timeHHMM || '09:00').split(':').map(Number);
  return new Date(y, m - 1, d, h || 0, mi || 0).getTime();
}

export default function CalendarScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = getProfessionTheme(user?.activeProfession);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [editing, setEditing] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    const list = await loadEvents(user.id);
    setEvents(list);
    setLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const marked = useMemo(() => {
    const out = {};
    for (const e of events) {
      if (!e.date) continue;
      const dot = { key: e.id, color: e.type === 'reminder' ? colors.voltageYellow : theme.accent };
      if (!out[e.date]) out[e.date] = { dots: [] };
      out[e.date].dots.push(dot);
    }
    out[selectedDate] = { ...(out[selectedDate] || { dots: [] }), selected: true, selectedColor: theme.accent };
    return out;
  }, [events, selectedDate, theme.accent]);

  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    [events, selectedDate],
  );

  const upcoming = useMemo(() => {
    const today = todayISO();
    return events
      .filter((e) => (e.date || '') >= today)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.time || '').localeCompare(b.time || '');
      })
      .slice(0, 5);
  }, [events]);

  const onAdd = (type) => {
    setEditing({ title: '', date: selectedDate, time: '09:00', type, notes: '', notify: type === 'reminder' });
  };

  const onSave = async (event) => {
    if (!event.title?.trim()) return;
    let notificationId = event.notificationId || null;
    if (notificationId && (!event.notify || event.notify !== !!notificationId)) {
      await cancelNotification(notificationId);
      notificationId = null;
    }
    if (event.notify && !notificationId) {
      const ok = await ensurePermission();
      if (!ok) {
        Alert.alert(t('cal.noPerm'), t('cal.noPermMsg'));
      } else {
        const fireAt = parseDateTime(event.date, event.time);
        notificationId = await scheduleEventNotification({
          title: event.type === 'reminder' ? '⏰ ' + event.title.trim() : '📅 ' + event.title.trim(),
          body: event.notes || '',
          fireAt,
        });
      }
    }
    const saved = { ...event, notificationId };
    const next = await saveEvent(user.id, saved);
    setEvents(next);
    setEditing(null);
  };

  const onDelete = (event) => {
    Alert.alert(
      t('cal.deleteTitle'),
      t('cal.deleteMsg', { name: event.title || '' }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            if (event.notificationId) await cancelNotification(event.notificationId);
            const next = await deleteEvent(user.id, event.id);
            setEvents(next);
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryBright} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.flex}>
      <LinearGradient colors={colors.bgGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container}>
          <ScreenHeader icon="event" title={t('cal.title')} subtitle={t('cal.subtitle')} />

          <View style={styles.calendarCard}>
            <Calendar
              current={selectedDate}
              onDayPress={(d) => setSelectedDate(d.dateString)}
              markedDates={marked}
              markingType="multi-dot"
              firstDay={0}
              theme={{
                calendarBackground: colors.card,
                dayTextColor: colors.text,
                monthTextColor: colors.text,
                textSectionTitleColor: colors.textMuted,
                arrowColor: theme.accent,
                todayTextColor: theme.accent,
                selectedDayBackgroundColor: theme.accent,
                selectedDayTextColor: '#fff',
                textDayFontWeight: '600',
                textMonthFontWeight: '800',
                textDayHeaderFontWeight: '700',
              }}
            />
          </View>

          <View style={styles.addRow}>
            <Pressable style={[styles.addBtn, { backgroundColor: theme.accent }]} onPress={() => onAdd('job')}>
              <MaterialIcons name="work" size={18} color="#fff" />
              <Text style={styles.addBtnText}>{t('cal.newJob')}</Text>
            </Pressable>
            <Pressable style={[styles.addBtn, { backgroundColor: colors.voltageYellow }]} onPress={() => onAdd('reminder')}>
              <MaterialIcons name="notifications" size={18} color="#fff" />
              <Text style={styles.addBtnText}>{t('cal.newReminder')}</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>{selectedDate === todayISO() ? t('cal.today') : selectedDate}</Text>
          {dayEvents.length === 0 ? (
            <View style={styles.emptyDay}><Text style={styles.emptyText}>{t('cal.empty')}</Text></View>
          ) : (
            dayEvents.map((e) => (
              <EventTile key={e.id} event={e} theme={theme} onPress={() => setEditing(e)} onDelete={() => onDelete(e)} />
            ))
          )}

          {upcoming.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 18 }]}>{t('cal.upcoming')}</Text>
              {upcoming.map((e) => (
                <EventTile key={'u_' + e.id} event={e} theme={theme} showDate onPress={() => { setSelectedDate(e.date); setEditing(e); }} onDelete={() => onDelete(e)} />
              ))}
            </>
          )}
        </ScrollView>

        <Modal visible={!!editing} animationType="slide" transparent onRequestClose={() => setEditing(null)}>
          <EventEditor event={editing} theme={theme} t={t} onClose={() => setEditing(null)} onSave={onSave} />
        </Modal>
      </SafeAreaView>
    </View>
  );
}

function EventTile({ event, theme, onPress, onDelete, showDate }) {
  const isReminder = event.type === 'reminder';
  const color = isReminder ? colors.voltageYellow : theme.accent;
  const icon = isReminder ? 'notifications' : 'work';
  return (
    <Pressable style={styles.tile} onPress={onPress} onLongPress={onDelete} delayLongPress={400}>
      <View style={[styles.tileIcon, { backgroundColor: color + '22', borderColor: color + '66' }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1, marginHorizontal: 10 }}>
        <Text style={styles.tileTitle} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.tileMeta} numberOfLines={1}>
          {showDate ? event.date + ' · ' : ''}{event.time || ''}
          {event.notes ? ' · ' + event.notes : ''}
          {event.notificationId ? ' · 🔔' : ''}
        </Text>
      </View>
      <MaterialIcons name="chevron-left" size={20} color={colors.textFaint} />
    </Pressable>
  );
}

function EventEditor({ event, theme, t, onClose, onSave }) {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || todayISO());
  const [time, setTime] = useState(event?.time || '09:00');
  const [notes, setNotes] = useState(event?.notes || '');
  const [type, setType] = useState(event?.type || 'job');
  const [notify, setNotify] = useState(!!event?.notify);
  const isEdit = !!event?.id;

  if (!event) return null;

  return (
    <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalSheet}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>{isEdit ? t('cal.editEvent') : (type === 'reminder' ? t('cal.newReminder') : t('cal.newJob'))}</Text>

        <View style={styles.typeRow}>
          <Pressable
            style={[styles.typeBtn, type === 'job' && { backgroundColor: theme.accent, borderColor: theme.accent }]}
            onPress={() => setType('job')}
          >
            <MaterialIcons name="work" size={16} color={type === 'job' ? '#fff' : colors.textMuted} />
            <Text style={[styles.typeBtnText, type === 'job' && { color: '#fff' }]}>{t('cal.typeJob')}</Text>
          </Pressable>
          <Pressable
            style={[styles.typeBtn, type === 'reminder' && { backgroundColor: colors.voltageYellow, borderColor: colors.voltageYellow }]}
            onPress={() => setType('reminder')}
          >
            <MaterialIcons name="notifications" size={16} color={type === 'reminder' ? '#fff' : colors.textMuted} />
            <Text style={[styles.typeBtnText, type === 'reminder' && { color: '#fff' }]}>{t('cal.typeReminder')}</Text>
          </Pressable>
        </View>

        <Field label={t('cal.titlePh')} value={title} onChangeText={setTitle} autoFocus />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 2 }}>
            <Field label={t('cal.date')} value={date} onChangeText={setDate} placeholder="2026-06-10" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label={t('cal.time')} value={time} onChangeText={setTime} placeholder="09:00" />
          </View>
        </View>

        <Field label={t('cal.notesPh')} value={notes} onChangeText={setNotes} multiline />

        <Pressable style={styles.notifyRow} onPress={() => setNotify(!notify)}>
          <View style={[styles.checkbox, notify && { backgroundColor: theme.accent, borderColor: theme.accent }]}>
            {notify && <MaterialIcons name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.notifyText}>{t('cal.notify')}</Text>
        </Pressable>

        <View style={styles.modalActions}>
          <Pressable style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
          </Pressable>
          <Pressable
            style={[styles.modalSave, { backgroundColor: theme.accent }, !title.trim() && { opacity: 0.5 }]}
            onPress={() => onSave({ ...(event || {}), title, date, time, type, notes, notify })}
            disabled={!title.trim()}
          >
            <MaterialIcons name="save" size={18} color="#fff" />
            <Text style={styles.modalSaveText}>{t('cal.save')}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChangeText, multiline, ...rest }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && { minHeight: 60, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textFaint}
        multiline={multiline}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 40 },

  calendarCard: {
    backgroundColor: colors.card, borderRadius: 18, padding: 8, marginTop: 14,
    borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden',
  },
  addRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  addBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: 14,
  },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  sectionTitle: { color: '#fff', fontWeight: '900', fontSize: 15, marginTop: 18, marginBottom: 8, letterSpacing: 0.3 },

  emptyDay: { backgroundColor: colors.card, borderRadius: 14, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  emptyText: { color: colors.textMuted, fontSize: 13 },

  tile: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  tileIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  tileTitle: { color: colors.text, fontWeight: '800', fontSize: 14 },
  tileMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },

  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  modalSheet: {
    backgroundColor: colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 28, borderWidth: 1, borderColor: colors.cardBorder,
  },
  modalHandle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: colors.dividerDark, marginBottom: 12 },
  modalTitle: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: 12, textAlign: 'right' },

  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
    backgroundColor: colors.cardElevated,
  },
  typeBtnText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },

  fieldLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 5, textAlign: 'right' },
  fieldInput: {
    backgroundColor: colors.cardElevated, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text, fontSize: 15, textAlign: 'right',
    borderWidth: 1, borderColor: colors.cardBorder,
  },

  notifyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 12 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardElevated,
  },
  notifyText: { color: colors.text, fontWeight: '700', fontSize: 14 },

  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancel: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { color: colors.textMuted, fontWeight: '700' },
  modalSave: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12,
  },
  modalSaveText: { color: '#fff', fontWeight: '900', fontSize: 15 },
});
