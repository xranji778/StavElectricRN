import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { loadRates, saveRates } from '../data/storage';
import { CATEGORIES, itemsByCategory } from '../data/catalog';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ScreenHeader from '../components/ScreenHeader';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RatesScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [savedToast, setSavedToast] = useState(false);

  useFocusEffect(useCallback(() => {
    if (!user) return;
    (async () => {
      const r = await loadRates(user.id);
      setRates(r);
      setLoading(false);
    })();
  }, [user]));

  const toggleSection = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const update = (itemId, v) => {
    const cleaned = v.replace(/[^\d.]/g, '');
    const num = cleaned === '' ? 0 : Number(cleaned);
    setRates((prev) => ({ ...prev, [itemId]: Number.isNaN(num) ? 0 : num }));
  };

  const onSave = async () => {
    await saveRates(user.id, rates);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  };

  const filledByCategory = useMemo(() => {
    const out = {};
    for (const cat of CATEGORIES) {
      const items = itemsByCategory(cat.id);
      out[cat.id] = items.filter((i) => Number(rates[i.id] || 0) > 0).length;
    }
    return out;
  }, [rates]);

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
        colors={['#070B1C', '#0B1326', '#070B1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <MaterialIcons name="electric-bolt" size={220} color={colors.primaryBright} style={styles.bgBoltTop} />
      <MaterialIcons name="flash-on" size={160} color={colors.voltageYellow} style={styles.bgBoltBottom} />

      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container}>
          <ScreenHeader
            icon="tune"
            title={t('rates.title')}
            subtitle={t('rates.subtitle')}
          />

          {CATEGORIES.map((cat) => {
            const items = itemsByCategory(cat.id);
            const filled = filledByCategory[cat.id];
            const open = expanded[cat.id];

            return (
              <View key={cat.id} style={[styles.section, open && styles.sectionOpen]}>
                <Pressable style={styles.sectionHead} onPress={() => toggleSection(cat.id)}>
                  <View style={styles.sectionIconWrap}>
                    <MaterialIcons name={cat.icon} size={20} color={colors.primaryBright} />
                  </View>
                  <Text style={styles.sectionTitle}>{t('cat.' + cat.id)}</Text>
                  {filled > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{filled}/{items.length}</Text>
                    </View>
                  )}
                  <MaterialIcons
                    name={open ? 'expand-less' : 'expand-more'}
                    size={24}
                    color={colors.textMuted}
                  />
                </Pressable>

                {open && (
                  <View style={styles.sectionBody}>
                    {items.map((item) => (
                      <View key={item.id} style={styles.field}>
                        <View style={styles.fieldLabelRow}>
                          <Text style={styles.fieldLabel}>{item.label}</Text>
                          <Text style={styles.fieldUnit}>{item.unit}</Text>
                        </View>
                        <View style={styles.inputWrap}>
                          <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={rates[item.id] ? String(rates[item.id]) : ''}
                            onChangeText={(v) => update(item.id, v)}
                            placeholder="0"
                            placeholderTextColor={colors.textFaint}
                          />
                          <Text style={styles.inputSuffix}>₪</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          <Pressable onPress={onSave} style={styles.saveWrap}>
            <LinearGradient
              colors={[colors.primaryBright, colors.circuitTeal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <MaterialIcons name="bolt" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>{t('rates.save')}</Text>
            </LinearGradient>
          </Pressable>

          {savedToast && (
            <View style={styles.toast}>
              <MaterialIcons name="check-circle" size={20} color={colors.liveWire} />
              <Text style={styles.toastText}>{t('rates.savedToast')}</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 32 },

  bgBoltTop: { position: 'absolute', top: -30, left: -40, opacity: 0.035, transform: [{ rotate: '-18deg' }] },
  bgBoltBottom: { position: 'absolute', bottom: 60, right: -30, opacity: 0.04, transform: [{ rotate: '14deg' }] },

  section: {
    backgroundColor: colors.card,
    borderRadius: 16, marginTop: 12,
    overflow: 'hidden',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  sectionOpen: { borderColor: colors.cardBorderActive, shadowColor: colors.primaryBright, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  sectionHead: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14,
  },
  sectionIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: colors.primaryBright + '1A',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.primaryBright + '33',
  },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: colors.text, marginStart: 2 },
  badge: {
    backgroundColor: colors.primaryBright + '22',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1, borderColor: colors.primaryBright + '55',
  },
  badgeText: { color: colors.primaryBright, fontWeight: '800', fontSize: 11 },
  sectionBody: {
    paddingHorizontal: 14, paddingBottom: 14,
    borderTopWidth: 1, borderTopColor: colors.dividerDark,
    backgroundColor: colors.bgSoft,
  },

  field: { marginTop: 12 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  fieldLabel: { color: colors.text, fontSize: 13, fontWeight: '600', flex: 1 },
  fieldUnit: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 12, backgroundColor: colors.cardElevated,
    paddingHorizontal: 14,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text, textAlign: 'right' },
  inputSuffix: { color: colors.voltageYellow, fontWeight: '800', marginStart: 8 },

  saveWrap: { borderRadius: 14, marginTop: 20, overflow: 'hidden',
    shadowColor: colors.primaryBright, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14,
  },
  saveButtonText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center',
    backgroundColor: colors.liveWire + '22',
    borderWidth: 1, borderColor: colors.liveWire + '55',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginTop: 14,
  },
  toastText: { color: colors.text, fontWeight: '700' },
});
