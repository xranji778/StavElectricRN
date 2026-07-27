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
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { getProfessionTheme } from '../theme/professionThemes';
import { loadRates, saveRates, loadCustomItems, saveCustomItem, deleteCustomItem } from '../data/storage';
import { categoriesForProfession, itemsByCategory } from '../data/catalog';
import { PROFESSIONS } from '../data/auth';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ScreenHeader from '../components/ScreenHeader';
import ProfessionSwitcher from '../components/ProfessionSwitcher';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RatesScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = getProfessionTheme(user?.activeProfession);
  const [rates, setRates] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [expandedFamilies, setExpandedFamilies] = useState({});
  const [savedToast, setSavedToast] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customModalCategory, setCustomModalCategory] = useState(null);
  const [customForm, setCustomForm] = useState({ label: '', unit: 'piece', price: '' });

  useFocusEffect(useCallback(() => {
    if (!user) return;
    (async () => {
      const [r, ci] = await Promise.all([loadRates(user.id), loadCustomItems(user.id)]);
      setRates(r);
      setCustomItems(ci);
      setLoading(false);
    })();
  }, [user]));

  const toggleSection = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFamily = (familyId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFamilies((prev) => ({ ...prev, [familyId]: !prev[familyId] }));
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

  const activeProfession = user?.activeProfession;

  const openCustomModal = (categoryId) => {
    setCustomModalCategory(categoryId);
    setCustomForm({ label: '', unit: 'piece', price: '' });
    setCustomModalOpen(true);
  };

  const closeCustomModal = () => {
    setCustomModalOpen(false);
    setCustomModalCategory(null);
  };

  const submitCustomItem = async () => {
    const label = customForm.label.trim();
    if (!label) {
      Alert.alert(t('rates.customNameRequired'));
      return;
    }
    const price = Number(String(customForm.price).replace(/[^\d.]/g, '')) || 0;
    const item = {
      label,
      unit: customForm.unit,
      category: customModalCategory,
      profession: activeProfession || null,
    };
    const next = await saveCustomItem(user.id, item);
    setCustomItems(next);
    const newest = next.find((i) => i.label === label && i.category === customModalCategory);
    if (newest && price > 0) {
      const nextRates = { ...rates, [newest.id]: price };
      setRates(nextRates);
      await saveRates(user.id, nextRates);
    }
    closeCustomModal();
  };

  const onDeleteCustom = (item) => {
    Alert.alert(
      t('rates.customDeleteConfirm'),
      t('rates.customDeleteMessage'),
      [
        { text: t('rates.customCancel'), style: 'cancel' },
        {
          text: t('common.delete') || 'מחק',
          style: 'destructive',
          onPress: async () => {
            const next = await deleteCustomItem(user.id, item.id);
            setCustomItems(next);
            const nextRates = { ...rates };
            delete nextRates[item.id];
            setRates(nextRates);
            await saveRates(user.id, nextRates);
          },
        },
      ],
    );
  };

  const customByCategory = useMemo(() => {
    const out = {};
    for (const ci of customItems) {
      if (ci.profession && activeProfession && ci.profession !== activeProfession) continue;
      if (!out[ci.category]) out[ci.category] = [];
      out[ci.category].push(ci);
    }
    return out;
  }, [customItems, activeProfession]);

  const visibleCategories = useMemo(
    () => categoriesForProfession(activeProfession),
    [activeProfession],
  );

  const filledByCategory = useMemo(() => {
    const out = {};
    for (const cat of visibleCategories) {
      const items = itemsByCategory(cat.id);
      const customs = customByCategory[cat.id] || [];
      const filledBuiltin = items.filter((i) => Number(rates[i.id] || 0) > 0).length;
      const filledCustom = customs.filter((i) => Number(rates[i.id] || 0) > 0).length;
      out[cat.id] = filledBuiltin + filledCustom;
    }
    return out;
  }, [rates, visibleCategories, customByCategory]);

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
      <MaterialIcons name={theme.bgIconPrimary} size={180} color="#fff" style={styles.bgBoltTop} />
      <MaterialIcons name={theme.bgIconSecondary} size={135} color="#fff" style={styles.bgBoltBottom} />

      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container}>
          <ScreenHeader
            icon="tune"
            title={t('rates.title')}
            subtitle={t('rates.subtitle')}
          />

          <ProfessionSwitcher />

          {visibleCategories.map((cat) => {
            const items = itemsByCategory(cat.id);
            const customs = customByCategory[cat.id] || [];
            const totalCount = items.length + customs.length;
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
                      <Text style={styles.badgeText}>{filled}/{totalCount}</Text>
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
                    {(() => {
                      const rendered = [];
                      const seenFamilies = new Set();
                      for (const item of items) {
                        if (item.family) {
                          if (seenFamilies.has(item.family)) continue;
                          seenFamilies.add(item.family);
                          const familyItems = items.filter((i) => i.family === item.family);
                          const famOpen = !!expandedFamilies[item.family];
                          const famFilled = familyItems.filter((i) => Number(rates[i.id] || 0) > 0).length;
                          rendered.push(
                            <View key={'fam_' + item.family} style={[styles.familyGroup, famOpen && styles.familyGroupOpen]}>
                              <Pressable style={styles.familyHead} onPress={() => toggleFamily(item.family)}>
                                <Text style={styles.familyTitle}>{t('family.' + item.family)}</Text>
                                {famFilled > 0 && (
                                  <View style={styles.familyBadge}>
                                    <Text style={styles.familyBadgeText}>{famFilled}/{familyItems.length}</Text>
                                  </View>
                                )}
                                <MaterialIcons
                                  name={famOpen ? 'expand-less' : 'expand-more'}
                                  size={22}
                                  color={colors.textMuted}
                                />
                              </Pressable>
                              {famOpen && (
                                <View style={styles.familyBody}>
                                  {familyItems.map((sub) => (
                                    <View key={sub.id} style={styles.field}>
                                      <View style={styles.fieldLabelRow}>
                                        <Text style={styles.fieldLabel}>{sub.size}{sub.sizeUnit || ' mm'}</Text>
                                        <Text style={styles.fieldUnit}>{t('unit.' + sub.unit)}</Text>
                                      </View>
                                      <View style={styles.inputWrap}>
                                        <TextInput
                                          style={styles.input}
                                          keyboardType="numeric"
                                          value={rates[sub.id] ? String(rates[sub.id]) : ''}
                                          onChangeText={(v) => update(sub.id, v)}
                                          placeholder="0"
                                          placeholderTextColor={colors.textFaint}
                                        />
                                        <Text style={styles.inputSuffix}>₪</Text>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              )}
                            </View>,
                          );
                        } else {
                          rendered.push(
                            <View key={item.id} style={styles.field}>
                              <View style={styles.fieldLabelRow}>
                                <Text style={styles.fieldLabel}>{t('item.' + item.id)}</Text>
                                <Text style={styles.fieldUnit}>{t('unit.' + item.unit)}</Text>
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
                            </View>,
                          );
                        }
                      }

                      for (const ci of customs) {
                        rendered.push(
                          <View key={ci.id} style={styles.field}>
                            <View style={styles.fieldLabelRow}>
                              <View style={styles.customLabelWrap}>
                                <Text style={styles.fieldLabel} numberOfLines={2}>{ci.label}</Text>
                                <View style={styles.customBadge}>
                                  <Text style={styles.customBadgeText}>{t('rates.customBadge')}</Text>
                                </View>
                              </View>
                              <Text style={styles.fieldUnit}>{t('unit.' + ci.unit)}</Text>
                            </View>
                            <View style={styles.customRow}>
                              <View style={[styles.inputWrap, styles.customInputWrap]}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  value={rates[ci.id] ? String(rates[ci.id]) : ''}
                                  onChangeText={(v) => update(ci.id, v)}
                                  placeholder="0"
                                  placeholderTextColor={colors.textFaint}
                                />
                                <Text style={styles.inputSuffix}>₪</Text>
                              </View>
                              <Pressable onPress={() => onDeleteCustom(ci)} style={styles.deleteBtn} hitSlop={8}>
                                <MaterialIcons name="delete-outline" size={22} color={colors.accentAmber || '#E2A03F'} />
                              </Pressable>
                            </View>
                          </View>,
                        );
                      }

                      rendered.push(
                        <Pressable
                          key={'add_custom_' + cat.id}
                          onPress={() => openCustomModal(cat.id)}
                          style={styles.addCustomBtn}
                        >
                          <MaterialIcons name="add-circle-outline" size={20} color={colors.primaryBright} />
                          <Text style={styles.addCustomText}>{t('rates.addCustom')}</Text>
                        </Pressable>,
                      );

                      return rendered;
                    })()}
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

      <Modal visible={customModalOpen} transparent animationType="fade" onRequestClose={closeCustomModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="add-circle-outline" size={22} color={colors.primaryBright} />
              <Text style={styles.modalTitle}>{t('rates.customModalTitle')}</Text>
            </View>
            <Text style={styles.modalSubtitle}>{t('rates.customModalSubtitle')}</Text>

            <Text style={styles.modalFieldLabel}>{t('rates.customNameLabel')}</Text>
            <TextInput
              style={styles.modalInput}
              value={customForm.label}
              onChangeText={(v) => setCustomForm((prev) => ({ ...prev, label: v }))}
              placeholder={t('rates.customNamePlaceholder')}
              placeholderTextColor={colors.textFaint}
            />

            <Text style={styles.modalFieldLabel}>{t('rates.customUnitLabel')}</Text>
            <View style={styles.unitRow}>
              {[
                { id: 'piece', label: t('unit.piece') },
                { id: 'meter', label: t('unit.meter') },
                { id: 'point', label: t('unit.point') },
              ].map((u) => (
                <Pressable
                  key={u.id}
                  onPress={() => setCustomForm((prev) => ({ ...prev, unit: u.id }))}
                  style={[styles.unitChip, customForm.unit === u.id && styles.unitChipActive]}
                >
                  <Text style={[styles.unitChipText, customForm.unit === u.id && styles.unitChipTextActive]}>
                    {u.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.modalFieldLabel}>{t('rates.customPriceLabel')}</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={customForm.price}
                onChangeText={(v) => setCustomForm((prev) => ({ ...prev, price: v }))}
                placeholder="0"
                placeholderTextColor={colors.textFaint}
              />
              <Text style={styles.inputSuffix}>₪</Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={closeCustomModal} style={[styles.modalBtn, styles.modalBtnGhost]}>
                <Text style={styles.modalBtnGhostText}>{t('rates.customCancel')}</Text>
              </Pressable>
              <Pressable onPress={submitCustomItem} style={[styles.modalBtn, styles.modalBtnPrimary]}>
                <Text style={styles.modalBtnPrimaryText}>{t('rates.customSave')}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 32 },

  bgBoltTop: { position: 'absolute', top: -20, left: -20, opacity: 0.08, transform: [{ rotate: '-18deg' }] },
  bgBoltBottom: { position: 'absolute', bottom: 60, right: -20, opacity: 0.08, transform: [{ rotate: '14deg' }] },

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

  familyGroup: {
    marginTop: 12,
    backgroundColor: colors.primaryBright + '0F',
    borderRadius: 12,
    borderWidth: 1, borderColor: colors.primaryBright + '22',
    overflow: 'hidden',
  },
  familyGroupOpen: {
    paddingBottom: 10,
    borderColor: colors.primaryBright + '55',
  },
  familyHead: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  familyTitle: {
    color: colors.primaryBright, fontWeight: '800', fontSize: 13,
    flex: 1,
  },
  familyBadge: {
    backgroundColor: colors.primaryBright + '22',
    borderRadius: 999, paddingHorizontal: 9, paddingVertical: 2,
    borderWidth: 1, borderColor: colors.primaryBright + '55',
  },
  familyBadgeText: { color: colors.primaryBright, fontWeight: '800', fontSize: 11 },
  familyBody: { paddingHorizontal: 12, paddingTop: 2 },

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

  customLabelWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  customBadge: {
    backgroundColor: colors.voltageYellow + '22',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: colors.voltageYellow + '55',
  },
  customBadgeText: { color: colors.voltageYellow, fontWeight: '800', fontSize: 10 },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  customInputWrap: { flex: 1 },
  deleteBtn: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: colors.cardBorder + '55',
    alignItems: 'center', justifyContent: 'center',
  },

  addCustomBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 14, paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryBright + '88',
    backgroundColor: colors.primaryBright + '0F',
  },
  addCustomText: { color: colors.primaryBright, fontWeight: '800', fontSize: 13 },

  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 18,
  },
  modalCard: {
    width: '100%', maxWidth: 420, backgroundColor: colors.card,
    borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.cardBorderActive,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  modalTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  modalSubtitle: { color: colors.textMuted, fontSize: 12, marginBottom: 14 },
  modalFieldLabel: { color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 10 },
  modalInput: {
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: colors.cardElevated, color: colors.text,
    fontSize: 15, textAlign: 'right',
  },

  unitRow: { flexDirection: 'row', gap: 8 },
  unitChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1, borderColor: colors.cardBorder,
    backgroundColor: colors.cardElevated,
  },
  unitChipActive: {
    backgroundColor: colors.primaryBright + '22',
    borderColor: colors.primaryBright,
  },
  unitChipText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  unitChipTextActive: { color: colors.primaryBright },

  modalActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  modalBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  modalBtnGhost: { borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: 'transparent' },
  modalBtnGhostText: { color: colors.textMuted, fontWeight: '700' },
  modalBtnPrimary: { backgroundColor: colors.primaryBright },
  modalBtnPrimaryText: { color: '#fff', fontWeight: '800' },
});
