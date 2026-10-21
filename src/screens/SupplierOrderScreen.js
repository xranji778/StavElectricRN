import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../theme/colors';
import { getProfessionTheme } from '../theme/professionThemes';
import { CATALOG, categoriesForProfession, itemBelongsToProfession, isMaterialItem } from '../data/catalog';
import { loadCustomItems, saveCustomItem } from '../data/storage';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { exportSupplierPdf } from '../utils/pdf';
import ScreenHeader from '../components/ScreenHeader';
import ProfessionSwitcher from '../components/ProfessionSwitcher';

// הזמנת חומרים מספק — בלי קשר להצעת מחיר (למשל השלמת מלאי לרכב).
// הטיוטה נשמרת במכשיר כדי שרשימה ארוכה לא תלך לאיבוד אם יוצאים מהמסך.
const DRAFT_PREFIX = 'mechiron.supplierOrderDraft.';

const CUSTOM_UNITS = ['piece', 'meter'];

export default function SupplierOrderScreen({ navigation }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = getProfessionTheme(user?.activeProfession);
  const activeProfession = user?.activeProfession;

  const [quantities, setQuantities] = useState({});
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [customItems, setCustomItems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedFamilies, setExpandedFamilies] = useState({});
  const [qtyEditingId, setQtyEditingId] = useState(null);
  const [qtyEditingValue, setQtyEditingValue] = useState('');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customForm, setCustomForm] = useState({ label: '', unit: 'piece', qty: '1' });
  const [exporting, setExporting] = useState(false);
  const draftLoaded = useRef(false);

  const draftKey = user?.id ? DRAFT_PREFIX + user.id : null;

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      loadCustomItems(user.id).then(setCustomItems).catch(() => {});
    }, [user?.id]),
  );

  useEffect(() => {
    if (!draftKey) return;
    draftLoaded.current = false;
    AsyncStorage.getItem(draftKey)
      .then((raw) => {
        if (!raw) return;
        const d = JSON.parse(raw);
        setQuantities(d.quantities || {});
        setProjectName(d.projectName || '');
        setNotes(d.notes || '');
      })
      .catch(() => {})
      .finally(() => { draftLoaded.current = true; });
  }, [draftKey]);

  useEffect(() => {
    if (!draftKey || !draftLoaded.current) return;
    AsyncStorage.setItem(draftKey, JSON.stringify({ quantities, projectName, notes })).catch(() => {});
  }, [draftKey, quantities, projectName, notes]);

  const allItems = useMemo(
    () => [...CATALOG, ...customItems.map((ci) => ({ ...ci, isCustom: true }))],
    [customItems],
  );
  const findAnyItem = useCallback((id) => allItems.find((i) => i.id === id) || null, [allItems]);

  const materialItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    return allItems.filter((i) => {
      if (i.hidden || !isMaterialItem(i)) return false;
      const inProfession = i.isCustom
        ? (!i.profession || !activeProfession || i.profession === activeProfession)
        : itemBelongsToProfession(i, activeProfession);
      if (!inProfession) return false;
      if (!s) return true;
      const label = i.isCustom ? i.label : t('item.' + i.id);
      const familyLabel = i.family ? t('family.' + i.family) : '';
      return label.toLowerCase().includes(s)
        || (i.label && i.label.toLowerCase().includes(s))
        || (familyLabel && familyLabel.toLowerCase().includes(s));
    });
  }, [allItems, search, activeProfession, t]);

  const categories = useMemo(() => categoriesForProfession(activeProfession), [activeProfession]);

  const selectedCount = Object.values(quantities).filter((q) => q > 0).length;

  const setQty = (id, delta) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      const out = { ...prev };
      if (next === 0) delete out[id]; else out[id] = next;
      return out;
    });
  };

  const confirmQtyEditor = () => {
    if (qtyEditingId) {
      const next = Math.max(0, Math.floor(Number(qtyEditingValue) || 0));
      setQuantities((prev) => {
        const out = { ...prev };
        if (next === 0) delete out[qtyEditingId]; else out[qtyEditingId] = next;
        return out;
      });
    }
    setQtyEditingId(null);
    setQtyEditingValue('');
  };

  const onClear = () => {
    if (selectedCount === 0) return;
    Alert.alert(t('supplier.clearTitle'), t('supplier.clearMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('supplier.clearConfirm'),
        style: 'destructive',
        onPress: () => { setQuantities({}); setProjectName(''); setNotes(''); },
      },
    ]);
  };

  const submitCustomMaterial = async () => {
    const label = customForm.label.trim();
    if (!label) {
      Alert.alert(t('rates.customNameRequired'));
      return;
    }
    const qty = Math.max(1, Math.floor(Number(String(customForm.qty).replace(/[^\d]/g, '')) || 1));
    const nextCustoms = await saveCustomItem(user.id, {
      label,
      unit: customForm.unit,
      category: 'misc',
      profession: activeProfession || null,
      isMaterial: true,
    });
    setCustomItems(nextCustoms);
    const created = nextCustoms.find((i) => i.label === label && i.isMaterial);
    if (created) setQuantities((prev) => ({ ...prev, [created.id]: (prev[created.id] || 0) + qty }));
    setCustomModalOpen(false);
  };

  const onSend = async () => {
    const materials = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = findAnyItem(id);
        return {
          id,
          label: item ? (item.isCustom ? item.label : t('item.' + id)) : id,
          qty,
          unit: item?.unit || null,
        };
      });
    if (materials.length === 0) {
      Alert.alert(t('quote.noMaterialsTitle'), t('supplier.emptyMsg'));
      return;
    }
    try {
      setExporting(true);
      await exportSupplierPdf({
        projectName: projectName.trim() || null,
        supplierNotes: notes.trim() || null,
        createdAt: new Date(),
        materials,
      }, user);
    } catch (e) {
      Alert.alert(t('quote.exportError'), e.message || t('quote.tryAgain'));
    } finally {
      setExporting(false);
    }
  };

  const renderStepper = (id, qty) => (
    <View style={styles.stepper}>
      <Pressable style={styles.stepBtn} onPress={() => setQty(id, -1)}>
        <MaterialIcons name="remove" size={18} color={colors.primaryBright} />
      </Pressable>
      <Pressable onPress={() => { setQtyEditingId(id); setQtyEditingValue(String(qty || '')); }} hitSlop={6}>
        <Text style={styles.stepValue}>{qty}</Text>
      </Pressable>
      <Pressable style={styles.stepBtn} onPress={() => setQty(id, 1)}>
        <MaterialIcons name="add" size={18} color={colors.primaryBright} />
      </Pressable>
    </View>
  );

  const renderItemRow = (item, { sizeOnly = false } = {}) => {
    const qty = quantities[item.id] || 0;
    const selected = qty > 0;
    return (
      <View key={item.id} style={[styles.itemRow, selected && styles.itemRowSelected]}>
        {sizeOnly ? (
          <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
            <Text style={[styles.sizeText, selected && { color: '#fff' }]} numberOfLines={1} adjustsFontSizeToFit>{item.size}</Text>
          </View>
        ) : (
          <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
            <MaterialIcons name={item.icon || (item.isCustom ? 'star' : 'category')} size={22} color={selected ? '#fff' : colors.primaryBright} />
          </View>
        )}
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={styles.itemLabel} numberOfLines={2}>
            {sizeOnly ? `${item.size}${item.sizeUnit ?? ' mm'}` : (item.isCustom ? item.label : t('item.' + item.id))}
          </Text>
          <Text style={styles.itemUnit}>{t('unit.' + item.unit)}</Text>
        </View>
        {renderStepper(item.id, qty)}
      </View>
    );
  };

  const isSearching = search.trim().length > 0;

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <ScreenHeader icon="local-shipping" title={t('supplier.title')} />

          <Pressable style={styles.backRow} onPress={() => navigation.navigate('Home')} hitSlop={8}>
            <MaterialIcons name="arrow-forward" size={20} color={colors.textMuted} />
            <Text style={styles.backText}>{t('supplier.back')}</Text>
          </Pressable>

          <ProfessionSwitcher />

          <View style={styles.introCard}>
            <MaterialIcons name="inventory-2" size={22} color={colors.voltageYellow} />
            <Text style={styles.introText}>{t('supplier.intro')}</Text>
          </View>

          <View style={styles.metaCard}>
            <Text style={styles.fieldLabel}>{t('supplier.projectLabel')}</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.fieldInput}
                value={projectName}
                onChangeText={setProjectName}
                placeholder={t('supplier.projectPh')}
                placeholderTextColor={colors.textFaint}
              />
            </View>
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>{t('supplier.notesLabel')}</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={[styles.fieldInput, { minHeight: 60, textAlignVertical: 'top' }]}
                value={notes}
                onChangeText={setNotes}
                placeholder={t('supplier.notesPh')}
                placeholderTextColor={colors.textFaint}
                multiline
              />
            </View>
          </View>

          <View style={styles.searchWrap}>
            <MaterialIcons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder={t('quote.searchMaterialsPh')}
              placeholderTextColor={colors.textFaint}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <MaterialIcons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          <Pressable
            onPress={() => { setCustomForm({ label: '', unit: 'piece', qty: '1' }); setCustomModalOpen(true); }}
            style={styles.addCustomBtn}
          >
            <MaterialIcons name="add-circle-outline" size={20} color={colors.primaryBright} />
            <Text style={styles.addCustomText}>{t('quote.addCustomMaterial')}</Text>
          </Pressable>

          {materialItems.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>{isSearching ? t('quote.noMatches') : t('quote.noMaterialsForProf')}</Text>
            </View>
          )}

          {categories.map((cat) => {
            const items = materialItems.filter((i) => i.category === cat.id);
            if (items.length === 0) return null;
            const open = isSearching || !!expandedCategories[cat.id];
            const catCount = items.filter((i) => (quantities[i.id] || 0) > 0).length;

            const rendered = [];
            const seenFamilies = new Set();
            for (const item of items) {
              if (!item.family) {
                rendered.push(renderItemRow(item));
                continue;
              }
              if (seenFamilies.has(item.family)) continue;
              seenFamilies.add(item.family);
              const familyItems = items.filter((i) => i.family === item.family);
              const famCount = familyItems.filter((i) => (quantities[i.id] || 0) > 0).length;
              const famOpen = isSearching || !!expandedFamilies[item.family];
              rendered.push(
                <View key={'fam_' + item.family} style={{ marginBottom: 4 }}>
                  <Pressable
                    style={[styles.itemRow, famCount > 0 && styles.itemRowSelected]}
                    onPress={() => setExpandedFamilies((p) => ({ ...p, [item.family]: !p[item.family] }))}
                  >
                    <View style={[styles.iconWrap, famCount > 0 && styles.iconWrapSelected]}>
                      <MaterialIcons name={item.icon} size={22} color={famCount > 0 ? '#fff' : colors.primaryBright} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                      <Text style={styles.itemLabel}>{t('family.' + item.family)}</Text>
                      <Text style={styles.itemUnit}>
                        {famCount > 0 ? t('supplier.sizesChosen', { n: famCount }) : t('family.chooseSize')}
                      </Text>
                    </View>
                    <MaterialIcons name={famOpen ? 'expand-less' : 'expand-more'} size={26} color={colors.textMuted} />
                  </Pressable>
                  {famOpen && (
                    <View style={styles.familySizesWrap}>
                      {familyItems.map((fi) => renderItemRow(fi, { sizeOnly: true }))}
                    </View>
                  )}
                </View>,
              );
            }

            return (
              <View key={cat.id} style={{ marginTop: 12 }}>
                <Pressable
                  style={[styles.categoryHeader, catCount > 0 && styles.categoryHeaderActive]}
                  onPress={() => setExpandedCategories((p) => ({ ...p, [cat.id]: !p[cat.id] }))}
                  disabled={isSearching}
                >
                  <MaterialIcons name={cat.icon} size={18} color={colors.voltageYellow} />
                  <Text style={styles.categoryTitle}>{t('cat.' + cat.id)}</Text>
                  {catCount > 0 && (
                    <View style={styles.categoryCountBadge}>
                      <Text style={styles.categoryCountText}>{catCount}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }} />
                  {!isSearching && (
                    <MaterialIcons name={open ? 'expand-less' : 'expand-more'} size={22} color={colors.textMuted} />
                  )}
                </Pressable>
                {open && rendered}
              </View>
            );
          })}

          <Pressable
            style={[styles.sendBtn, { backgroundColor: theme.accent }, selectedCount === 0 && { opacity: 0.5 }]}
            onPress={onSend}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="local-shipping" size={22} color="#fff" />
                <View style={{ marginHorizontal: 10, flex: 1 }}>
                  <Text style={styles.sendTitle}>{t('supplier.send')}</Text>
                  <Text style={styles.sendSub}>
                    {selectedCount > 0 ? t('quote.materialsSelected', { n: selectedCount }) : t('quote.supplierPdfHint')}
                  </Text>
                </View>
                <MaterialIcons name="chevron-left" size={24} color="#fff" />
              </>
            )}
          </Pressable>

          {selectedCount > 0 && (
            <Pressable style={styles.clearBtn} onPress={onClear}>
              <MaterialIcons name="delete-outline" size={18} color={colors.textMuted} />
              <Text style={styles.clearText}>{t('supplier.clear')}</Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal visible={!!qtyEditingId} animationType="fade" transparent onRequestClose={() => setQtyEditingId(null)}>
        <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalBackdrop} onPress={() => setQtyEditingId(null)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('quote.qtyEditorTitle')}</Text>
            <TextInput
              style={styles.qtyInput}
              value={qtyEditingValue}
              onChangeText={setQtyEditingValue}
              keyboardType="number-pad"
              autoFocus
              selectTextOnFocus
              onSubmitEditing={confirmQtyEditor}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setQtyEditingId(null)}>
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={confirmQtyEditor}>
                <MaterialIcons name="check" size={18} color="#fff" />
                <Text style={styles.modalConfirmText}>{t('common.ok')}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={customModalOpen} transparent animationType="fade" onRequestClose={() => setCustomModalOpen(false)}>
        <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.modalBackdrop} onPress={() => setCustomModalOpen(false)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('quote.customMaterialTitle')}</Text>
            <Text style={styles.modalSub}>{t('quote.customMaterialSub')}</Text>
            <Text style={styles.fieldLabel}>{t('rates.customNameLabel')}</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.fieldInput}
                value={customForm.label}
                onChangeText={(v) => setCustomForm((p) => ({ ...p, label: v }))}
                placeholder={t('supplier.customNamePh')}
                placeholderTextColor={colors.textFaint}
              />
            </View>
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>{t('rates.customUnitLabel')}</Text>
            <View style={styles.unitRow}>
              {CUSTOM_UNITS.map((u) => (
                <Pressable
                  key={u}
                  onPress={() => setCustomForm((p) => ({ ...p, unit: u }))}
                  style={[styles.unitChip, customForm.unit === u && styles.unitChipActive]}
                >
                  <Text style={[styles.unitChipText, customForm.unit === u && { color: '#fff' }]}>{t('unit.' + u)}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>{t('quote.customQty')}</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.fieldInput}
                keyboardType="numeric"
                value={customForm.qty}
                onChangeText={(v) => setCustomForm((p) => ({ ...p, qty: v }))}
                placeholder="1"
                placeholderTextColor={colors.textFaint}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setCustomModalOpen(false)}>
                <Text style={styles.modalCancelText}>{t('rates.customCancel')}</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={submitCustomMaterial}>
                <Text style={styles.modalConfirmText}>{t('rates.customSave')}</Text>
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
  container: { padding: 16, paddingBottom: 60 },

  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, alignSelf: 'flex-start' },
  backText: { color: colors.textMuted, fontWeight: '700', fontSize: 14 },

  introCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginTop: 14, padding: 14,
    borderRadius: 16,
    borderWidth: 1, borderColor: colors.voltageYellow + '66',
    backgroundColor: colors.voltageYellow + '12',
  },
  introText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 19, textAlign: 'right' },

  metaCard: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 14, marginTop: 14,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  fieldLabel: { color: colors.textMuted, fontWeight: '600', fontSize: 13, marginBottom: 6, textAlign: 'right' },
  inputWrap: {
    borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 12, backgroundColor: colors.cardElevated,
    paddingHorizontal: 12,
  },
  fieldInput: { paddingVertical: 10, fontSize: 15, color: colors.text, textAlign: 'right' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.card,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
    marginTop: 14, borderWidth: 1, borderColor: colors.cardBorder,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, textAlign: 'right', paddingVertical: 4 },

  addCustomBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 10, paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryBright + '88',
    backgroundColor: colors.primaryBright + '0F',
  },
  addCustomText: { color: colors.primaryBright, fontWeight: '800', fontSize: 13 },

  noResults: {
    backgroundColor: colors.card,
    borderRadius: 14, padding: 18, marginTop: 12, alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  noResultsText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },

  categoryHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
    marginBottom: 8,
  },
  categoryHeaderActive: { borderColor: colors.primaryBright + 'AA', backgroundColor: colors.primaryBright + '0A' },
  categoryTitle: { fontSize: 14, fontWeight: '800', color: colors.voltageYellow },
  categoryCountBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.primaryBright + '33',
    borderWidth: 1, borderColor: colors.primaryBright + '66',
  },
  categoryCountText: { color: colors.primaryBright, fontWeight: '800', fontSize: 11 },

  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  itemRowSelected: { borderColor: colors.cardBorderActive, backgroundColor: colors.primaryBright + '12' },
  iconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: colors.primaryBright + '1F',
    borderWidth: 1, borderColor: colors.primaryBright + '44',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 2,
  },
  iconWrapSelected: { backgroundColor: colors.primaryBright, borderColor: '#fff' },
  sizeText: { color: colors.primaryBright, fontWeight: '800', fontSize: 12 },
  itemLabel: { fontWeight: '700', fontSize: 14, color: colors.text, textAlign: 'right' },
  itemUnit: { color: colors.textMuted, fontSize: 12, marginTop: 2, textAlign: 'right' },
  familySizesWrap: {
    paddingHorizontal: 8, paddingTop: 4, paddingBottom: 2,
    marginTop: -4, marginBottom: 8,
    borderRadius: 14,
    backgroundColor: colors.primaryBright + '0A',
    borderWidth: 1, borderColor: colors.primaryBright + '22',
    borderTopWidth: 0,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.primaryBright + '1F',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.primaryBright + '44',
  },
  stepValue: { minWidth: 30, textAlign: 'center', fontWeight: '800', fontSize: 14, color: colors.text },

  sendBtn: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 20, paddingVertical: 16, paddingHorizontal: 16,
    borderRadius: 18,
  },
  sendTitle: { color: '#fff', fontWeight: '900', fontSize: 16 },
  sendSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, paddingVertical: 8 },
  clearText: { color: colors.textMuted, fontWeight: '700' },

  modalRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalCard: {
    width: '100%', maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  modalTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 8, textAlign: 'right' },
  modalSub: { color: colors.textMuted, fontSize: 12, marginBottom: 12, textAlign: 'right' },
  qtyInput: {
    backgroundColor: colors.cardElevated,
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14,
    color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  unitRow: { flexDirection: 'row', gap: 8 },
  unitChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.cardElevated,
  },
  unitChipActive: { backgroundColor: colors.primaryBright, borderColor: colors.primaryBright },
  unitChipText: { color: colors.textMuted, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  modalCancel: {
    flex: 1, paddingVertical: 12,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  modalCancelText: { color: colors.textMuted, fontWeight: '800' },
  modalConfirm: {
    flex: 1, paddingVertical: 12,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 6,
    backgroundColor: colors.primaryBright,
  },
  modalConfirmText: { color: '#fff', fontWeight: '900' },
});
