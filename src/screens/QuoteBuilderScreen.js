import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { formatILS } from '../utils/currency';
import { CATEGORIES, CATALOG, VAT_RATE, findItem } from '../data/catalog';
import { loadRates, saveQuote, hasAnyRate, updateQuote, getQuoteById } from '../data/storage';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { exportQuoteToPdf } from '../utils/pdf';
import ScreenHeader from '../components/ScreenHeader';

export default function QuoteBuilderScreen({ navigation }) {
  const route = useRoute();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [rates, setRates] = useState({});
  const [quantities, setQuantities] = useState({});
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedToast, setSavedToast] = useState(null);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  const incomingQuoteId = route.params?.quoteId || null;

  useFocusEffect(useCallback(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const r = await loadRates(user.id);
      setRates(r);

      if (incomingQuoteId) {
        const q = await getQuoteById(user.id, incomingQuoteId);
        if (q) {
          const qMap = {};
          (q.items || []).forEach((it) => { qMap[it.id] = it.qty; });
          setQuantities(qMap);
          setClientName(q.clientName || '');
          setProjectName(q.projectName || '');
          setEditingId(q.id);
          setEditingCreatedAt(q.createdAt);
        }
      } else {
        setEditingId(null);
        setEditingCreatedAt(null);
        setQuantities({});
        setClientName('');
        setProjectName('');
      }
      setLoading(false);
    })();
  }, [user, incomingQuoteId]));

  const setQty = (id, delta) => {
    setQuantities((prev) => {
      const curr = prev[id] || 0;
      const next = Math.max(0, curr + delta);
      const out = { ...prev };
      if (next === 0) delete out[id]; else out[id] = next;
      return out;
    });
  };

  const totals = useMemo(() => {
    let subtotal = 0;
    let itemCount = 0;
    for (const item of CATALOG) {
      const qty = quantities[item.id] || 0;
      if (qty > 0) {
        subtotal += qty * (rates[item.id] || 0);
        itemCount += qty;
      }
    }
    const vat = subtotal * VAT_RATE;
    return { subtotal, vat, total: subtotal + vat, itemCount };
  }, [quantities, rates]);

  const buildQuoteObject = useCallback(() => {
    const lineItems = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = findItem(id);
        const unitPrice = rates[id] || 0;
        return { id, label: item?.label || id, qty, unitPrice, lineTotal: qty * unitPrice };
      });
    return {
      id: editingId || String(Date.now()),
      clientName: clientName.trim() || null,
      projectName: projectName.trim() || null,
      itemCount: totals.itemCount,
      subtotal: totals.subtotal,
      vat: totals.vat,
      total: totals.total,
      items: lineItems,
      createdAt: editingCreatedAt || new Date(),
    };
  }, [editingId, editingCreatedAt, clientName, projectName, quantities, rates, totals]);

  const availableItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    return CATALOG.filter((i) => {
      const hasRate = (rates[i.id] || 0) > 0;
      const matches = !s || i.label.toLowerCase().includes(s);
      return hasRate && matches;
    });
  }, [rates, search]);

  const resetForm = () => {
    setQuantities({});
    setClientName('');
    setProjectName('');
    setSearch('');
    setEditingId(null);
    setEditingCreatedAt(null);
    navigation.setParams({ quoteId: undefined });
  };

  const onSave = async () => {
    if (totals.itemCount === 0) return;
    const quote = buildQuoteObject();
    if (editingId) {
      await updateQuote(user.id, editingId, quote);
    } else {
      await saveQuote(user.id, quote);
    }
    setSavedToast(editingId ? t('quote.updatedToast') : t('quote.savedToast'));
    setTimeout(() => {
      setSavedToast(null);
      resetForm();
      navigation.navigate('Home');
    }, 1100);
  };

  const onExport = async () => {
    if (totals.itemCount === 0) {
      Alert.alert(t('quote.nothingToExport'), t('quote.addAtLeastOne'));
      return;
    }
    try {
      setExporting(true);
      await exportQuoteToPdf(buildQuoteObject(), user);
    } catch (e) {
      Alert.alert(t('quote.exportError'), e.message || t('quote.tryAgain'));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryBright} />
      </SafeAreaView>
    );
  }

  if (!hasAnyRate(rates)) {
    return (
      <View style={styles.flex}>
        <BgDecoration />
        <SafeAreaView style={styles.flex} edges={['top']}>
          <ScrollView contentContainerStyle={styles.container}>
            <ScreenHeader icon="receipt-long" title={t('quote.newTitle')} />
            <View style={styles.noRatesCard}>
              <MaterialIcons name="warning-amber" size={44} color={colors.accentAmber} />
              <Text style={styles.noRatesTitle}>{t('quote.noRatesTitle')}</Text>
              <Text style={styles.noRatesSub}>{t('quote.noRatesSub')}</Text>
              <Pressable style={styles.noRatesButton} onPress={() => navigation.navigate('Rates')}>
                <Text style={styles.noRatesButtonText}>{t('quote.openRates')}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <BgDecoration />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            icon={editingId ? 'edit' : 'receipt-long'}
            title={editingId ? t('quote.editTitle') : t('quote.newTitle')}
            subtitle={editingId ? t('quote.editSub') : t('quote.newSub')}
          />

          {editingId && (
            <View style={styles.editBanner}>
              <MaterialIcons name="edit-note" size={20} color={colors.accentAmber} />
              <Text style={styles.editBannerText}>{t('quote.editingBanner')}</Text>
              <Pressable onPress={resetForm}>
                <Text style={styles.editBannerLink}>{t('quote.newAction')}</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.metaCard}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>{t('quote.projectName')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.fieldInput}
                  value={projectName}
                  onChangeText={setProjectName}
                  placeholder={t('quote.projectNamePh')}
                  placeholderTextColor={colors.textFaint}
                />
              </View>
            </View>
            <View style={[styles.field, { marginTop: 12 }]}>
              <Text style={styles.fieldLabel}>{t('quote.clientName')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.fieldInput}
                  value={clientName}
                  onChangeText={setClientName}
                  placeholder={t('quote.clientNamePh')}
                  placeholderTextColor={colors.textFaint}
                />
              </View>
            </View>
          </View>

          <View style={styles.searchWrap}>
            <MaterialIcons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder={t('quote.searchPh')}
              placeholderTextColor={colors.textFaint}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <MaterialIcons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            )}
          </View>

          {availableItems.length === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {search ? t('quote.noMatches') : t('quote.noItemsWithRate')}
              </Text>
              {!search && (
                <Pressable onPress={() => navigation.navigate('Rates')}>
                  <Text style={styles.noResultsLink}>{t('quote.goToRates')}</Text>
                </Pressable>
              )}
            </View>
          )}

          {CATEGORIES.map((cat) => {
            const items = availableItems.filter((i) => i.category === cat.id);
            if (items.length === 0) return null;
            return (
              <View key={cat.id} style={styles.categoryBlock}>
                <View style={styles.categoryHeader}>
                  <MaterialIcons name={cat.icon} size={18} color={colors.voltageYellow} />
                  <Text style={styles.categoryTitle}>{t('cat.' + cat.id)}</Text>
                </View>
                {items.map((item) => {
                  const qty = quantities[item.id] || 0;
                  const price = rates[item.id] || 0;
                  const lineTotal = qty * price;
                  const selected = qty > 0;
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.itemRow,
                        selected && styles.itemRowSelected,
                      ]}
                    >
                      <View style={[styles.itemIconWrap, selected && styles.itemIconWrapSelected]}>
                        <MaterialIcons name={item.icon} size={22} color={selected ? '#fff' : colors.primaryBright} />
                      </View>
                      <View style={{ flex: 1, marginHorizontal: 12 }}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <Text style={styles.itemPrice}>
                          {formatILS(price)} / {item.unit}
                          {lineTotal > 0 ? ` · ${t('home.total')} ${formatILS(lineTotal)}` : ''}
                        </Text>
                      </View>
                      <View style={styles.stepper}>
                        <Pressable style={styles.stepBtn} onPress={() => setQty(item.id, -1)}>
                          <MaterialIcons name="remove" size={18} color={colors.primaryBright} />
                        </Pressable>
                        <Text style={styles.stepValue}>{qty}</Text>
                        <Pressable style={styles.stepBtn} onPress={() => setQty(item.id, 1)}>
                          <MaterialIcons name="add" size={18} color={colors.primaryBright} />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}

          <LinearGradient
            colors={[colors.cardElevated, colors.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.summaryCard}
          >
            <SummaryRow label={t('quote.subtotal')} value={formatILS(totals.subtotal)} />
            <SummaryRow label={t('quote.vat', { pct: Math.round(VAT_RATE * 100) })} value={formatILS(totals.vat)} />
            <View style={styles.summaryDivider} />
            <SummaryRow label={t('quote.total')} value={formatILS(totals.total)} bold />

            <View style={styles.actionsRow}>
              <Pressable style={styles.clearButton} onPress={resetForm}>
                <Text style={styles.clearButtonText}>{t('quote.clear')}</Text>
              </Pressable>

              <Pressable
                style={[styles.pdfButton, totals.itemCount === 0 && { opacity: 0.5 }]}
                onPress={onExport}
                disabled={totals.itemCount === 0 || exporting}
              >
                {exporting ? (
                  <ActivityIndicator color={colors.primaryBright} size="small" />
                ) : (
                  <>
                    <MaterialIcons name="picture-as-pdf" size={18} color={colors.primaryBright} />
                    <Text style={styles.pdfButtonText}>PDF</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={[styles.saveBtnWrap, totals.itemCount === 0 && { opacity: 0.5 }]}
                onPress={onSave}
                disabled={totals.itemCount === 0}
              >
                <LinearGradient
                  colors={[colors.primaryBright, colors.circuitTeal]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButton}
                >
                  <MaterialIcons name="save" size={20} color="#fff" />
                  <Text style={styles.saveButtonText}>{editingId ? t('quote.update') : t('quote.save')}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </LinearGradient>

          {savedToast && (
            <View style={styles.toast}>
              <MaterialIcons name="check-circle" size={20} color={colors.liveWire} />
              <Text style={styles.toastText}>{savedToast}</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function BgDecoration() {
  return (
    <>
      <LinearGradient
        colors={['#070B1C', '#0B1326', '#070B1C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <MaterialIcons name="bolt" size={220} color={colors.primaryBright} style={styles.bgBoltTop} />
      <MaterialIcons name="flash-on" size={170} color={colors.voltageYellow} style={styles.bgBoltBottom} />
    </>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.summaryBold]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 32 },

  bgBoltTop: { position: 'absolute', top: -40, right: -30, opacity: 0.04, transform: [{ rotate: '18deg' }] },
  bgBoltBottom: { position: 'absolute', bottom: 100, left: -20, opacity: 0.035, transform: [{ rotate: '-12deg' }] },

  editBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.accentAmber + '1F',
    borderColor: colors.accentAmber + '88',
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
    marginTop: 12,
  },
  editBannerText: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 13 },
  editBannerLink: { color: colors.primaryBright, fontWeight: '800', fontSize: 13 },

  metaCard: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 14, marginTop: 14,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  field: {},
  fieldLabel: { color: colors.textMuted, fontWeight: '600', fontSize: 13, marginBottom: 6 },
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
    marginTop: 12, borderWidth: 1, borderColor: colors.cardBorder,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, textAlign: 'right', paddingVertical: 4 },

  noResults: {
    backgroundColor: colors.card,
    borderRadius: 14, padding: 18, marginTop: 12, alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  noResultsText: { color: colors.textMuted, fontSize: 13 },
  noResultsLink: { color: colors.primaryBright, fontWeight: '800', marginTop: 6 },

  categoryBlock: { marginTop: 18 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  categoryTitle: { fontSize: 13, fontWeight: '800', color: colors.voltageYellow, letterSpacing: 0.3 },

  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  itemRowSelected: {
    borderColor: colors.cardBorderActive,
    backgroundColor: colors.primaryBright + '12',
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  itemIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: colors.primaryBright + '1F',
    borderWidth: 1, borderColor: colors.primaryBright + '44',
    alignItems: 'center', justifyContent: 'center',
  },
  itemIconWrapSelected: { backgroundColor: colors.primaryBright, borderColor: '#fff' },
  itemLabel: { fontWeight: '700', fontSize: 14, color: colors.text },
  itemPrice: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: colors.primaryBright + '1F',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.primaryBright + '44',
  },
  stepValue: { minWidth: 26, textAlign: 'center', fontWeight: '800', fontSize: 14, color: colors.text },

  summaryCard: {
    borderRadius: 20, padding: 18, marginTop: 20,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  summaryLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  summaryValue: { color: colors.text, fontSize: 14, fontWeight: '700' },
  summaryBold: { fontSize: 18, fontWeight: '800', color: colors.primaryBright },
  summaryDivider: { height: 1, backgroundColor: colors.dividerDark, marginVertical: 8 },

  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  clearButton: {
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12, borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  clearButtonText: { color: colors.textMuted, fontWeight: '700' },
  pdfButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1, borderColor: colors.primaryBright + 'AA',
    backgroundColor: colors.primaryBright + '14',
  },
  pdfButtonText: { color: colors.primaryBright, fontWeight: '800', fontSize: 14 },
  saveBtnWrap: { flex: 1, borderRadius: 12, overflow: 'hidden',
    shadowColor: colors.primaryBright, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8 },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12,
  },
  saveButtonText: { color: '#fff', fontWeight: '800' },

  noRatesCard: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 24, alignItems: 'center', marginTop: 16,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  noRatesTitle: { fontWeight: '800', fontSize: 16, color: colors.text, marginTop: 12 },
  noRatesSub: { color: colors.textMuted, fontSize: 13, marginTop: 4, textAlign: 'center' },
  noRatesButton: { backgroundColor: colors.primaryBright, borderRadius: 12, paddingHorizontal: 22, paddingVertical: 12, marginTop: 16 },
  noRatesButtonText: { color: '#fff', fontWeight: '800' },

  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center',
    backgroundColor: colors.liveWire + '22',
    borderWidth: 1, borderColor: colors.liveWire + '55',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginTop: 14,
  },
  toastText: { color: colors.text, fontWeight: '700' },
});
