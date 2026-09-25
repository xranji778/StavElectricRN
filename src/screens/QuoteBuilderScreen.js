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
  Modal,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { getProfessionTheme } from '../theme/professionThemes';
import { formatILS } from '../utils/currency';
import { CATALOG, VAT_RATE, findItem, categoriesForProfession, itemBelongsToProfession } from '../data/catalog';
import { loadRates, saveRates, saveQuote, hasAnyRate, updateQuote, getQuoteById, loadClients, upsertClientFromQuote, loadCustomItems, saveCustomItem } from '../data/storage';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { exportQuoteToPdf, exportSupplierPdf } from '../utils/pdf';
import { shareQuoteToWhatsApp, requestPaymentViaWhatsApp } from '../utils/whatsapp';
import { pickFromGallery, takePhoto, deletePhotoFile } from '../utils/photos';
import ScreenHeader from '../components/ScreenHeader';
import ProfessionSwitcher from '../components/ProfessionSwitcher';
import SignaturePadModal from '../components/SignaturePadModal';

function progressColor(pct) {
  if (pct === 0) return '#9CA3AF';
  if (pct < 51) return '#F59E0B';
  if (pct < 100) return '#2563EB';
  return '#10B981';
}

export default function QuoteBuilderScreen({ navigation }) {
  const route = useRoute();
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = getProfessionTheme(user?.activeProfession);
  const [rates, setRates] = useState({});
  const [quantities, setQuantities] = useState({});
  const [extrasQuantities, setExtrasQuantities] = useState({});
  const [extrasMode, setExtrasMode] = useState(false);
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('amount'); // 'amount' or 'percent'
  const [validityDays, setValidityDays] = useState('30');
  const [signature, setSignature] = useState(null); // base64 data URI
  const [signaturePadOpen, setSignaturePadOpen] = useState(false);
  const [qtyEditingId, setQtyEditingId] = useState(null);
  const [qtyEditingValue, setQtyEditingValue] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [projectName, setProjectName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [dealStatus, setDealStatus] = useState('pending');
  const [editingId, setEditingId] = useState(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedToast, setSavedToast] = useState(null);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const [expandedFamilies, setExpandedFamilies] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [clientsList, setClientsList] = useState([]);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [clientPickerSearch, setClientPickerSearch] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [viewerPhoto, setViewerPhoto] = useState(null);
  const [customItems, setCustomItems] = useState([]);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customForm, setCustomForm] = useState({ label: '', unit: 'piece', price: '', qty: '1' });
  const [progress, setProgress] = useState({ zones: [] });
  const [progressOpen, setProgressOpen] = useState(false);
  const [newZoneInput, setNewZoneInput] = useState('');
  const [newTaskInputs, setNewTaskInputs] = useState({});

  const incomingQuoteId = route.params?.quoteId || null;

  useFocusEffect(useCallback(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [r, cl, ci] = await Promise.all([loadRates(user.id), loadClients(user.id), loadCustomItems(user.id)]);
      setRates(r);
      setClientsList(cl);
      setCustomItems(ci);

      if (incomingQuoteId) {
        const q = await getQuoteById(user.id, incomingQuoteId);
        if (q) {
          const qMap = {};
          (q.items || []).forEach((it) => { qMap[it.id] = it.qty; });
          setQuantities(qMap);
          const exMap = {};
          (q.extras || []).forEach((it) => { exMap[it.id] = it.qty; });
          setExtrasQuantities(exMap);
          setExtrasMode(false);
          setDiscountValue(q.discountValue ? String(q.discountValue) : '');
          setDiscountType(q.discountType || 'amount');
          setValidityDays(q.validityDays ? String(q.validityDays) : '30');
          setSignature(q.signature || null);
          setClientName(q.clientName || '');
          setClientPhone(q.clientPhone || '');
          setClientAddress(q.clientAddress || '');
          setProjectName(q.projectName || '');
          setPaymentStatus(q.paymentStatus || 'unpaid');
          setDealStatus(q.dealStatus || 'pending');
          setPhotos(Array.isArray(q.photos) ? q.photos : []);
          setProgress(q.progress && Array.isArray(q.progress.zones) ? q.progress : { zones: [] });
          setEditingId(q.id);
          setEditingCreatedAt(q.createdAt);
        }
      } else {
        setEditingId(null);
        setEditingCreatedAt(null);
        setQuantities({});
        setExtrasQuantities({});
        setExtrasMode(false);
        setDiscountValue('');
        setDiscountType('amount');
        setValidityDays('30');
        setSignature(null);
        setClientName('');
        setClientPhone('');
        setClientAddress('');
        setProjectName('');
        setPaymentStatus('unpaid');
        setDealStatus('pending');
        setPhotos([]);
        setProgress({ zones: [] });
      }
      setLoading(false);
    })();
  }, [user, incomingQuoteId]));

  const setQty = (id, delta) => {
    const target = extrasMode ? setExtrasQuantities : setQuantities;
    target((prev) => {
      const curr = prev[id] || 0;
      const next = Math.max(0, curr + delta);
      const out = { ...prev };
      if (next === 0) delete out[id]; else out[id] = next;
      return out;
    });
  };

  const setQtyAbsolute = (id, value) => {
    const target = extrasMode ? setExtrasQuantities : setQuantities;
    const next = Math.max(0, Math.floor(Number(value) || 0));
    target((prev) => {
      const out = { ...prev };
      if (next === 0) delete out[id]; else out[id] = next;
      return out;
    });
  };

  const openQtyEditor = (id, currentQty) => {
    setQtyEditingId(id);
    setQtyEditingValue(String(currentQty || ''));
  };

  const closeQtyEditor = () => {
    setQtyEditingId(null);
    setQtyEditingValue('');
  };

  const confirmQtyEditor = () => {
    if (qtyEditingId) setQtyAbsolute(qtyEditingId, qtyEditingValue);
    closeQtyEditor();
  };

  const openCustomItemModal = () => {
    setCustomForm({ label: '', unit: 'piece', price: '', qty: '1' });
    setCustomModalOpen(true);
  };

  const closeCustomItemModal = () => {
    setCustomModalOpen(false);
  };

  const genId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const progressStats = useMemo(() => {
    const zones = progress?.zones || [];
    let total = 0;
    let done = 0;
    zones.forEach((z) => {
      (z.tasks || []).forEach((tk) => {
        total += 1;
        if (tk.done) done += 1;
      });
    });
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pct };
  }, [progress]);

  const addZone = () => {
    const name = newZoneInput.trim();
    if (!name) return;
    setProgress((prev) => ({
      zones: [...(prev.zones || []), { id: genId('z'), label: name, tasks: [] }],
    }));
    setNewZoneInput('');
  };

  const deleteZone = (zoneId) => {
    Alert.alert(
      t('progress.deleteZoneTitle'),
      t('progress.deleteZoneMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            setProgress((prev) => ({ zones: (prev.zones || []).filter((z) => z.id !== zoneId) }));
          },
        },
      ],
    );
  };

  const addTask = (zoneId) => {
    const label = (newTaskInputs[zoneId] || '').trim();
    if (!label) return;
    setProgress((prev) => ({
      zones: (prev.zones || []).map((z) =>
        z.id === zoneId
          ? { ...z, tasks: [...(z.tasks || []), { id: genId('t'), label, done: false }] }
          : z,
      ),
    }));
    setNewTaskInputs((prev) => ({ ...prev, [zoneId]: '' }));
  };

  const toggleTask = (zoneId, taskId) => {
    setProgress((prev) => ({
      zones: (prev.zones || []).map((z) =>
        z.id === zoneId
          ? { ...z, tasks: (z.tasks || []).map((tk) => (tk.id === taskId ? { ...tk, done: !tk.done } : tk)) }
          : z,
      ),
    }));
  };

  const deleteTask = (zoneId, taskId) => {
    setProgress((prev) => ({
      zones: (prev.zones || []).map((z) =>
        z.id === zoneId
          ? { ...z, tasks: (z.tasks || []).filter((tk) => tk.id !== taskId) }
          : z,
      ),
    }));
  };

  const importFromItems = () => {
    const allLineItems = [
      ...Object.entries(quantities).filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty, isExtra: false })),
      ...Object.entries(extrasQuantities).filter(([, q]) => q > 0).map(([id, qty]) => ({ id, qty, isExtra: true })),
    ];
    if (allLineItems.length === 0) return;
    Alert.alert(
      t('progress.importConfirmTitle'),
      t('progress.importConfirmMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('progress.importConfirmYes'),
          onPress: () => {
            const newTasks = allLineItems.map(({ id, qty }) => {
              const item = findAnyItem(id);
              const label = item ? (item.isCustom ? item.label : t('item.' + item.id)) : id;
              return { id: genId('t'), label: `${label} (${qty})`, done: false };
            });
            setProgress((prev) => {
              const zones = prev.zones || [];
              let generalZone = zones.find((z) => z.label === t('progress.zoneGeneral'));
              if (generalZone) {
                return {
                  zones: zones.map((z) =>
                    z.id === generalZone.id
                      ? { ...z, tasks: [...(z.tasks || []), ...newTasks] }
                      : z,
                  ),
                };
              }
              return {
                zones: [...zones, { id: genId('z'), label: t('progress.zoneGeneral'), tasks: newTasks }],
              };
            });
            setProgressOpen(true);
          },
        },
      ],
    );
  };

  const submitCustomQuoteItem = async () => {
    const label = customForm.label.trim();
    if (!label) {
      Alert.alert(t('rates.customNameRequired'));
      return;
    }
    const price = Number(String(customForm.price).replace(/[^\d.]/g, '')) || 0;
    const qty = Math.max(1, Math.floor(Number(String(customForm.qty).replace(/[^\d]/g, '')) || 1));
    const item = {
      label,
      unit: customForm.unit,
      category: 'misc',
      profession: activeProfession || null,
    };
    const nextCustoms = await saveCustomItem(user.id, item);
    setCustomItems(nextCustoms);
    const created = nextCustoms.find((i) => i.label === label && i.category === 'misc');
    if (created) {
      const nextRates = { ...rates, [created.id]: price };
      setRates(nextRates);
      await saveRates(user.id, nextRates);
      const target = extrasMode ? setExtrasQuantities : setQuantities;
      target((prev) => ({ ...prev, [created.id]: qty }));
    }
    closeCustomItemModal();
  };

  const allItems = useMemo(() => [...CATALOG, ...customItems.map((ci) => ({ ...ci, isCustom: true }))], [customItems]);

  const findAnyItem = useCallback((id) => allItems.find((i) => i.id === id) || null, [allItems]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let extrasSubtotal = 0;
    let itemCount = 0;
    let extrasCount = 0;
    for (const item of allItems) {
      const qty = quantities[item.id] || 0;
      const eqty = extrasQuantities[item.id] || 0;
      const rate = rates[item.id] || 0;
      if (qty > 0) {
        subtotal += qty * rate;
        itemCount += qty;
      }
      if (eqty > 0) {
        extrasSubtotal += eqty * rate;
        extrasCount += eqty;
      }
    }
    const combinedSubtotal = subtotal + extrasSubtotal;
    const dv = Number(discountValue.replace(/[^\d.]/g, '')) || 0;
    let discount = 0;
    if (dv > 0) {
      discount = discountType === 'percent'
        ? Math.min(combinedSubtotal, combinedSubtotal * (dv / 100))
        : Math.min(combinedSubtotal, dv);
    }
    const afterDiscount = Math.max(0, combinedSubtotal - discount);
    const vat = afterDiscount * VAT_RATE;
    return {
      subtotal,
      extrasSubtotal,
      combinedSubtotal,
      discount,
      afterDiscount,
      vat,
      total: afterDiscount + vat,
      itemCount,
      extrasCount,
    };
  }, [quantities, extrasQuantities, rates, discountValue, discountType, allItems]);

  const buildQuoteObject = useCallback(() => {
    const lineItems = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = findAnyItem(id);
        const unitPrice = rates[id] || 0;
        return { id, label: item?.label || id, qty, unitPrice, lineTotal: qty * unitPrice };
      });
    const extrasItems = Object.entries(extrasQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = findAnyItem(id);
        const unitPrice = rates[id] || 0;
        return { id, label: item?.label || id, qty, unitPrice, lineTotal: qty * unitPrice };
      });
    return {
      id: editingId || String(Date.now()),
      clientName: clientName.trim() || null,
      clientPhone: clientPhone.trim() || null,
      clientAddress: clientAddress.trim() || null,
      projectName: projectName.trim() || null,
      paymentStatus: paymentStatus || 'unpaid',
      dealStatus: dealStatus || 'pending',
      photos: photos,
      itemCount: totals.itemCount + totals.extrasCount,
      subtotal: totals.combinedSubtotal,
      originalSubtotal: totals.subtotal,
      extrasSubtotal: totals.extrasSubtotal,
      discountValue: Number(discountValue.replace(/[^\d.]/g, '')) || 0,
      discountType: discountType,
      discountAmount: totals.discount,
      afterDiscount: totals.afterDiscount,
      validityDays: Math.max(0, Number(String(validityDays).replace(/[^\d]/g, '')) || 0),
      signature: signature || null,
      vat: totals.vat,
      total: totals.total,
      items: lineItems,
      extras: extrasItems,
      progress: progress,
      createdAt: editingCreatedAt || new Date(),
    };
  }, [editingId, editingCreatedAt, clientName, clientPhone, clientAddress, projectName, paymentStatus, dealStatus, photos, progress, quantities, extrasQuantities, rates, discountValue, discountType, validityDays, signature, totals, allItems, findAnyItem]);

  const activeProfession = user?.activeProfession;
  const visibleCategories = useMemo(
    () => categoriesForProfession(activeProfession),
    [activeProfession],
  );

  const availableItems = useMemo(() => {
    const s = search.trim().toLowerCase();
    return allItems.filter((i) => {
      const hasRate = (rates[i.id] || 0) > 0;
      const inProfession = i.isCustom
        ? (!i.profession || !activeProfession || i.profession === activeProfession)
        : itemBelongsToProfession(i, activeProfession);
      const itemLabel = i.isCustom ? i.label : t('item.' + i.id);
      const familyLabel = i.family ? t('family.' + i.family) : '';
      const matches = !s
        || itemLabel.toLowerCase().includes(s)
        || (i.label && i.label.toLowerCase().includes(s))
        || (familyLabel && familyLabel.toLowerCase().includes(s));
      return hasRate && inProfession && matches;
    });
  }, [allItems, rates, search, t, activeProfession]);

  const toggleFamily = (familyId) => {
    setExpandedFamilies((prev) => ({ ...prev, [familyId]: !prev[familyId] }));
  };

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const resetForm = () => {
    setQuantities({});
    setExtrasQuantities({});
    setExtrasMode(false);
    setDiscountValue('');
    setDiscountType('amount');
    setValidityDays('30');
    setSignature(null);
    setClientName('');
    setClientPhone('');
    setClientAddress('');
    setProjectName('');
    setPaymentStatus('unpaid');
    setDealStatus('pending');
    setExtrasQuantities({});
    setExtrasMode(false);
    setPhotos([]);
    setSearch('');
    setExpandedCategories({});
    setEditingId(null);
    setEditingCreatedAt(null);
    setProgress({ zones: [] });
    setProgressOpen(false);
    setNewZoneInput('');
    setNewTaskInputs({});
    navigation.setParams({ quoteId: undefined });
  };

  const onAddPhotos = async (source) => {
    setPhotoBusy(true);
    try {
      const picked = source === 'camera' ? await takePhoto() : await pickFromGallery();
      if (picked && picked.length) {
        setPhotos((prev) => [...prev, ...picked]);
      } else if (picked === null) {
        // permission denied or canceled — silent
      }
    } catch (e) {
      Alert.alert(t('common.error'), e.message || '');
    } finally {
      setPhotoBusy(false);
    }
  };

  const onDeletePhoto = (photo) => {
    Alert.alert(
      t('photos.deleteTitle'),
      t('photos.deleteMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
            await deletePhotoFile(photo);
          },
        },
      ],
    );
  };

  const onSave = async () => {
    if (totals.itemCount === 0) return;
    const quote = buildQuoteObject();
    if (editingId) {
      await updateQuote(user.id, editingId, quote);
    } else {
      await saveQuote(user.id, quote);
    }
    if (quote.clientName) {
      await upsertClientFromQuote(user.id, { name: quote.clientName, phone: quote.clientPhone, address: quote.clientAddress });
    }
    setSavedToast(editingId ? t('quote.updatedToast') : t('quote.savedToast'));
    setTimeout(() => {
      setSavedToast(null);
      resetForm();
      navigation.navigate('Home');
    }, 1100);
  };

  const onPickClient = (c) => {
    setClientName(c.name || '');
    setClientPhone(c.phone || '');
    setClientAddress(c.address || '');
    setClientPickerOpen(false);
    setClientPickerSearch('');
  };

  const filteredClients = clientsList.filter((c) => {
    const s = clientPickerSearch.trim().toLowerCase();
    if (!s) return true;
    return (c.name || '').toLowerCase().includes(s) || (c.phone || '').toLowerCase().includes(s);
  });

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

  const onExportSupplier = async () => {
    if (totals.itemCount === 0) {
      Alert.alert(t('quote.nothingToExport'), t('quote.addAtLeastOne'));
      return;
    }
    try {
      setExporting(true);
      await exportSupplierPdf(buildQuoteObject(), user);
    } catch (e) {
      Alert.alert(t('quote.exportError'), e.message || t('quote.tryAgain'));
    } finally {
      setExporting(false);
    }
  };

  const onRequestPayment = async () => {
    if (totals.itemCount === 0) return;
    const quote = buildQuoteObject();
    const total = Number(quote.total) || 0;
    const paid = Number(quote.paidAmount) || 0;
    if (total > 0 && paid >= total) {
      Alert.alert(t('payment.alreadyPaid'));
      return;
    }
    if (!user?.bitPhone && !user?.phone) {
      Alert.alert(t('payment.noBitTitle'), t('payment.noBitMsg'));
      return;
    }
    if (!quote.clientPhone) {
      Alert.alert(t('payment.noClientPhoneTitle'), t('payment.noClientPhoneMsg'));
      return;
    }
    try {
      await requestPaymentViaWhatsApp(quote, user);
    } catch (e) {
      Alert.alert(t('quote.exportError'), e.message || '');
    }
  };

  const onShareWhatsApp = async () => {
    if (totals.itemCount === 0) {
      Alert.alert(t('quote.nothingToExport'), t('quote.addAtLeastOne'));
      return;
    }
    try {
      await shareQuoteToWhatsApp(buildQuoteObject(), user);
    } catch (e) {
      Alert.alert(t('quote.exportError'), e.message || t('quote.tryAgain'));
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
        <BgDecoration theme={theme} />
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
      <BgDecoration theme={theme} />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            icon={editingId ? 'edit' : 'receipt-long'}
            title={editingId ? t('quote.editTitle') : t('quote.newTitle')}
            subtitle={editingId ? t('quote.editSub') : t('quote.newSub')}
          />

          <ProfessionSwitcher />

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
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>{t('quote.clientName')}</Text>
                {clientsList.length > 0 && (
                  <Pressable onPress={() => setClientPickerOpen(true)} hitSlop={6} style={styles.pickClientBtn}>
                    <MaterialIcons name="contacts" size={14} color={theme.accentSoft} />
                    <Text style={[styles.pickClientText, { color: theme.accentSoft }]}>{t('clients.pickTitle')}</Text>
                  </Pressable>
                )}
              </View>
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
            <View style={[styles.field, { marginTop: 12 }]}>
              <Text style={styles.fieldLabel}>{t('quote.clientPhone')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.fieldInput}
                  value={clientPhone}
                  onChangeText={setClientPhone}
                  placeholder={t('quote.clientPhonePh')}
                  placeholderTextColor={colors.textFaint}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={[styles.field, { marginTop: 12 }]}>
              <Text style={styles.fieldLabel}>{t('quote.clientAddress')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.fieldInput}
                  value={clientAddress}
                  onChangeText={setClientAddress}
                  placeholder={t('quote.clientAddressPh')}
                  placeholderTextColor={colors.textFaint}
                />
              </View>
            </View>
          </View>

          <View style={styles.photosCard}>
            <View style={styles.photosHeader}>
              <MaterialIcons name="photo-library" size={18} color={theme.accentSoft} />
              <View style={{ flex: 1 }}>
                <Text style={styles.photosTitle}>{t('photos.title')}</Text>
                <Text style={styles.photosSubtitle}>{t('photos.subtitle')}</Text>
              </View>
              <Pressable
                style={[styles.photoBtn, { borderColor: theme.accent }]}
                onPress={() => onAddPhotos('camera')}
                disabled={photoBusy}
              >
                <MaterialIcons name="photo-camera" size={18} color={theme.accentSoft} />
              </Pressable>
              <Pressable
                style={[styles.photoBtn, { borderColor: theme.accent }]}
                onPress={() => onAddPhotos('gallery')}
                disabled={photoBusy}
              >
                <MaterialIcons name="add-photo-alternate" size={18} color={theme.accentSoft} />
              </Pressable>
            </View>
            {photos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoStrip}>
                {photos.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => setViewerPhoto(p)}
                    onLongPress={() => onDeletePhoto(p)}
                    delayLongPress={400}
                    style={styles.photoThumbWrap}
                  >
                    <Image source={{ uri: p.uri }} style={styles.photoThumb} />
                    <Pressable style={styles.photoRemove} onPress={() => onDeletePhoto(p)} hitSlop={6}>
                      <MaterialIcons name="close" size={14} color="#fff" />
                    </Pressable>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.photosEmpty}>{t('photos.empty')}</Text>
            )}
          </View>

          <View style={styles.progressCard}>
            <Pressable style={styles.progressHeader} onPress={() => setProgressOpen((v) => !v)}>
              <MaterialIcons name="checklist-rtl" size={20} color={theme.accentSoft} />
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={styles.progressTitle}>{t('progress.title')}</Text>
                <Text style={styles.progressSubtitle}>
                  {progressStats.total > 0
                    ? t('progress.summary', { done: progressStats.done, total: progressStats.total })
                    : t('progress.subtitle')}
                </Text>
              </View>
              {progressStats.total > 0 && (
                <View style={[styles.progressPctBadge, { backgroundColor: progressColor(progressStats.pct) + '22', borderColor: progressColor(progressStats.pct) + '88' }]}>
                  <Text style={[styles.progressPctText, { color: progressColor(progressStats.pct) }]}>{progressStats.pct}%</Text>
                </View>
              )}
              <MaterialIcons
                name={progressOpen ? 'expand-less' : 'expand-more'}
                size={24}
                color={colors.textMuted}
              />
            </Pressable>

            {progressStats.total > 0 && (
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${progressStats.pct}%`, backgroundColor: progressColor(progressStats.pct) }]} />
              </View>
            )}

            {progressOpen && (
              <View style={styles.progressBody}>
                {(progress.zones || []).length === 0 && (
                  <Text style={styles.progressEmpty}>{t('progress.empty')}</Text>
                )}

                {(progress.zones || []).map((zone) => {
                  const zoneDone = (zone.tasks || []).filter((tk) => tk.done).length;
                  const zoneTotal = (zone.tasks || []).length;
                  return (
                    <View key={zone.id} style={styles.zoneCard}>
                      <View style={styles.zoneHeader}>
                        <MaterialIcons name="folder" size={18} color={theme.accentSoft} />
                        <Text style={styles.zoneTitle} numberOfLines={1}>{zone.label}</Text>
                        {zoneTotal > 0 && (
                          <Text style={styles.zoneCount}>{zoneDone}/{zoneTotal}</Text>
                        )}
                        <Pressable onPress={() => deleteZone(zone.id)} hitSlop={8}>
                          <MaterialIcons name="delete-outline" size={20} color={colors.accentAmber || '#E2A03F'} />
                        </Pressable>
                      </View>

                      {(zone.tasks || []).map((tk) => (
                        <View key={tk.id} style={styles.taskRow}>
                          <Pressable onPress={() => toggleTask(zone.id, tk.id)} style={[styles.checkbox, tk.done && { backgroundColor: theme.accent, borderColor: theme.accent }]} hitSlop={4}>
                            {tk.done && <MaterialIcons name="check" size={14} color="#fff" />}
                          </Pressable>
                          <Text style={[styles.taskLabel, tk.done && styles.taskLabelDone]} numberOfLines={3}>{tk.label}</Text>
                          <Pressable onPress={() => deleteTask(zone.id, tk.id)} hitSlop={6}>
                            <MaterialIcons name="close" size={16} color={colors.textFaint} />
                          </Pressable>
                        </View>
                      ))}

                      <View style={styles.addTaskRow}>
                        <TextInput
                          style={styles.addTaskInput}
                          value={newTaskInputs[zone.id] || ''}
                          onChangeText={(v) => setNewTaskInputs((prev) => ({ ...prev, [zone.id]: v }))}
                          placeholder={t('progress.taskPlaceholder')}
                          placeholderTextColor={colors.textFaint}
                          onSubmitEditing={() => addTask(zone.id)}
                          returnKeyType="done"
                        />
                        <Pressable onPress={() => addTask(zone.id)} style={[styles.addTaskBtn, { backgroundColor: theme.accent }]}>
                          <MaterialIcons name="add" size={18} color="#fff" />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}

                <View style={styles.addZoneRow}>
                  <TextInput
                    style={styles.addZoneInput}
                    value={newZoneInput}
                    onChangeText={setNewZoneInput}
                    placeholder={t('progress.zoneNamePlaceholder')}
                    placeholderTextColor={colors.textFaint}
                    onSubmitEditing={addZone}
                    returnKeyType="done"
                  />
                  <Pressable onPress={addZone} style={[styles.addZoneBtn, { backgroundColor: theme.accentSoft }]}>
                    <MaterialIcons name="add" size={18} color="#fff" />
                  </Pressable>
                </View>

                <Pressable onPress={importFromItems} style={styles.importBtn}>
                  <MaterialIcons name="download" size={18} color={colors.primaryBright} />
                  <Text style={styles.importBtnText}>{t('progress.importFromItems')}</Text>
                </Pressable>
              </View>
            )}
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

          <Pressable onPress={openCustomItemModal} style={styles.addCustomQuoteBtn}>
            <MaterialIcons name="add-circle-outline" size={20} color={colors.primaryBright} />
            <Text style={styles.addCustomQuoteText}>{t('quote.addCustomItem')}</Text>
          </Pressable>

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

          {editingId && (
            <Pressable
              style={[styles.extrasToggle, extrasMode && styles.extrasToggleActive]}
              onPress={() => setExtrasMode((v) => !v)}
            >
              <MaterialIcons
                name={extrasMode ? 'build' : 'edit-note'}
                size={20}
                color={extrasMode ? '#fff' : colors.voltageYellow}
              />
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={[styles.extrasToggleTitle, extrasMode && { color: '#fff' }]}>
                  {extrasMode ? t('quote.modeExtras') : t('quote.modeOriginal')}
                </Text>
                <Text style={[styles.extrasToggleHint, extrasMode && { color: 'rgba(255,255,255,0.85)' }]}>
                  {extrasMode ? t('quote.modeExtrasHint') : t('quote.modeOriginalHint')}
                </Text>
              </View>
              <MaterialIcons
                name="swap-horiz"
                size={22}
                color={extrasMode ? '#fff' : colors.textMuted}
              />
            </Pressable>
          )}

          {visibleCategories.map((cat) => {
            const items = availableItems.filter((i) => i.category === cat.id);
            if (items.length === 0) return null;
            const isSearching = search.trim().length > 0;
            const open = isSearching || !!expandedCategories[cat.id];
            const qSource = extrasMode ? extrasQuantities : quantities;
            const otherSource = extrasMode ? quantities : extrasQuantities;
            const catSelectedQty = items.reduce((sum, it) => sum + (qSource[it.id] || 0), 0);
            const catSelectedTotal = items.reduce((sum, it) => sum + (qSource[it.id] || 0) * (rates[it.id] || 0), 0);

            const renderSizeRow = (item) => {
              const qty = qSource[item.id] || 0;
              const otherQty = otherSource[item.id] || 0;
              const price = rates[item.id] || 0;
              const lineTotal = qty * price;
              const selected = qty > 0;
              return (
                <View
                  key={item.id}
                  style={[styles.itemRow, selected && styles.itemRowSelected]}
                >
                  <View style={[styles.sizeBadge, selected && styles.sizeBadgeSelected]}>
                    <Text style={[styles.sizeBadgeText, selected && { color: '#fff' }]}>{item.size}</Text>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text style={styles.itemLabel}>{item.size}{item.sizeUnit || ' mm'}</Text>
                    <Text style={styles.itemPrice}>
                      {formatILS(price)} / {t('unit.' + item.unit)}
                      {lineTotal > 0 ? ` · ${t('home.total')} ${formatILS(lineTotal)}` : ''}
                    </Text>
                    {otherQty > 0 && (
                      <Text style={styles.otherQtyHint}>
                        {extrasMode ? t('quote.alsoInOriginal', { n: otherQty }) : t('quote.alsoInExtras', { n: otherQty })}
                      </Text>
                    )}
                  </View>
                  <View style={styles.stepper}>
                    <Pressable style={styles.stepBtn} onPress={() => setQty(item.id, -1)}>
                      <MaterialIcons name="remove" size={18} color={colors.primaryBright} />
                    </Pressable>
                    <Pressable onPress={() => openQtyEditor(item.id, qty)} hitSlop={6}>
                      <Text style={styles.stepValue}>{qty}</Text>
                    </Pressable>
                    <Pressable style={styles.stepBtn} onPress={() => setQty(item.id, 1)}>
                      <MaterialIcons name="add" size={18} color={colors.primaryBright} />
                    </Pressable>
                  </View>
                </View>
              );
            };

            const rendered = [];
            const seenFamilies = new Set();
            for (const item of items) {
              if (item.family) {
                if (seenFamilies.has(item.family)) continue;
                seenFamilies.add(item.family);
                const familyItems = items.filter((i) => i.family === item.family);
                const familyQty = familyItems.reduce((sum, fi) => sum + (qSource[fi.id] || 0), 0);
                const familyTotal = familyItems.reduce((sum, fi) => sum + (qSource[fi.id] || 0) * (rates[fi.id] || 0), 0);
                const open = !!expandedFamilies[item.family];
                const familySelected = familyQty > 0;
                rendered.push(
                  <View key={'fam_' + item.family} style={styles.familyBlock}>
                    <Pressable
                      style={[styles.itemRow, familySelected && styles.itemRowSelected]}
                      onPress={() => toggleFamily(item.family)}
                    >
                      <View style={[styles.itemIconWrap, familySelected && styles.itemIconWrapSelected]}>
                        <MaterialIcons name={item.icon} size={22} color={familySelected ? '#fff' : colors.primaryBright} />
                      </View>
                      <View style={{ flex: 1, marginHorizontal: 12 }}>
                        <Text style={styles.itemLabel}>{t('family.' + item.family)}</Text>
                        <Text style={styles.itemPrice}>
                          {familyQty > 0
                            ? `${familyQty} ${t('unit.' + item.unit)} · ${formatILS(familyTotal)}`
                            : t('family.chooseSize')}
                        </Text>
                      </View>
                      <MaterialIcons
                        name={open ? 'expand-less' : 'expand-more'}
                        size={26}
                        color={colors.textMuted}
                      />
                    </Pressable>
                    {open && (
                      <View style={styles.familySizesWrap}>
                        {familyItems.map(renderSizeRow)}
                      </View>
                    )}
                  </View>,
                );
              } else {
                const qty = qSource[item.id] || 0;
                const otherQty = otherSource[item.id] || 0;
                const price = rates[item.id] || 0;
                const lineTotal = qty * price;
                const selected = qty > 0;
                rendered.push(
                  <View
                    key={item.id}
                    style={[styles.itemRow, selected && styles.itemRowSelected]}
                  >
                    <View style={[styles.itemIconWrap, selected && styles.itemIconWrapSelected]}>
                      <MaterialIcons name={item.icon || (item.isCustom ? 'star' : 'category')} size={22} color={selected ? '#fff' : colors.primaryBright} />
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.itemLabel} numberOfLines={2}>{item.isCustom ? item.label : t('item.' + item.id)}</Text>
                        {item.isCustom && (
                          <View style={styles.customTag}>
                            <Text style={styles.customTagText}>{t('rates.customBadge')}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.itemPrice}>
                        {formatILS(price)} / {t('unit.' + item.unit)}
                        {lineTotal > 0 ? ` · ${t('home.total')} ${formatILS(lineTotal)}` : ''}
                      </Text>
                      {otherQty > 0 && (
                        <Text style={styles.otherQtyHint}>
                          {extrasMode ? t('quote.alsoInOriginal', { n: otherQty }) : t('quote.alsoInExtras', { n: otherQty })}
                        </Text>
                      )}
                    </View>
                    <View style={styles.stepper}>
                      <Pressable style={styles.stepBtn} onPress={() => setQty(item.id, -1)}>
                        <MaterialIcons name="remove" size={18} color={colors.primaryBright} />
                      </Pressable>
                      <Pressable onPress={() => openQtyEditor(item.id, qty)} hitSlop={6}>
                        <Text style={styles.stepValue}>{qty}</Text>
                      </Pressable>
                      <Pressable style={styles.stepBtn} onPress={() => setQty(item.id, 1)}>
                        <MaterialIcons name="add" size={18} color={colors.primaryBright} />
                      </Pressable>
                    </View>
                  </View>,
                );
              }
            }

            return (
              <View key={cat.id} style={styles.categoryBlock}>
                <Pressable
                  style={[styles.categoryHeader, catSelectedQty > 0 && styles.categoryHeaderActive]}
                  onPress={() => toggleCategory(cat.id)}
                  disabled={isSearching}
                >
                  <MaterialIcons name={cat.icon} size={18} color={colors.voltageYellow} />
                  <Text style={styles.categoryTitle}>{t('cat.' + cat.id)}</Text>
                  {cat.isMaterial && (
                    <View style={styles.materialBadge}>
                      <Text style={styles.materialBadgeText}>📦 חומר</Text>
                    </View>
                  )}
                  {catSelectedQty > 0 && (
                    <View style={styles.categoryCountBadge}>
                      <Text style={styles.categoryCountText}>{catSelectedQty}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }} />
                  {catSelectedTotal > 0 && (
                    <Text style={styles.categoryTotal}>{formatILS(catSelectedTotal)}</Text>
                  )}
                  {!isSearching && (
                    <MaterialIcons
                      name={open ? 'expand-less' : 'expand-more'}
                      size={22}
                      color={colors.textMuted}
                    />
                  )}
                </Pressable>
                {open && rendered}
              </View>
            );
          })}

          <LinearGradient
            colors={[colors.cardElevated, colors.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.summaryCard}
          >
            {totals.extrasSubtotal > 0 ? (
              <>
                <SummaryRow label={t('quote.originalSubtotal')} value={formatILS(totals.subtotal)} />
                <SummaryRow label={t('quote.extrasSubtotal')} value={formatILS(totals.extrasSubtotal)} />
                <SummaryRow label={t('quote.subtotal')} value={formatILS(totals.combinedSubtotal)} />
              </>
            ) : (
              <SummaryRow label={t('quote.subtotal')} value={formatILS(totals.subtotal)} />
            )}

            <View style={styles.discountRow}>
              <Text style={styles.discountLabel}>{t('quote.discount')}</Text>
              <Pressable
                style={styles.discountTypeBtn}
                onPress={() => setDiscountType((p) => p === 'amount' ? 'percent' : 'amount')}
              >
                <Text style={styles.discountTypeBtnText}>{discountType === 'percent' ? '%' : '₪'}</Text>
              </Pressable>
              <TextInput
                style={styles.discountInput}
                keyboardType="numeric"
                value={discountValue}
                onChangeText={setDiscountValue}
                placeholder="0"
                placeholderTextColor={colors.textFaint}
              />
            </View>
            {totals.discount > 0 && (
              <>
                <SummaryRow label={t('quote.discountApplied')} value={`-${formatILS(totals.discount)}`} />
                <SummaryRow label={t('quote.afterDiscount')} value={formatILS(totals.afterDiscount)} />
              </>
            )}

            <View style={styles.discountRow}>
              <Text style={styles.discountLabel}>{t('quote.validityDays')}</Text>
              <TextInput
                style={styles.discountInput}
                keyboardType="numeric"
                value={validityDays}
                onChangeText={setValidityDays}
                placeholder="30"
                placeholderTextColor={colors.textFaint}
              />
              <Text style={styles.discountTypeBtnText}>{t('quote.daysSuffix')}</Text>
            </View>

            <View style={styles.signatureSection}>
              {signature ? (
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <MaterialIcons name="check-circle" size={16} color={colors.liveWire} />
                    <Text style={[styles.discountLabel, { marginStart: 6 }]}>{t('signature.signed')}</Text>
                    <View style={{ flex: 1 }} />
                    <Pressable onPress={() => setSignature(null)} hitSlop={6}>
                      <MaterialIcons name="close" size={18} color={colors.textMuted} />
                    </Pressable>
                  </View>
                  <Image source={{ uri: signature }} style={styles.signaturePreview} resizeMode="contain" />
                </View>
              ) : (
                <Pressable style={styles.signatureBtn} onPress={() => setSignaturePadOpen(true)}>
                  <MaterialIcons name="draw" size={18} color={colors.primaryBright} />
                  <Text style={styles.signatureBtnText}>{t('signature.addBtn')}</Text>
                </Pressable>
              )}
            </View>

            <SummaryRow label={t('quote.vat', { pct: Math.round(VAT_RATE * 100) })} value={formatILS(totals.vat)} />
            <View style={styles.summaryDivider} />
            <SummaryRow label={t('quote.total')} value={formatILS(totals.total)} bold />

            {totals.itemCount > 0 && (
              <Pressable onPress={onRequestPayment} style={styles.paymentBtn}>
                <MaterialIcons name="credit-card" size={20} color="#fff" />
                <Text style={styles.paymentBtnText}>{t('payment.requestBtn')}</Text>
              </Pressable>
            )}

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

            <Pressable
              style={[styles.supplierBtn, totals.itemCount === 0 && { opacity: 0.5 }]}
              onPress={onExportSupplier}
              disabled={totals.itemCount === 0 || exporting}
            >
              <MaterialIcons name="local-shipping" size={18} color={colors.voltageYellow} />
              <Text style={styles.supplierBtnText}>{t('quote.supplierPdf')}</Text>
              <Text style={styles.supplierBtnHint}>{t('quote.supplierPdfHint')}</Text>
            </Pressable>
          </LinearGradient>

          {savedToast && (
            <View style={styles.toast}>
              <MaterialIcons name="check-circle" size={20} color={colors.liveWire} />
              <Text style={styles.toastText}>{savedToast}</Text>
            </View>
          )}
        </ScrollView>

        <SignaturePadModal
          visible={signaturePadOpen}
          onClose={() => setSignaturePadOpen(false)}
          onSave={(sig) => setSignature(sig)}
        />

        <Modal
          visible={!!qtyEditingId}
          animationType="fade"
          transparent
          onRequestClose={closeQtyEditor}
        >
          <KeyboardAvoidingView
            style={styles.qtyModalRoot}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Pressable style={styles.qtyModalBackdrop} onPress={closeQtyEditor} />
            <View style={styles.qtyModalCard}>
              <Text style={styles.qtyModalTitle}>{t('quote.qtyEditorTitle')}</Text>
              <TextInput
                style={styles.qtyModalInput}
                value={qtyEditingValue}
                onChangeText={setQtyEditingValue}
                keyboardType="number-pad"
                autoFocus
                selectTextOnFocus
                onSubmitEditing={confirmQtyEditor}
              />
              <View style={styles.qtyModalActions}>
                <Pressable style={styles.qtyModalCancel} onPress={closeQtyEditor}>
                  <Text style={styles.qtyModalCancelText}>{t('common.cancel')}</Text>
                </Pressable>
                <Pressable style={styles.qtyModalConfirm} onPress={confirmQtyEditor}>
                  <MaterialIcons name="check" size={18} color="#fff" />
                  <Text style={styles.qtyModalConfirmText}>{t('common.ok')}</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal visible={!!viewerPhoto} animationType="fade" transparent onRequestClose={() => setViewerPhoto(null)}>
          <Pressable style={styles.viewerRoot} onPress={() => setViewerPhoto(null)}>
            {!!viewerPhoto && (
              <Image source={{ uri: viewerPhoto.uri }} style={styles.viewerImage} resizeMode="contain" />
            )}
            <Pressable style={styles.viewerClose} onPress={() => setViewerPhoto(null)} hitSlop={10}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </Pressable>
          </Pressable>
        </Modal>

        <Modal visible={clientPickerOpen} animationType="slide" transparent onRequestClose={() => setClientPickerOpen(false)}>
          <KeyboardAvoidingView
            style={styles.modalRoot}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Pressable style={styles.modalBackdrop} onPress={() => setClientPickerOpen(false)} />
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t('clients.pickTitle')}</Text>

              <View style={styles.modalSearchWrap}>
                <MaterialIcons name="search" size={20} color={colors.textMuted} />
                <TextInput
                  style={styles.modalSearchInput}
                  value={clientPickerSearch}
                  onChangeText={setClientPickerSearch}
                  placeholder={t('clients.search')}
                  placeholderTextColor={colors.textFaint}
                />
              </View>

              <ScrollView style={{ maxHeight: 420 }}>
                {filteredClients.length === 0 ? (
                  <Text style={styles.modalEmpty}>{t('clients.pickEmpty')}</Text>
                ) : (
                  filteredClients.map((c) => (
                    <Pressable key={c.id} style={styles.modalRow} onPress={() => onPickClient(c)}>
                      <View style={[styles.modalAvatar, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '55' }]}>
                        <MaterialIcons name="person" size={20} color={theme.accentSoft} />
                      </View>
                      <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Text style={styles.modalRowName}>{c.name}</Text>
                        {!!c.phone && <Text style={styles.modalRowMeta}>{c.phone}</Text>}
                      </View>
                      <MaterialIcons name="chevron-left" size={20} color={colors.textFaint} />
                    </Pressable>
                  ))
                )}
              </ScrollView>

              <Pressable style={[styles.modalCancel, { marginTop: 12 }]} onPress={() => setClientPickerOpen(false)}>
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {totals.itemCount > 0 && (
          <View style={styles.fabRow} pointerEvents="box-none">
            <Pressable
              style={({ pressed }) => [styles.fabSupplier, pressed && { opacity: 0.85 }]}
              onPress={onExportSupplier}
              disabled={exporting}
            >
              {exporting ? (
                <ActivityIndicator color={colors.voltageYellow} size="small" />
              ) : (
                <MaterialIcons name="local-shipping" size={22} color={colors.voltageYellow} />
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.fabWhatsapp, pressed && { opacity: 0.9 }]}
              onPress={onShareWhatsApp}
              disabled={exporting}
            >
              <MaterialIcons name="chat" size={22} color="#fff" />
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.fabPdf, pressed && { opacity: 0.9 }]}
              onPress={onExport}
              disabled={exporting}
            >
              <LinearGradient
                colors={[colors.primaryBright, colors.circuitTeal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              {exporting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <MaterialIcons name="picture-as-pdf" size={22} color="#fff" />
                  <Text style={styles.fabPdfText}>PDF</Text>
                </>
              )}
            </Pressable>
          </View>
        )}
      </SafeAreaView>

      <Modal visible={customModalOpen} transparent animationType="fade" onRequestClose={closeCustomItemModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.customModalBackdrop}>
          <View style={styles.customModalCard}>
            <View style={styles.customModalHeader}>
              <MaterialIcons name="add-circle-outline" size={22} color={colors.primaryBright} />
              <Text style={styles.customModalTitle}>{t('rates.customModalTitle')}</Text>
            </View>
            <Text style={styles.customModalSubtitle}>{t('rates.customModalSubtitle')}</Text>

            <Text style={styles.customModalFieldLabel}>{t('rates.customNameLabel')}</Text>
            <TextInput
              style={styles.customModalInput}
              value={customForm.label}
              onChangeText={(v) => setCustomForm((prev) => ({ ...prev, label: v }))}
              placeholder={t('rates.customNamePlaceholder')}
              placeholderTextColor={colors.textFaint}
            />

            <Text style={styles.customModalFieldLabel}>{t('rates.customUnitLabel')}</Text>
            <View style={styles.customUnitRow}>
              {[
                { id: 'piece', label: t('unit.piece') },
                { id: 'meter', label: t('unit.meter') },
                { id: 'point', label: t('unit.point') },
              ].map((u) => (
                <Pressable
                  key={u.id}
                  onPress={() => setCustomForm((prev) => ({ ...prev, unit: u.id }))}
                  style={[styles.customUnitChip, customForm.unit === u.id && styles.customUnitChipActive]}
                >
                  <Text style={[styles.customUnitChipText, customForm.unit === u.id && styles.customUnitChipTextActive]}>
                    {u.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 2 }}>
                <Text style={styles.customModalFieldLabel}>{t('rates.customPriceLabel')}</Text>
                <View style={styles.customModalInputWrap}>
                  <TextInput
                    style={styles.customModalInputFlex}
                    keyboardType="numeric"
                    value={customForm.price}
                    onChangeText={(v) => setCustomForm((prev) => ({ ...prev, price: v }))}
                    placeholder="0"
                    placeholderTextColor={colors.textFaint}
                  />
                  <Text style={styles.customModalSuffix}>₪</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.customModalFieldLabel}>{t('quote.customQty')}</Text>
                <View style={styles.customModalInputWrap}>
                  <TextInput
                    style={styles.customModalInputFlex}
                    keyboardType="numeric"
                    value={customForm.qty}
                    onChangeText={(v) => setCustomForm((prev) => ({ ...prev, qty: v }))}
                    placeholder="1"
                    placeholderTextColor={colors.textFaint}
                  />
                </View>
              </View>
            </View>

            <View style={styles.customModalActions}>
              <Pressable onPress={closeCustomItemModal} style={[styles.customModalBtn, styles.customModalBtnGhost]}>
                <Text style={styles.customModalBtnGhostText}>{t('rates.customCancel')}</Text>
              </Pressable>
              <Pressable onPress={submitCustomQuoteItem} style={[styles.customModalBtn, styles.customModalBtnPrimary]}>
                <Text style={styles.customModalBtnPrimaryText}>{t('rates.customSave')}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function BgDecoration({ theme }) {
  return (
    <>
      <LinearGradient
        colors={colors.bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <MaterialIcons name={theme.bgIconPrimary} size={180} color="#fff" style={styles.bgBoltTop} />
      <MaterialIcons name={theme.bgIconSecondary} size={140} color="#fff" style={styles.bgBoltBottom} />
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
  container: { padding: 16, paddingBottom: 100 },

  bgBoltTop: { position: 'absolute', top: -20, right: -20, opacity: 0.05, transform: [{ rotate: '18deg' }] },
  bgBoltBottom: { position: 'absolute', bottom: 100, left: -15, opacity: 0.04, transform: [{ rotate: '-12deg' }] },

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
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  fieldLabel: { color: colors.textMuted, fontWeight: '600', fontSize: 13, marginBottom: 6 },
  pickClientBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  pickClientText: { fontSize: 11, fontWeight: '800' },

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
  modalTitle: { color: colors.text, fontWeight: '900', fontSize: 18, marginBottom: 12, textAlign: 'right' },
  modalSearchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.cardElevated,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 10,
  },
  modalSearchInput: { flex: 1, fontSize: 14, color: colors.text, textAlign: 'right', paddingVertical: 4 },
  modalEmpty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 20, fontSize: 13 },
  modalRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 6,
    borderBottomWidth: 1, borderBottomColor: colors.dividerDark,
  },
  modalAvatar: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  modalRowName: { color: colors.text, fontWeight: '800', fontSize: 14 },
  modalRowMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  modalCancel: {
    paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { color: colors.textMuted, fontWeight: '700' },
  inputWrap: {
    borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 12, backgroundColor: colors.cardElevated,
    paddingHorizontal: 12,
  },
  fieldInput: { paddingVertical: 10, fontSize: 15, color: colors.text, textAlign: 'right' },

  photosCard: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 12, marginTop: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  photosHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  photosTitle: { color: colors.text, fontWeight: '800', fontSize: 14 },
  photosSubtitle: { color: colors.textMuted, fontSize: 11, marginTop: 1 },
  photoBtn: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
  },
  photoStrip: { marginTop: 12 },
  photoThumbWrap: { position: 'relative', marginEnd: 8 },
  photoThumb: { width: 76, height: 76, borderRadius: 12, backgroundColor: colors.cardElevated },
  photoRemove: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center', justifyContent: 'center',
  },
  photosEmpty: { color: colors.textFaint, fontSize: 12, marginTop: 10, textAlign: 'center' },
  viewerRoot: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center', justifyContent: 'center',
  },
  viewerImage: { width: '100%', height: '100%' },
  viewerClose: {
    position: 'absolute', top: 50, right: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  extrasToggle: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    marginTop: 12, borderWidth: 1, borderColor: colors.cardBorder,
  },
  extrasToggleActive: {
    backgroundColor: colors.accentAmber || '#d97706',
    borderColor: colors.accentAmber || '#d97706',
  },
  extrasToggleTitle: { color: colors.text, fontWeight: '800', fontSize: 14 },
  extrasToggleHint: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  otherQtyHint: { color: colors.textMuted, fontSize: 11, marginTop: 3, fontStyle: 'italic' },

  discountRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 6,
  },
  discountLabel: { flex: 1, color: colors.textMuted, fontSize: 14 },
  discountTypeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  discountTypeBtnText: { color: colors.primaryBright, fontWeight: '800', fontSize: 14 },
  discountInput: {
    width: 80, fontSize: 14, color: colors.text,
    textAlign: 'center',
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8,
  },

  signatureSection: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  signatureBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.primaryBright + '66',
    borderRadius: 12, paddingVertical: 12,
  },
  signatureBtnText: { color: colors.primaryBright, fontWeight: '800', fontSize: 14 },
  signaturePreview: {
    width: '100%', height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1, borderColor: colors.cardBorder,
  },

  qtyModalRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  qtyModalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  qtyModalCard: {
    width: '100%', maxWidth: 320,
    backgroundColor: colors.card,
    borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  qtyModalTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginBottom: 14, textAlign: 'right' },
  qtyModalInput: {
    backgroundColor: colors.cardElevated,
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14,
    color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  qtyModalActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  qtyModalCancel: {
    flex: 1, paddingVertical: 12,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  qtyModalCancelText: { color: colors.textMuted, fontWeight: '800' },
  qtyModalConfirm: {
    flex: 1, paddingVertical: 12,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 6,
    backgroundColor: colors.primaryBright,
  },
  qtyModalConfirmText: { color: '#fff', fontWeight: '900' },

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

  categoryBlock: { marginTop: 12 },
  categoryHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
    marginBottom: 8,
  },
  categoryHeaderActive: {
    borderColor: colors.primaryBright + 'AA',
    backgroundColor: colors.primaryBright + '0A',
  },
  categoryTitle: { fontSize: 14, fontWeight: '800', color: colors.voltageYellow, letterSpacing: 0.3 },
  categoryCountBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.primaryBright + '33',
    borderWidth: 1, borderColor: colors.primaryBright + '66',
  },
  categoryCountText: { color: colors.primaryBright, fontWeight: '800', fontSize: 11 },
  categoryTotal: { color: colors.text, fontWeight: '700', fontSize: 13, marginEnd: 6 },
  materialBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.circuitTeal + '22',
    borderWidth: 1, borderColor: colors.circuitTeal + '55',
  },
  materialBadgeText: { color: colors.circuitTeal, fontWeight: '700', fontSize: 10 },

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
  familyBlock: { marginBottom: 4 },
  familySizesWrap: {
    paddingHorizontal: 8, paddingTop: 4, paddingBottom: 2,
    marginTop: -4, marginBottom: 8,
    borderRadius: 14,
    backgroundColor: colors.primaryBright + '0A',
    borderWidth: 1, borderColor: colors.primaryBright + '22',
    borderTopWidth: 0,
  },
  sizeBadge: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: colors.primaryBright + '1F',
    borderWidth: 1, borderColor: colors.primaryBright + '44',
    alignItems: 'center', justifyContent: 'center',
  },
  sizeBadgeSelected: {
    backgroundColor: colors.primaryBright,
    borderColor: colors.primaryBright,
  },
  sizeBadgeText: { color: colors.primaryBright, fontWeight: '800', fontSize: 13 },
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

  supplierBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 10, paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1, borderColor: colors.voltageYellow + '88',
    backgroundColor: colors.voltageYellow + '14',
    flexWrap: 'wrap',
  },
  supplierBtnText: { color: colors.voltageYellow, fontWeight: '800', fontSize: 13 },
  supplierBtnHint: { color: colors.textMuted, fontWeight: '600', fontSize: 11 },

  fabRow: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  fabSupplier: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.voltageYellow + '22',
    borderWidth: 1, borderColor: colors.voltageYellow + '88',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 8,
    elevation: 6,
  },
  fabWhatsapp: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#25D366',
    shadowColor: '#25D366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.55, shadowRadius: 10,
    elevation: 7,
  },
  fabPdf: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingHorizontal: 18, height: 50, borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.primaryBright, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.55, shadowRadius: 12,
    elevation: 8,
  },
  fabPdfText: { color: '#fff', fontWeight: '800', fontSize: 15 },

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

  customTag: {
    backgroundColor: colors.voltageYellow + '22',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: colors.voltageYellow + '55',
  },
  customTagText: { color: colors.voltageYellow, fontWeight: '800', fontSize: 10 },

  addCustomQuoteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 10, marginBottom: 4, paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryBright + '88',
    backgroundColor: colors.primaryBright + '0F',
  },
  addCustomQuoteText: { color: colors.primaryBright, fontWeight: '800', fontSize: 13 },

  customModalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 18,
  },
  customModalCard: {
    width: '100%', maxWidth: 420, backgroundColor: colors.card,
    borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.cardBorderActive,
  },
  customModalHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  customModalTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  customModalSubtitle: { color: colors.textMuted, fontSize: 12, marginBottom: 14 },
  customModalFieldLabel: { color: colors.text, fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 10 },
  customModalInput: {
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: colors.cardElevated, color: colors.text,
    fontSize: 15, textAlign: 'right',
  },
  customModalInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 12, backgroundColor: colors.cardElevated,
    paddingHorizontal: 14,
  },
  customModalInputFlex: { flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text, textAlign: 'right' },
  customModalSuffix: { color: colors.voltageYellow, fontWeight: '800', marginStart: 8 },

  customUnitRow: { flexDirection: 'row', gap: 8 },
  customUnitChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1, borderColor: colors.cardBorder,
    backgroundColor: colors.cardElevated,
  },
  customUnitChipActive: {
    backgroundColor: colors.primaryBright + '22',
    borderColor: colors.primaryBright,
  },
  customUnitChipText: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  customUnitChipTextActive: { color: colors.primaryBright },

  customModalActions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  customModalBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  customModalBtnGhost: { borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: 'transparent' },
  customModalBtnGhostText: { color: colors.textMuted, fontWeight: '700' },
  customModalBtnPrimary: { backgroundColor: colors.primaryBright },
  customModalBtnPrimaryText: { color: '#fff', fontWeight: '800' },

  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 16, marginTop: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  progressTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  progressSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  progressPctBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1, marginEnd: 8,
  },
  progressPctText: { fontWeight: '900', fontSize: 12 },
  progressBarTrack: {
    height: 4, backgroundColor: colors.cardBorder,
  },
  progressBarFill: { height: '100%' },
  progressBody: {
    padding: 14, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: colors.dividerDark,
    backgroundColor: colors.bgSoft,
  },
  progressEmpty: { color: colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 14 },

  zoneCard: {
    backgroundColor: colors.cardElevated,
    borderRadius: 12, padding: 12, marginTop: 10,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  zoneHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  zoneTitle: { flex: 1, color: colors.text, fontWeight: '800', fontSize: 14, marginStart: 2 },
  zoneCount: {
    color: colors.primaryBright, fontWeight: '800', fontSize: 12,
    backgroundColor: colors.primaryBright + '22',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2,
  },

  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  taskLabel: { flex: 1, color: colors.text, fontSize: 13 },
  taskLabelDone: { textDecorationLine: 'line-through', color: colors.textMuted },

  addTaskRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  addTaskInput: {
    flex: 1, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: colors.card, color: colors.text,
    fontSize: 13, textAlign: 'right',
  },
  addTaskBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  addZoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  addZoneInput: {
    flex: 1, borderWidth: 1, borderStyle: 'dashed',
    borderColor: colors.primaryBright + '88', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9,
    backgroundColor: colors.primaryBright + '0A', color: colors.text,
    fontSize: 13, textAlign: 'right',
  },
  addZoneBtn: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  importBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 12, paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryBright + '88',
    backgroundColor: colors.primaryBright + '0F',
  },
  importBtnText: { color: colors.primaryBright, fontWeight: '800', fontSize: 13 },

  paymentBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#25D366',
    borderRadius: 14, paddingVertical: 14,
    marginTop: 14,
    shadowColor: '#25D366', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 4,
  },
  paymentBtnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
});
