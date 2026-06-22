import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { getProfessionTheme } from '../theme/professionThemes';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { loadClients, saveClient, deleteClient, loadQuotes } from '../data/storage';
import ScreenHeader from '../components/ScreenHeader';
import { callPhone, whatsappTo, navigateToAddress } from '../utils/contactActions';

const formatILS = (n) => `₪${Math.round(Number(n) || 0).toLocaleString('he-IL')}`;

export default function ClientsScreen({ navigation }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = getProfessionTheme(user?.activeProfession);
  const [clients, setClients] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClient, setViewingClient] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [list, qs] = await Promise.all([loadClients(user.id), loadQuotes(user.id)]);
    setClients(list);
    setQuotes(qs);
    setLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const quotesForClient = useCallback((client) => {
    const name = (client.name || '').trim().toLowerCase();
    const phone = (client.phone || '').replace(/\D/g, '');
    return quotes.filter((q) => {
      const qName = (q.clientName || '').trim().toLowerCase();
      const qPhone = (q.clientPhone || '').replace(/\D/g, '');
      if (phone && qPhone && phone === qPhone) return true;
      if (name && qName && name === qName) return true;
      return false;
    });
  }, [quotes]);

  const onAdd = () => setEditingClient({ name: '', phone: '', address: '', email: '' });
  const onEdit = (client) => setEditingClient(client);
  const onView = (client) => setViewingClient(client);
  const onCloseEditor = () => setEditingClient(null);
  const onCloseViewer = () => setViewingClient(null);

  const onSaved = async (client) => {
    const next = await saveClient(user.id, client);
    setClients(next);
    setEditingClient(null);
  };

  const onDelete = (client) => {
    Alert.alert(
      t('clients.deleteTitle'),
      t('clients.deleteMsg', { name: client.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const next = await deleteClient(user.id, client.id);
            setClients(next);
          },
        },
      ],
    );
  };

  const filtered = clients.filter((c) => {
    const s = search.trim().toLowerCase();
    if (!s) return true;
    return (
      (c.name || '').toLowerCase().includes(s) ||
      (c.phone || '').toLowerCase().includes(s) ||
      (c.address || '').toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryBright} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.flex}>
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container}>
          <ScreenHeader
            icon="contacts"
            title={t('clients.title')}
            subtitle={t('clients.subtitle')}
          />

          <View style={styles.actionsRow}>
            <View style={styles.searchWrap}>
              <MaterialIcons name="search" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder={t('clients.search')}
                placeholderTextColor={colors.textFaint}
              />
            </View>
            <Pressable style={[styles.addBtn, { backgroundColor: theme.accent }]} onPress={onAdd}>
              <MaterialIcons name="person-add" size={20} color="#fff" />
            </Pressable>
          </View>

          {clients.length > 0 && (
            <Text style={styles.countText}>{t('clients.count', { n: clients.length })}</Text>
          )}

          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="contacts" size={56} color={theme.accentSoft} />
              <Text style={styles.emptyTitle}>{t('clients.empty')}</Text>
              <Text style={styles.emptySub}>{t('clients.emptySub')}</Text>
              <Pressable style={[styles.emptyButton, { backgroundColor: theme.accent }]} onPress={onAdd}>
                <MaterialIcons name="add" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>{t('clients.add')}</Text>
              </Pressable>
            </View>
          ) : (
            filtered.map((c) => {
              const cQuotes = quotesForClient(c);
              const total = cQuotes.reduce((s, q) => s + (Number(q.total) || 0), 0);
              return (
                <ClientTile
                  key={c.id}
                  theme={theme}
                  client={c}
                  quoteCount={cQuotes.length}
                  quoteTotal={total}
                  t={t}
                  onPress={() => onView(c)}
                  onDelete={() => onDelete(c)}
                />
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal visible={!!editingClient} animationType="slide" transparent onRequestClose={onCloseEditor}>
        <ClientEditor
          client={editingClient}
          theme={theme}
          t={t}
          onClose={onCloseEditor}
          onSave={onSaved}
        />
      </Modal>

      <Modal visible={!!viewingClient} animationType="slide" transparent onRequestClose={onCloseViewer}>
        {viewingClient && (
          <ClientDashboard
            client={viewingClient}
            quotes={quotesForClient(viewingClient)}
            theme={theme}
            t={t}
            onClose={onCloseViewer}
            onEdit={() => { const c = viewingClient; onCloseViewer(); setTimeout(() => onEdit(c), 200); }}
            onOpenQuote={(qid) => { onCloseViewer(); navigation.navigate('Quote', { quoteId: qid }); }}
          />
        )}
      </Modal>
    </View>
  );
}

function ClientDashboard({ client, quotes, theme, t, onClose, onEdit, onOpenQuote }) {
  const totalAll = quotes.reduce((s, q) => s + (Number(q.total) || 0), 0);
  const won = quotes.filter(q => q.dealStatus === 'won');
  const lost = quotes.filter(q => q.dealStatus === 'lost');
  const pending = quotes.filter(q => !q.dealStatus || q.dealStatus === 'pending');
  const wonTotal = won.reduce((s, q) => s + (Number(q.total) || 0), 0);
  const paidTotal = quotes.reduce((s, q) => {
    if (q.paymentStatus === 'paid') return s + (Number(q.total) || 0);
    return s + (Number(q.paidAmount) || 0);
  }, 0);
  const sorted = [...quotes].sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
    const db = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
    return db - da;
  });

  return (
    <View style={styles.modalRoot}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={[styles.modalSheet, { maxHeight: '85%' }]}>
        <View style={styles.modalHandle} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <View style={[styles.avatar, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '55' }]}>
            <MaterialIcons name="person" size={22} color={theme.accentSoft} />
          </View>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={[styles.modalTitle, { marginBottom: 0 }]}>{client.name}</Text>
            {!!client.phone && <Text style={styles.tileMeta}>{client.phone}</Text>}
            {!!client.address && <Text style={styles.tileMeta}>{client.address}</Text>}
          </View>
          <Pressable style={[styles.addBtn, { backgroundColor: theme.accent }]} onPress={onEdit} hitSlop={8}>
            <MaterialIcons name="edit" size={18} color="#fff" />
          </Pressable>
        </View>

        {(!!client.phone || !!client.address) && (
          <View style={styles.dashActionRow}>
            {!!client.phone && (
              <Pressable
                style={[styles.dashActionBtn, { backgroundColor: '#0284c7' }]}
                onPress={() => callPhone(client.phone)}
              >
                <MaterialIcons name="call" size={20} color="#fff" />
              </Pressable>
            )}
            {!!client.phone && (
              <Pressable
                style={[styles.dashActionBtn, { backgroundColor: '#25D366' }]}
                onPress={() => whatsappTo(client.phone)}
              >
                <MaterialIcons name="chat" size={20} color="#fff" />
              </Pressable>
            )}
            {!!client.address && (
              <Pressable
                style={[styles.dashActionBtn, { backgroundColor: '#2563eb' }]}
                onPress={() => navigateToAddress(client.address)}
              >
                <MaterialIcons name="navigation" size={20} color="#fff" />
              </Pressable>
            )}
          </View>
        )}

        <ScrollView style={{ marginTop: 12 }} contentContainerStyle={{ paddingBottom: 16 }}>
          <View style={styles.dashStatsRow}>
            <View style={[styles.dashStat, { backgroundColor: '#0284c722', borderColor: '#0284c766' }]}>
              <Text style={styles.dashStatLabel}>{t('clients.dash.won')}</Text>
              <Text style={[styles.dashStatValue, { color: '#0284c7' }]}>{won.length}</Text>
              <Text style={styles.dashStatHint}>{formatILS(wonTotal)}</Text>
            </View>
            <View style={[styles.dashStat, { backgroundColor: '#6b728022', borderColor: '#6b728066' }]}>
              <Text style={styles.dashStatLabel}>{t('clients.dash.pending')}</Text>
              <Text style={[styles.dashStatValue, { color: '#6b7280' }]}>{pending.length}</Text>
            </View>
            <View style={[styles.dashStat, { backgroundColor: '#9ca3af22', borderColor: '#9ca3af66' }]}>
              <Text style={styles.dashStatLabel}>{t('clients.dash.lost')}</Text>
              <Text style={[styles.dashStatValue, { color: '#9ca3af' }]}>{lost.length}</Text>
            </View>
          </View>

          <View style={[styles.dashStatsRow, { marginTop: 8 }]}>
            <View style={[styles.dashStat, { flex: 2, backgroundColor: theme.accentSoft + '22', borderColor: theme.accentSoft + '66' }]}>
              <Text style={styles.dashStatLabel}>{t('clients.dash.totalValue')}</Text>
              <Text style={[styles.dashStatValue, { color: theme.accentSoft }]}>{formatILS(totalAll)}</Text>
            </View>
            <View style={[styles.dashStat, { flex: 2, backgroundColor: '#16a34a22', borderColor: '#16a34a66' }]}>
              <Text style={styles.dashStatLabel}>{t('clients.dash.paidValue')}</Text>
              <Text style={[styles.dashStatValue, { color: '#16a34a' }]}>{formatILS(paidTotal)}</Text>
            </View>
          </View>

          <Text style={[styles.modalTitle, { fontSize: 15, marginTop: 16, marginBottom: 8 }]}>
            {t('clients.dash.history')} ({sorted.length})
          </Text>

          {sorted.length === 0 ? (
            <Text style={styles.tileMeta}>{t('clients.dash.empty')}</Text>
          ) : (
            sorted.map((q) => {
              const date = q.createdAt instanceof Date ? q.createdAt : new Date(q.createdAt);
              const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              return (
                <Pressable key={q.id} style={styles.dashQuoteRow} onPress={() => onOpenQuote(q.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tileName}>{q.projectName || t('home.unnamed')}</Text>
                    <Text style={styles.tileMeta}>{dateStr} · {t('home.itemsCount', { n: q.itemCount })}</Text>
                  </View>
                  <Text style={[styles.tileName, { color: theme.accentSoft }]}>{formatILS(q.total)}</Text>
                </Pressable>
              );
            })
          )}
        </ScrollView>

        <Pressable style={[styles.modalCancel, { marginTop: 8 }]} onPress={onClose}>
          <Text style={styles.modalCancelText}>{t('common.close')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ClientTile({ theme, client, quoteCount, quoteTotal, t, onPress, onDelete }) {
  const hasPhone = !!(client.phone && client.phone.trim());
  const hasAddress = !!(client.address && client.address.trim());
  const hasAnyAction = hasPhone || hasAddress;

  return (
    <Pressable style={styles.tile} onPress={onPress} onLongPress={onDelete} delayLongPress={400}>
      <View style={styles.tileTopRow}>
        <View style={[styles.avatar, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '55' }]}>
          <MaterialIcons name="person" size={22} color={theme.accentSoft} />
        </View>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={styles.tileName} numberOfLines={1}>{client.name}</Text>
          {hasPhone && <Text style={styles.tileMeta} numberOfLines={1}>{client.phone}</Text>}
          {hasAddress && <Text style={styles.tileMeta} numberOfLines={1}>{client.address}</Text>}
          {quoteCount > 0 && (
            <Text style={[styles.tileMeta, { color: theme.accentSoft, fontWeight: '700', marginTop: 4 }]}>
              {t('clients.quoteCount', { n: quoteCount })} · {formatILS(quoteTotal)}
            </Text>
          )}
        </View>
        <MaterialIcons name="chevron-left" size={22} color={colors.textFaint} />
      </View>

      {hasAnyAction && (
        <View style={styles.actionBtnRow}>
          {hasPhone && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#0284c7' }]}
              onPress={() => callPhone(client.phone)}
              hitSlop={6}
            >
              <MaterialIcons name="call" size={18} color="#fff" />
            </Pressable>
          )}
          {hasPhone && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#25D366' }]}
              onPress={() => whatsappTo(client.phone)}
              hitSlop={6}
            >
              <MaterialIcons name="chat" size={18} color="#fff" />
            </Pressable>
          )}
          {hasAddress && (
            <Pressable
              style={[styles.actionBtn, { backgroundColor: '#2563eb' }]}
              onPress={() => navigateToAddress(client.address)}
              hitSlop={6}
            >
              <MaterialIcons name="navigation" size={18} color="#fff" />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

function ClientEditor({ client, theme, t, onClose, onSave }) {
  const [name, setName] = useState(client?.name || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [address, setAddress] = useState(client?.address || '');
  const [email, setEmail] = useState(client?.email || '');
  const isEdit = !!client?.id;

  const trySave = () => {
    if (!name.trim()) return;
    onSave({
      ...(client || {}),
      name: name.trim(),
      phone: phone.trim() || null,
      address: address.trim() || null,
      email: email.trim() || null,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.modalRoot}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose} />
      <View style={styles.modalSheet}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>{isEdit ? t('clients.edit') : t('clients.new')}</Text>

        <Field label={t('clients.namePh')} value={name} onChangeText={setName} autoFocus />
        <Field label={t('clients.phonePh')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label={t('clients.addressPh')} value={address} onChangeText={setAddress} />
        <Field label={t('clients.emailPh')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <View style={styles.modalActions}>
          <Pressable style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
          </Pressable>
          <Pressable
            style={[styles.modalSave, { backgroundColor: theme.accent }, !name.trim() && { opacity: 0.5 }]}
            onPress={trySave}
            disabled={!name.trim()}
          >
            <MaterialIcons name="save" size={18} color="#fff" />
            <Text style={styles.modalSaveText}>{t('clients.save')}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChangeText, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textFaint}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 40 },

  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 14, alignItems: 'center' },
  searchWrap: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.card,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, textAlign: 'right', paddingVertical: 4 },
  addBtn: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  countText: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 12, textAlign: 'right' },

  tile: {
    backgroundColor: colors.card,
    borderRadius: 18, padding: 14, marginTop: 10,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  tileTopRow: { flexDirection: 'row', alignItems: 'center' },
  actionBtnRow: {
    flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: colors.dividerDark,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 4, elevation: 2,
  },

  dashActionRow: {
    flexDirection: 'row', gap: 10, marginTop: 8, marginBottom: 4,
    justifyContent: 'flex-start',
  },
  dashActionBtn: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  tileName: { color: colors.text, fontWeight: '800', fontSize: 15 },
  tileMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },

  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 22, padding: 28, marginTop: 14,
    alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 16, marginTop: 12 },
  emptySub: { color: colors.textMuted, fontSize: 13, marginTop: 6, textAlign: 'center' },
  emptyButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 999, marginTop: 16,
  },
  emptyButtonText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 28,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  modalHandle: {
    alignSelf: 'center', width: 44, height: 4, borderRadius: 2,
    backgroundColor: colors.dividerDark, marginBottom: 14,
  },
  modalTitle: { color: colors.text, fontWeight: '900', fontSize: 18, marginBottom: 14, textAlign: 'right' },

  dashStatsRow: { flexDirection: 'row', gap: 8 },
  dashStat: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12,
    borderWidth: 1,
  },
  dashStatLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  dashStatValue: { fontSize: 22, fontWeight: '900', marginTop: 2 },
  dashStatHint: { color: colors.textFaint, fontSize: 10, marginTop: 2 },

  dashQuoteRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderRadius: 12,
    padding: 12, marginTop: 6,
    borderWidth: 1, borderColor: colors.cardBorder,
  },

  field: { marginBottom: 12 },
  fieldLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 6, textAlign: 'right' },
  fieldInput: {
    backgroundColor: colors.cardElevated,
    borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    color: colors.text, fontSize: 15, textAlign: 'right',
    borderWidth: 1, borderColor: colors.cardBorder,
  },

  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalCancel: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { color: colors.textMuted, fontWeight: '700' },
  modalSave: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12,
  },
  modalSaveText: { color: '#fff', fontWeight: '900', fontSize: 15 },
});
