import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../i18n/translations';
import ScreenHeader from '../components/ScreenHeader';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const [busy, setBusy] = useState(false);

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

  return (
    <View style={styles.flex}>
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <ScreenHeader
          icon="settings"
          title={t('tabs.settings')}
          subtitle={t('settings.subtitle')}
          showUser={false}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Language block */}
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

        {/* Profile block */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="person" size={20} color={colors.primaryBright} />
            <Text style={styles.cardTitle}>{t('settings.profile')}</Text>
          </View>

          <ProfileRow icon="badge" label={t('settings.displayName')} value={user?.displayName} />
          <ProfileRow icon="alternate-email" label={t('settings.username')} value={user?.username} />
          <ProfileRow icon="email" label={t('settings.email')} value={user?.email || t('settings.notSet')} />
          <ProfileRow icon="phone" label={t('settings.phone')} value={user?.phone || t('settings.notSet')} />

          <Text style={[styles.cardHint, { marginTop: 12, marginBottom: 0 }]}>{t('settings.editComing')}</Text>
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
          />
          <MaterialIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <View style={styles.profileRow}>
      <MaterialIcons name={icon} size={18} color={colors.textMuted} />
      <View style={styles.profileTextWrap}>
        <Text style={styles.profileLabel}>{label}</Text>
        <Text style={styles.profileValue} numberOfLines={1}>{value}</Text>
      </View>
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

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerDark,
  },
  profileTextWrap: { flex: 1 },
  profileLabel: { color: colors.textMuted, fontSize: 11 },
  profileValue: { color: colors.text, fontSize: 14, fontWeight: '600', marginTop: 2 },

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
});
