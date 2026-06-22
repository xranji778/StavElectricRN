import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../i18n/translations';
import { PROFESSIONS } from '../data/auth';
import ScreenHeader from '../components/ScreenHeader';
import { loadQuotes } from '../data/storage';
import { exportAnnualReport } from '../utils/pdf';
import { exportBackup, importBackup } from '../utils/backup';
import FeedbackModal from '../components/FeedbackModal';

function AnnualReportPicker({ user, t }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    if (!user || exporting) return;
    setExporting(true);
    try {
      const quotes = await loadQuotes(user.id);
      await exportAnnualReport(quotes, year, user);
    } catch (e) {
      Alert.alert(t('common.error'), String(e?.message || e));
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Pressable onPress={() => setYear((y) => y - 1)} style={annualStyles.yrBtn} hitSlop={8}>
          <MaterialIcons name="chevron-right" size={22} color={colors.primaryBright} />
        </Pressable>
        <Text style={annualStyles.yrText}>{year}</Text>
        <Pressable onPress={() => setYear((y) => y + 1)} style={annualStyles.yrBtn} hitSlop={8}>
          <MaterialIcons name="chevron-left" size={22} color={colors.primaryBright} />
        </Pressable>
      </View>
      <Pressable
        style={[annualStyles.exportBtn, exporting && { opacity: 0.5 }]}
        onPress={onExport}
        disabled={exporting}
      >
        {exporting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
            <Text style={annualStyles.exportBtnText}>{t('settings.annualReportBtn')}</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

function BackupActions({ user, t }) {
  const [busy, setBusy] = useState(false);

  const doExport = async () => {
    if (!user || busy) return;
    setBusy(true);
    try {
      await exportBackup(user);
    } catch (e) {
      Alert.alert(t('common.error'), String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const doImport = () => {
    if (!user || busy) return;
    Alert.alert(
      t('settings.backupImportConfirmTitle'),
      t('settings.backupImportConfirmMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.backupImportConfirmYes'),
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              const stats = await importBackup(user);
              if (stats) {
                Alert.alert(
                  t('settings.backupImportSuccess'),
                  t('settings.backupImportSuccessMsg', { ...stats }),
                );
              }
            } catch (e) {
              Alert.alert(t('common.error'), String(e?.message || e));
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
      <Pressable
        style={[backupStyles.btn, { backgroundColor: colors.liveWire }, busy && { opacity: 0.5 }]}
        onPress={doExport}
        disabled={busy}
      >
        <MaterialIcons name="file-download" size={18} color="#fff" />
        <Text style={backupStyles.btnText}>{t('settings.backupExport')}</Text>
      </Pressable>
      <Pressable
        style={[backupStyles.btn, { backgroundColor: colors.cardElevated, borderWidth: 1, borderColor: colors.cardBorder }, busy && { opacity: 0.5 }]}
        onPress={doImport}
        disabled={busy}
      >
        <MaterialIcons name="file-upload" size={18} color={colors.text} />
        <Text style={[backupStyles.btnText, { color: colors.text }]}>{t('settings.backupImport')}</Text>
      </Pressable>
    </View>
  );
}

const backupStyles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: 12, paddingVertical: 11,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});

const annualStyles = StyleSheet.create({
  yrBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.cardElevated,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  yrText: { color: colors.text, fontWeight: '900', fontSize: 22 },
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primaryBright,
    borderRadius: 12, paddingVertical: 12,
  },
  exportBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});

export default function SettingsScreen() {
  const { user, logout, updateProfile } = useAuth();
  const { t, lang, setLang, isRTL } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    businessName: '',
    phone: '',
    email: '',
    licenseNumber: '',
    address: '',
    bitPhone: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.displayName || '',
        businessName: user.businessName || '',
        phone: user.phone || '',
        email: user.email || '',
        licenseNumber: user.licenseNumber || '',
        address: user.address || '',
        bitPhone: user.bitPhone || '',
      });
    }
  }, [user]);

  const dirty = !!user && (
    (form.displayName || '') !== (user.displayName || '')
    || (form.businessName || '') !== (user.businessName || '')
    || (form.phone || '') !== (user.phone || '')
    || (form.email || '') !== (user.email || '')
    || (form.licenseNumber || '') !== (user.licenseNumber || '')
    || (form.address || '') !== (user.address || '')
    || (form.bitPhone || '') !== (user.bitPhone || '')
  );

  const onPickLang = async (code) => {
    if (code === lang || busy) return;
    setBusy(true);
    try {
      await setLang(code);
      const picked = LANGUAGES.find((l) => l.code === code);
      Alert.alert(
        t('settings.langChanged'),
        t('settings.langChangedMsg', { lang: picked?.native || code }),
      );
    } finally {
      setBusy(false);
    }
  };

  const onSaveProfile = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      await updateProfile({
        displayName: form.displayName,
        businessName: form.businessName,
        phone: form.phone,
        email: form.email,
        licenseNumber: form.licenseNumber,
        address: form.address,
        bitPhone: form.bitPhone,
      });
      Alert.alert(t('settings.profileSaved'), t('settings.profileSavedMsg'));
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('settings.profileSaveError'));
    } finally {
      setSaving(false);
    }
  };

  const onLogout = () => {
    Alert.alert(
      t('settings.logoutTitle'),
      t('settings.logoutMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.logoutConfirm'), style: 'destructive', onPress: () => logout() },
      ],
    );
  };

  const toggleProfession = async (id) => {
    if (saving) return;
    const current = user?.professions || ['electrician'];
    let next;
    if (current.includes(id)) {
      next = current.filter((p) => p !== id);
      if (next.length === 0) return; // Must have at least one
    } else {
      next = [...current, id];
    }
    setSaving(true);
    try {
      await updateProfile({ professions: next });
    } catch (e) {
      Alert.alert(t('common.error'), e.message || t('settings.profileSaveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.flex}>
        <LinearGradient
          colors={colors.bgGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView edges={['top']} style={styles.headerWrap}>
          <ScreenHeader
            icon="settings"
            title={t('tabs.settings')}
            subtitle={t('settings.subtitle')}
            showUser={false}
          />
        </SafeAreaView>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Professions */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="work" size={20} color={colors.voltageYellow} />
              <Text style={styles.cardTitle}>{t('settings.myProfessions')}</Text>
            </View>
            <Text style={styles.cardHint}>{t('settings.myProfessionsDesc')}</Text>

            <View style={styles.professionsGrid}>
              {PROFESSIONS.map((p) => {
                const active = (user?.professions || []).includes(p.id);
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => toggleProfession(p.id)}
                    style={[styles.professionCard, active && styles.professionCardActive]}
                    disabled={saving}
                  >
                    <Text style={styles.professionEmoji}>{p.emoji}</Text>
                    <Text style={[styles.professionName, active && styles.professionNameActive]}>
                      {p.label}
                    </Text>
                    {active && (
                      <View style={styles.professionCheck}>
                        <MaterialIcons name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Business Profile */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="business-center" size={20} color={colors.primaryBright} />
              <Text style={styles.cardTitle}>{t('settings.businessProfile')}</Text>
            </View>
            <Text style={styles.cardHint}>{t('settings.businessProfileDesc')}</Text>

            <FormField
              icon="badge"
              label={t('settings.displayName')}
              value={form.displayName}
              onChangeText={(v) => setForm((f) => ({ ...f, displayName: v }))}
              isRTL={isRTL}
            />
            <FormField
              icon="storefront"
              label={t('settings.businessName')}
              placeholder={t('settings.businessNamePh')}
              value={form.businessName}
              onChangeText={(v) => setForm((f) => ({ ...f, businessName: v }))}
              isRTL={isRTL}
            />
            <FormField
              icon="phone"
              label={t('settings.phone')}
              placeholder={t('settings.phonePh')}
              value={form.phone}
              onChangeText={(v) => setForm((f) => ({ ...f, phone: v }))}
              keyboardType="phone-pad"
              isRTL={isRTL}
            />
            <FormField
              icon="email"
              label={t('settings.email')}
              placeholder={t('settings.emailPh')}
              value={form.email}
              onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
              keyboardType="email-address"
              autoCapitalize="none"
              isRTL={isRTL}
            />
            <FormField
              icon="card-membership"
              label={t('settings.licenseNumber')}
              placeholder={t('settings.licenseNumberPh')}
              value={form.licenseNumber}
              onChangeText={(v) => setForm((f) => ({ ...f, licenseNumber: v }))}
              isRTL={isRTL}
            />
            <FormField
              icon="location-on"
              label={t('settings.address')}
              placeholder={t('settings.addressPh')}
              value={form.address}
              onChangeText={(v) => setForm((f) => ({ ...f, address: v }))}
              isRTL={isRTL}
            />
            <FormField
              icon="credit-card"
              label={t('settings.bitPhone')}
              placeholder={t('settings.bitPhonePh')}
              value={form.bitPhone}
              onChangeText={(v) => setForm((f) => ({ ...f, bitPhone: v }))}
              keyboardType="phone-pad"
              isRTL={isRTL}
            />

            <View style={styles.readOnlyRow}>
              <MaterialIcons name="alternate-email" size={16} color={colors.textMuted} />
              <Text style={styles.readOnlyLabel}>{t('settings.username')}:</Text>
              <Text style={styles.readOnlyValue}>{user?.username}</Text>
            </View>

            <Pressable
              onPress={onSaveProfile}
              style={[styles.saveBtn, (!dirty || saving) && styles.saveBtnDisabled]}
              disabled={!dirty || saving}
            >
              <LinearGradient
                colors={[colors.primaryBright, colors.circuitTeal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="save" size={18} color="#fff" />
                  <Text style={styles.saveBtnText}>{t('settings.saveProfile')}</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Language block — paused 2026-05-17. To restore, remove the false && wrapper. */}
          {false && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="language" size={20} color={colors.circuitTeal} />
              <Text style={styles.cardTitle}>{t('settings.language')}</Text>
            </View>
            <Text style={styles.cardHint}>{t('settings.languageDesc')}</Text>

            <View style={styles.langList}>
              {LANGUAGES.map((l) => {
                const active = l.code === lang;
                return (
                  <Pressable
                    key={l.code}
                    onPress={() => onPickLang(l.code)}
                    style={[styles.langRow, active && styles.langRowActive]}
                    disabled={busy}
                  >
                    <Text style={styles.flag}>{l.flag}</Text>
                    <View style={styles.langTextWrap}>
                      <Text style={[styles.langNative, active && styles.langNativeActive]}>
                        {l.native}
                      </Text>
                      <Text style={styles.langLabel}>{l.label}</Text>
                    </View>
                    {active && (
                      <MaterialIcons name="check-circle" size={22} color={colors.liveWire} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.noticeBox}>
              <MaterialIcons name="info-outline" size={16} color={colors.voltageYellow} />
              <Text style={styles.noticeText}>{t('settings.restartHint')}</Text>
            </View>
          </View>
          )}

          {/* Annual report block */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="description" size={20} color={colors.primaryBright} />
              <Text style={styles.cardTitle}>{t('settings.annualReport')}</Text>
            </View>
            <Text style={styles.aboutLine}>{t('settings.annualReportHint')}</Text>
            <AnnualReportPicker user={user} t={t} />
          </View>

          {/* Backup block */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="cloud-upload" size={20} color={colors.liveWire} />
              <Text style={styles.cardTitle}>{t('settings.backup')}</Text>
            </View>
            <Text style={styles.aboutLine}>{t('settings.backupHint')}</Text>
            <BackupActions user={user} t={t} />
          </View>

          {/* Feedback block */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="campaign" size={20} color={colors.primaryBright} />
              <Text style={styles.cardTitle}>{t('feedback.entryTitle')}</Text>
            </View>
            <Text style={styles.aboutLine}>{t('feedback.entryHint')}</Text>
            <Pressable
              onPress={() => setFeedbackOpen(true)}
              style={[styles.feedbackBtn]}
            >
              <MaterialIcons name="campaign" size={20} color="#fff" />
              <Text style={styles.feedbackBtnText}>{t('feedback.title')}</Text>
            </Pressable>
          </View>

          {/* About block */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="bolt" size={20} color={colors.voltageYellow} />
              <Text style={styles.cardTitle}>{t('settings.about')}</Text>
            </View>
            <Text style={styles.aboutLine}>{t('settings.aboutApp')}</Text>
            <Text style={styles.aboutVersion}>v1.0.0</Text>
          </View>

          {/* Logout */}
          <Pressable onPress={onLogout} style={styles.logoutBtn}>
            <LinearGradient
              colors={[colors.danger + 'CC', colors.danger]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
            <MaterialIcons name="logout" size={20} color="#fff" />
            <Text style={styles.logoutText}>{t('settings.logout')}</Text>
          </Pressable>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>

      <FeedbackModal visible={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </KeyboardAvoidingView>
  );
}

function FormField({ icon, label, placeholder, value, onChangeText, keyboardType, autoCapitalize, isRTL }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <MaterialIcons name={icon} size={16} color={colors.textMuted} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'sentences'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  headerWrap: { paddingHorizontal: 14, paddingTop: 8 },
  scroll: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 24 },

  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  cardHint: { color: colors.textMuted, fontSize: 12, marginBottom: 12 },

  field: { marginTop: 10 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  fieldLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  input: {
    paddingVertical: 10, paddingHorizontal: 12,
    fontSize: 14, color: colors.text,
    backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 10,
  },

  readOnlyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginTop: 14, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: colors.dividerDark,
  },
  readOnlyLabel: { color: colors.textMuted, fontSize: 12 },
  readOnlyValue: { color: colors.text, fontSize: 13, fontWeight: '700' },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 46,
    borderRadius: 12, overflow: 'hidden',
    marginTop: 14,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  langList: { gap: 8 },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.dividerDark,
  },
  langRowActive: {
    borderColor: colors.liveWire,
    backgroundColor: 'rgba(22, 199, 132, 0.10)',
  },
  flag: { fontSize: 26 },
  langTextWrap: { flex: 1 },
  langNative: { color: colors.text, fontSize: 15, fontWeight: '700' },
  langNativeActive: { color: colors.liveWire },
  langLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },

  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 214, 10, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.25)',
  },
  noticeText: { color: colors.textMuted, fontSize: 12, flex: 1, lineHeight: 18 },

  aboutLine: { color: colors.textMuted, fontSize: 13, lineHeight: 20 },
  aboutVersion: { color: colors.textFaint, fontSize: 12, marginTop: 8 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },
  logoutText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  professionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, marginTop: 4,
  },
  professionCard: {
    flexBasis: '47%', flexGrow: 1,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.dividerDark,
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  professionCardActive: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primaryBright + '14',
  },
  professionEmoji: { fontSize: 22 },
  professionName: { color: colors.text, fontSize: 13, fontWeight: '700', flex: 1 },
  professionNameActive: { color: colors.primaryBright },
  professionCheck: {
    position: 'absolute', top: 6, end: 6,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.primaryBright,
    alignItems: 'center', justifyContent: 'center',
  },

  feedbackBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12, marginTop: 12,
    backgroundColor: '#25D366',
  },
  feedbackBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
