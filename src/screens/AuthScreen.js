import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../i18n/translations';
import { PROFESSIONS } from '../data/auth';
import ProQuoteLogo from '../components/ProQuoteLogo';

export default function AuthScreen() {
  const { login, register, resetPassword } = useAuth();
  const { t, lang, setLang, isRTL } = useLanguage();
  const [mode, setMode] = useState('login');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [professions, setProfessions] = useState(['electrician']);

  const toggleProfession = (id) => {
    setProfessions((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((p) => p !== id);
        return next.length === 0 ? prev : next;
      }
      return [...prev, id];
    });
  };

  const logoGlow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(logoGlow, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    ).start();
  }, [logoGlow]);

  const glowOpacity = logoGlow.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.7] });

  const isLogin = mode === 'login';
  const inputAlign = isRTL ? 'right' : 'left';

  const submit = async () => {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ displayName, email, password, phone, professions });
      }
    } catch (e) {
      setError(e.message || t('auth.errorFallback'));
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setError(null);
    setInfo(null);
    setMode(isLogin ? 'register' : 'login');
  };

  const submitForgotPassword = async () => {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError(t('auth.forgotPasswordNeedsEmail'));
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email);
      setInfo(t('auth.forgotPasswordSent'));
    } catch (e) {
      setError(e.message || t('auth.errorFallback'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.flex}>
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <MaterialIcons name="request-quote" size={200} color="#fff" style={styles.bgBoltTop} />
      <MaterialIcons name="receipt-long" size={160} color="#fff" style={styles.bgBoltBottom} />

      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            {/* LangPicker paused 2026-05-17 — see memory/stavelectric_i18n_paused.md to restore */}
            {false && (
              <LangPicker
                currentLang={lang}
                onPick={setLang}
                label={t('auth.chooseLang')}
              />
            )}

            <View style={styles.brand}>
              <ProQuoteLogo size={84} gradient={['#2A4FBF', '#4A7AFF']} />
              <Text style={styles.brandText}>מחירן</Text>
              <Text style={styles.brandSub}>{t('auth.tagline')}</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.tabs}>
                <Pressable
                  style={[styles.tab, isLogin && styles.tabActive]}
                  onPress={() => setMode('login')}
                >
                  <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>{t('auth.loginTab')}</Text>
                </Pressable>
                <Pressable
                  style={[styles.tab, !isLogin && styles.tabActive]}
                  onPress={() => setMode('register')}
                >
                  <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>{t('auth.signupTab')}</Text>
                </Pressable>
              </View>

              {!isLogin && (
                <Field
                  label={t('auth.displayName')}
                  placeholder={t('auth.displayNamePh')}
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoCapitalize="words"
                  align={inputAlign}
                />
              )}
              <Field
                label={t('auth.email')}
                placeholder={t('auth.emailPh')}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                align={inputAlign}
              />
              <Field
                label={t('auth.password')}
                placeholder={t('auth.passwordPh')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                align={inputAlign}
                rightIcon={
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                }
              />

              {isLogin && (
                <Pressable onPress={submitForgotPassword} style={styles.forgotLink} hitSlop={6}>
                  <Text style={styles.forgotLinkText}>{t('auth.forgotPassword')}</Text>
                </Pressable>
              )}

              {!isLogin && (
                <>
                  <Field
                    label={t('auth.phone')}
                    placeholder={t('auth.phonePh')}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    align={inputAlign}
                  />

                  <View style={styles.professionsBlock}>
                    <Text style={styles.professionsLabel}>{t('auth.chooseProfessions')}</Text>
                    <Text style={styles.professionsHint}>{t('auth.chooseProfessionsHint')}</Text>
                    <View style={styles.professionsGrid}>
                      {PROFESSIONS.map((p) => {
                        const active = professions.includes(p.id);
                        return (
                          <Pressable
                            key={p.id}
                            onPress={() => toggleProfession(p.id)}
                            style={[styles.professionCard, active && styles.professionCardActive]}
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
                </>
              )}

              {error && (
                <View style={styles.errorBox}>
                  <MaterialIcons name="error-outline" size={18} color={colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {info && (
                <View style={styles.infoBox}>
                  <MaterialIcons name="check-circle-outline" size={18} color={colors.primarySeed} />
                  <Text style={styles.infoText}>{info}</Text>
                </View>
              )}

              <Pressable
                style={[styles.submitWrap, busy && { opacity: 0.7 }]}
                onPress={submit}
                disabled={busy}
              >
                <LinearGradient
                  colors={[colors.primarySeed, colors.circuitTeal]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  {busy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <MaterialIcons name={isLogin ? 'login' : 'person-add'} size={20} color="#fff" />
                      <Text style={styles.submitText}>{isLogin ? t('auth.loginBtn') : t('auth.signupBtn')}</Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>

              <Pressable onPress={switchMode} style={styles.switchLink}>
                <Text style={styles.switchLinkText}>
                  {isLogin ? t('auth.toSignup') : t('auth.toLogin')}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.footer}>{t('auth.footer')}</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function LangPicker({ currentLang, onPick, label }) {
  return (
    <View style={styles.langPickerWrap}>
      <Text style={styles.langPickerLabel}>{label}</Text>
      <View style={styles.langPickerRow}>
        {LANGUAGES.map((l) => {
          const active = l.code === currentLang;
          return (
            <Pressable
              key={l.code}
              onPress={() => onPick(l.code)}
              style={[styles.langChip, active && styles.langChipActive]}
              hitSlop={6}
            >
              <Text style={styles.langChipFlag}>{l.flag}</Text>
              <Text style={[styles.langChipText, active && styles.langChipTextActive]} numberOfLines={1}>
                {l.native}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Field({ label, rightIcon, align, ...rest }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          {...rest}
          style={[styles.input, { textAlign: align || 'right' }]}
          placeholderTextColor="#94A3B8"
        />
        {rightIcon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0A1020' },

  bgBoltTop: {
    position: 'absolute',
    top: -40, left: -30,
    opacity: 0.04,
    transform: [{ rotate: '-15deg' }],
  },
  bgBoltBottom: {
    position: 'absolute',
    bottom: -40, right: -20,
    opacity: 0.05,
    transform: [{ rotate: '20deg' }],
  },

  container: { flexGrow: 1, padding: 22, justifyContent: 'center' },

  langPickerWrap: {
    marginBottom: 18,
    alignItems: 'center',
  },
  langPickerLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  langPickerRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  langChipActive: {
    backgroundColor: 'rgba(30, 91, 255, 0.25)',
    borderColor: colors.primaryBright,
  },
  langChipFlag: { fontSize: 16 },
  langChipText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '700',
  },
  langChipTextActive: {
    color: '#fff',
  },

  brand: { alignItems: 'center', marginBottom: 26 },
  brandGlow: {
    position: 'absolute',
    width: 130, height: 130,
    borderRadius: 65,
    backgroundColor: colors.primarySeed,
    top: -6,
  },
  brandIcon: {
    width: 84, height: 84, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  brandText: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 14, letterSpacing: 0.4 },
  brandSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4, textAlign: 'center' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },

  tabs: { flexDirection: 'row', backgroundColor: colors.surfaceLight, borderRadius: 12, padding: 4, marginBottom: 18 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 2 },
  tabText: { color: colors.textSecondary, fontWeight: '700' },
  tabTextActive: { color: colors.primarySeed },

  field: { marginBottom: 12 },
  fieldLabel: { color: '#475569', fontWeight: '600', fontSize: 13, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.danger + '14',
    borderRadius: 10, padding: 10,
    marginTop: 4, marginBottom: 6,
  },
  errorText: { color: colors.danger, fontWeight: '600', flex: 1, fontSize: 13 },

  infoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.primarySeed + '14',
    borderRadius: 10, padding: 10,
    marginTop: 4, marginBottom: 6,
  },
  infoText: { color: colors.primarySeed, fontWeight: '600', flex: 1, fontSize: 13 },

  forgotLink: { alignItems: 'flex-end', marginTop: -4, marginBottom: 8 },
  forgotLinkText: { color: colors.primarySeed, fontWeight: '700', fontSize: 12 },

  professionsBlock: { marginTop: 8 },
  professionsLabel: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  professionsHint: { color: colors.textMuted, fontSize: 11, marginBottom: 10 },
  professionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8,
  },
  professionCard: {
    flexBasis: '47%', flexGrow: 1,
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.dividerDark,
    gap: 8,
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

  submitWrap: { borderRadius: 14, marginTop: 10, overflow: 'hidden' },
  submitButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14,
  },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  switchLink: { alignItems: 'center', marginTop: 14, paddingVertical: 8 },
  switchLinkText: { color: colors.primarySeed, fontWeight: '700' },

  footer: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', marginTop: 22 },
});
