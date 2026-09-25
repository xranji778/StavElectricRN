import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { getProfessionTheme } from '../theme/professionThemes';
import { formatILS } from '../utils/currency';
import { loadRates, loadQuotes, hasAnyRate, deleteQuote, updateQuote } from '../data/storage';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ScreenHeader from '../components/ScreenHeader';
import FeedbackModal from '../components/FeedbackModal';

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'home.greetMorning';
  if (h < 17) return 'home.greetAfternoon';
  if (h < 21) return 'home.greetEvening';
  return 'home.greetNight';
}

function conversionRate(quotes) {
  // Conversion = won / (won + lost). Pending excluded from denominator.
  let won = 0;
  let lost = 0;
  for (const q of quotes) {
    const s = q.dealStatus;
    if (s === 'won') won++;
    else if (s === 'lost') lost++;
    // pending or undefined → not yet decided, exclude
  }
  const decided = won + lost;
  if (decided === 0) return 0;
  return Math.round((won / decided) * 100);
}

function paidValue(q) {
  // Legacy quotes without any payment tracking → assume fully paid (preserve history)
  if (q.paymentStatus === undefined && q.paidAmount === undefined) {
    return Number(q.total) || 0;
  }
  if (q.paymentStatus === 'paid') return Number(q.total) || 0;
  return Number(q.paidAmount) || 0;
}

function monthTotal(quotes) {
  const now = new Date();
  return quotes
    .filter((q) => q.createdAt.getFullYear() === now.getFullYear() && q.createdAt.getMonth() === now.getMonth())
    .reduce((s, q) => s + paidValue(q), 0);
}

const MONTH_ABBR = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];

function monthlyStats(quotes) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: MONTH_ABBR[d.getMonth()],
      total: 0,
      count: 0,
    });
  }
  for (const q of quotes) {
    const paid = paidValue(q);
    if (paid <= 0) continue;
    const qd = q.createdAt instanceof Date ? q.createdAt : new Date(q.createdAt);
    for (const b of buckets) {
      if (qd.getFullYear() === b.year && qd.getMonth() === b.month) {
        b.total += paid;
        b.count += 1;
        break;
      }
    }
  }
  return buckets;
}

export default function HomeScreen({ navigation }) {
  const { user, resendVerificationEmail, refreshEmailVerification } = useAuth();
  const { t } = useLanguage();
  const [verifyBusy, setVerifyBusy] = useState(false);

  const onResendVerification = async () => {
    setVerifyBusy(true);
    try {
      await resendVerificationEmail();
      Alert.alert('', t('home.verifyBanner.resent'));
    } finally {
      setVerifyBusy(false);
    }
  };

  const onRefreshVerification = async () => {
    setVerifyBusy(true);
    try {
      const u = await refreshEmailVerification();
      if (!u?.emailVerified) Alert.alert('', t('home.verifyBanner.stillNot'));
    } finally {
      setVerifyBusy(false);
    }
  };
  const theme = getProfessionTheme(user?.activeProfession);
  const [rates, setRates] = useState({});
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [partialQuote, setPartialQuote] = useState(null);
  const [partialAmountInput, setPartialAmountInput] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const ctaGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaGlow, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(ctaGlow, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    ).start();
  }, [ctaGlow]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [r, q] = await Promise.all([loadRates(user.id), loadQuotes(user.id)]);
    setRates(r);
    setQuotes(q);
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const onDeleteQuote = (quote) => {
    const name = quote.projectName || quote.clientName || t('home.unnamed');
    Alert.alert(
      t('home.delete.title'),
      t('home.delete.msg', { name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            const next = await deleteQuote(user.id, quote.id);
            setQuotes(next);
          },
        },
      ],
    );
  };

  const onChangeDealStatus = (quote) => {
    Alert.alert(
      t('deal.changeTitle'),
      t('deal.changeMsg'),
      [
        {
          text: t('deal.pending'),
          onPress: async () => {
            const next = await updateQuote(user.id, quote.id, { dealStatus: 'pending' });
            setQuotes(next);
          },
        },
        {
          text: t('deal.won'),
          onPress: async () => {
            const next = await updateQuote(user.id, quote.id, { dealStatus: 'won' });
            setQuotes(next);
          },
        },
        {
          text: t('deal.lost'),
          onPress: async () => {
            const next = await updateQuote(user.id, quote.id, { dealStatus: 'lost' });
            setQuotes(next);
          },
        },
        { text: t('common.cancel'), style: 'cancel' },
      ],
    );
  };

  const onChangePaymentStatus = (quote) => {
    Alert.alert(
      t('pay.changeTitle'),
      t('pay.changeMsg'),
      [
        {
          text: t('pay.unpaid'),
          onPress: async () => {
            const next = await updateQuote(user.id, quote.id, { paymentStatus: 'unpaid', paidAmount: 0 });
            setQuotes(next);
          },
        },
        {
          text: t('pay.partial'),
          onPress: () => {
            setPartialAmountInput(String(quote.paidAmount || ''));
            setPartialQuote(quote);
          },
        },
        {
          text: t('pay.paid'),
          onPress: async () => {
            const next = await updateQuote(user.id, quote.id, { paymentStatus: 'paid', paidAmount: quote.total });
            setQuotes(next);
          },
        },
        { text: t('common.cancel'), style: 'cancel' },
      ],
    );
  };

  const savePartialAmount = async () => {
    if (!partialQuote) return;
    const amount = Number(partialAmountInput.replace(/[^\d.]/g, '')) || 0;
    const next = await updateQuote(user.id, partialQuote.id, {
      paymentStatus: amount > 0 ? 'partial' : 'unpaid',
      paidAmount: amount,
    });
    setQuotes(next);
    setPartialQuote(null);
    setPartialAmountInput('');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryBright} />
      </SafeAreaView>
    );
  }

  const ratesSet = hasAnyRate(rates);
  const shadowOpacity = ctaGlow.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.42] });

  return (
    <View style={styles.flex}>
      <BgDecoration theme={theme} />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); refresh(); }} tintColor={theme.accentSoft} />}
        >
          <ScreenHeader
            icon={theme.headerIcon}
            title={theme.appName}
            subtitle={`${t(greetingKey())}, ${user?.displayName || ''} 👋   ${t('home.readyForNew')}`}
          />

          {user && !user.emailVerified && (
            <View style={styles.verifyBanner}>
              <MaterialIcons name="mark-email-unread" size={26} color={colors.circuitTeal} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.verifyBannerTitle}>{t('home.verifyBanner.title')}</Text>
                <Text style={styles.verifyBannerSub}>{t('home.verifyBanner.sub')}</Text>
                <View style={styles.verifyBannerActions}>
                  <Pressable onPress={onResendVerification} disabled={verifyBusy} hitSlop={6}>
                    <Text style={styles.verifyBannerAction}>{t('home.verifyBanner.resend')}</Text>
                  </Pressable>
                  <Pressable onPress={onRefreshVerification} disabled={verifyBusy} hitSlop={6}>
                    <Text style={styles.verifyBannerAction}>{t('home.verifyBanner.refresh')}</Text>
                  </Pressable>
                </View>
              </View>
              {verifyBusy && <ActivityIndicator size="small" color={colors.circuitTeal} />}
            </View>
          )}

          {!ratesSet && (
            <Pressable style={styles.banner} onPress={() => navigation.navigate('Rates')}>
              <MaterialIcons name="warning-amber" size={26} color={colors.accentAmber} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={styles.bannerTitle}>{t('home.banner.title')}</Text>
                <Text style={styles.bannerSub}>{t('home.banner.sub')}</Text>
              </View>
              <Text style={styles.bannerCta}>{t('home.banner.cta')}</Text>
            </Pressable>
          )}

          <Animated.View style={[styles.ctaShadow, { shadowOpacity, shadowColor: theme.accentSoft }]}>
            <Pressable onPress={() => navigation.navigate('Quote', { quoteId: undefined })}>
              <LinearGradient
                colors={theme.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaCard}
              >
                <MaterialIcons name={theme.ctaBgIcon} size={170} color="#fff" style={styles.ctaBgBolt} />
                <View style={styles.ctaIconBox}>
                  <MaterialIcons name={theme.ctaIcon} size={30} color="#fff" />
                </View>
                <View style={{ flex: 1, marginHorizontal: 14 }}>
                  <Text style={styles.ctaTitle}>{t('home.cta.title')}</Text>
                  <Text style={styles.ctaSub}>{t('home.cta.sub')}</Text>
                </View>
                <View style={styles.ctaArrow}>
                  <MaterialIcons name="arrow-back" size={22} color="#fff" />
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <View style={styles.statsRow}>
            <StatCard
              icon="receipt-long"
              iconColor={theme.secondary}
              label={t('home.stats.totalQuotes')}
              value={String(quotes.length)}
              footnote={t('home.stats.cumulative')}
            />
            <View style={{ width: 12 }} />
            <StatCard
              icon="trending-up"
              iconColor={colors.liveWire}
              label={t('home.stats.monthAmount')}
              value={formatILS(monthTotal(quotes))}
              footnote={t('home.stats.thisMonth')}
              ltrValue
            />
          </View>

          <View style={[styles.statsRow, { marginTop: 12 }]}>
            <StatCard
              icon="thumb-up"
              iconColor={'#0284c7'}
              label={t('home.stats.conversion')}
              value={`${conversionRate(quotes)}%`}
              footnote={t('home.stats.conversionHint')}
              ltrValue
            />
            <View style={{ width: 12 }} />
            <StatCard
              icon="schedule"
              iconColor={'#6b7280'}
              label={t('home.stats.pending')}
              value={String(quotes.filter(q => (q.dealStatus || 'pending') === 'pending').length)}
              footnote={t('home.stats.pendingHint')}
            />
          </View>

          <MonthlyChart t={t} stats={monthlyStats(quotes)} theme={theme} />

          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="folder-special" size={20} color={theme.iconAccent} />
            <Text style={styles.sectionTitle}>{t('home.projects')}</Text>
            {quotes.length > 5 && (
              <Text style={styles.sectionTrailing}>{quotes.length} {t('home.total')}</Text>
            )}
          </View>

          {quotes.length === 0 ? (
            <EmptyQuotes t={t} theme={theme} onCreate={() => navigation.navigate('Quote', { quoteId: undefined })} />
          ) : (
            quotes.slice(0, 5).map((q) => (
              <QuoteTile
                key={q.id}
                t={t}
                theme={theme}
                quote={q}
                onPress={() => navigation.navigate('Quote', { quoteId: q.id })}
                onLongPress={() => onDeleteQuote(q)}
                onPressStatus={() => onChangePaymentStatus(q)}
                onPressDealStatus={() => onChangeDealStatus(q)}
              />
            ))
          )}

          {quotes.length > 0 && (
            <Text style={styles.hint}>{t('home.hint')}</Text>
          )}

          <Pressable onPress={() => setFeedbackOpen(true)} style={styles.feedbackChip}>
            <MaterialIcons name="campaign" size={18} color={colors.primaryBright} />
            <Text style={styles.feedbackChipText}>{t('feedback.homeCta')}</Text>
          </Pressable>
        </ScrollView>

        <FeedbackModal visible={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

        <Modal visible={!!partialQuote} animationType="slide" transparent onRequestClose={() => setPartialQuote(null)}>
          <KeyboardAvoidingView
            style={styles.modalRoot}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Pressable style={styles.modalBackdrop} onPress={() => setPartialQuote(null)} />
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t('pay.partialTitle')}</Text>
              {!!partialQuote && (
                <Text style={styles.modalSub}>
                  {t('pay.outOf', { total: formatILS(partialQuote.total) })}
                </Text>
              )}
              <View style={styles.modalInputWrap}>
                <Text style={styles.modalCurrency}>₪</Text>
                <TextInput
                  style={styles.modalInput}
                  value={partialAmountInput}
                  onChangeText={setPartialAmountInput}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textFaint}
                  autoFocus
                />
              </View>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalCancel} onPress={() => setPartialQuote(null)}>
                  <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalSave, { backgroundColor: theme.accent }]}
                  onPress={savePartialAmount}
                >
                  <MaterialIcons name="save" size={18} color="#fff" />
                  <Text style={styles.modalSaveText}>{t('common.save')}</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
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
      <MaterialIcons name={theme.bgIconPrimary} size={220} color="#fff" style={styles.bgBoltTop} />
      <MaterialIcons name={theme.bgIconSecondary} size={170} color="#fff" style={styles.bgBoltMid} />
      <MaterialIcons name={theme.bgIconTertiary} size={150} color="#fff" style={styles.bgBoltBottom} />
    </>
  );
}

function StatCard({ icon, iconColor, label, value, footnote, ltrValue }) {
  return (
    <View style={[styles.statCard, { borderColor: iconColor + '4D' }]}>
      <LinearGradient
        colors={[iconColor + '24', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[styles.statIconWrap, { backgroundColor: iconColor + '2A', borderColor: iconColor + '55' }]}>
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, ltrValue && { writingDirection: 'ltr' }]}>{value}</Text>
      <Text style={styles.statFootnote}>{footnote}</Text>
    </View>
  );
}

const PAY_STATUS_STYLE = {
  paid:    { color: '#16a34a', bg: '#16a34a22', border: '#16a34a66', icon: 'check-circle' },
  partial: { color: '#d97706', bg: '#d9770622', border: '#d9770666', icon: 'schedule' },
  unpaid:  { color: '#dc2626', bg: '#dc262622', border: '#dc262666', icon: 'pending' },
};

const DEAL_STATUS_STYLE = {
  pending: { color: '#6b7280', bg: '#6b728022', border: '#6b728066', icon: 'hourglass-empty' },
  won:     { color: '#0284c7', bg: '#0284c722', border: '#0284c766', icon: 'thumb-up' },
  lost:    { color: '#9ca3af', bg: '#9ca3af22', border: '#9ca3af66', icon: 'thumb-down' },
};

function progressColor(pct) {
  if (pct === 0) return '#9CA3AF';
  if (pct < 51) return '#F59E0B';
  if (pct < 100) return '#2563EB';
  return '#10B981';
}

function computeProgress(quote) {
  const zones = quote?.progress?.zones || [];
  let total = 0, done = 0;
  zones.forEach((z) => (z.tasks || []).forEach((tk) => {
    total += 1; if (tk.done) done += 1;
  }));
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function QuoteTile({ t, theme, quote, onPress, onLongPress, onPressStatus, onPressDealStatus }) {
  const date = quote.createdAt;
  const dateStr = `${date.getDate()}/${date.getMonth() + 1}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const title = quote.projectName?.trim() || quote.clientName?.trim() || t('home.unnamed');
  const itemsText = t('home.itemsCount', { n: quote.itemCount });
  const sub = quote.projectName && quote.clientName ? `${quote.clientName} · ${itemsText}` : `${itemsText} · ${dateStr}`;
  const status = quote.paymentStatus || 'unpaid';
  const ps = PAY_STATUS_STYLE[status] || PAY_STATUS_STYLE.unpaid;
  const paidAmount = Number(quote.paidAmount) || 0;
  const payLabel = status === 'partial' && paidAmount > 0
    ? `${t('pay.partial')} · ${formatILS(paidAmount)}`
    : t('pay.' + status);
  const dealStatus = quote.dealStatus || 'pending';
  const ds = DEAL_STATUS_STYLE[dealStatus] || DEAL_STATUS_STYLE.pending;
  const dealLabel = t('deal.' + dealStatus);
  const totalDimmed = dealStatus === 'lost';
  const prog = computeProgress(quote);
  return (
    <Pressable
      style={({ pressed }) => [styles.quoteTile, pressed && { transform: [{ scale: 0.99 }], borderColor: colors.cardBorderActive }]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <View style={[styles.quoteAccent, { backgroundColor: theme.accentSoft }]} />
      <View style={[styles.quoteIconWrap, { backgroundColor: theme.iconAccent + '1A', borderColor: theme.iconAccent + '40' }]}>
        <MaterialIcons name={theme.tileIcon} size={22} color={theme.iconAccent} />
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={styles.quoteName} numberOfLines={1}>{title}</Text>
        <Text style={styles.quoteMeta} numberOfLines={1}>{sub}</Text>
        <View style={styles.badgeRow}>
          <Pressable
            style={({ pressed }) => [
              styles.payBadge,
              { backgroundColor: ds.bg, borderColor: ds.border },
              pressed && { opacity: 0.7 },
            ]}
            onPress={onPressDealStatus}
            hitSlop={6}
          >
            <MaterialIcons name={ds.icon} size={12} color={ds.color} />
            <Text style={[styles.payBadgeText, { color: ds.color }]}>{dealLabel}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.payBadge,
              { backgroundColor: ps.bg, borderColor: ps.border },
              pressed && { opacity: 0.7 },
            ]}
            onPress={onPressStatus}
            hitSlop={6}
          >
            <MaterialIcons name={ps.icon} size={12} color={ps.color} />
            <Text style={[styles.payBadgeText, { color: ps.color }]}>{payLabel}</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.quoteTotal, { color: totalDimmed ? colors.textFaint : theme.accentSoft, textDecorationLine: totalDimmed ? 'line-through' : 'none' }]}>{formatILS(quote.total)}</Text>
        {prog.total > 0 && (
          <View style={[styles.progressMini, { borderColor: progressColor(prog.pct) + '88', backgroundColor: progressColor(prog.pct) + '22' }]}>
            <MaterialIcons name="checklist-rtl" size={11} color={progressColor(prog.pct)} />
            <Text style={[styles.progressMiniText, { color: progressColor(prog.pct) }]}>{prog.pct}%</Text>
          </View>
        )}
      </View>
      <MaterialIcons name="chevron-left" size={22} color={colors.textFaint} />
    </Pressable>
  );
}

function MonthlyChart({ t, stats, theme }) {
  const max = Math.max(1, ...stats.map((b) => b.total));
  const hasAny = stats.some((b) => b.total > 0);
  const MAX_BAR = 96;
  const MIN_BAR = 6;
  const currentIdx = stats.length - 1;

  return (
    <View style={chartStyles.card}>
      <LinearGradient
        colors={[theme.secondary + '14', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={chartStyles.headerRow}>
        <MaterialIcons name="show-chart" size={20} color={theme.secondary} />
        <View style={{ flex: 1 }}>
          <Text style={chartStyles.title}>{t('home.chart.title')}</Text>
          <Text style={chartStyles.sub}>{t('home.chart.sub')}</Text>
        </View>
      </View>

      {!hasAny ? (
        <View style={chartStyles.emptyWrap}>
          <Text style={chartStyles.emptyText}>{t('home.chart.empty')}</Text>
        </View>
      ) : (
        <View style={chartStyles.barsRow}>
          {stats.map((b, idx) => {
            const ratio = max > 0 ? b.total / max : 0;
            const height = b.total > 0 ? Math.max(MIN_BAR, Math.round(ratio * MAX_BAR)) : MIN_BAR;
            const isCurrent = idx === currentIdx;
            const hasValue = b.total > 0;
            return (
              <View key={idx} style={chartStyles.barColumn}>
                <Text
                  style={[chartStyles.barValue, !hasValue && { opacity: 0.4 }]}
                  numberOfLines={1}
                >
                  {hasValue ? formatILS(b.total) : '—'}
                </Text>
                <View style={[chartStyles.barTrack, { height: MAX_BAR }]}>
                  <LinearGradient
                    colors={hasValue
                      ? [theme.accentSoft, theme.secondary]
                      : [colors.cardElevated, colors.cardElevated]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[chartStyles.bar, { height, opacity: hasValue ? 1 : 0.35 }]}
                  />
                </View>
                <Text style={[chartStyles.barLabel, isCurrent && chartStyles.barLabelActive]}>
                  {b.label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  card: {
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1, borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { color: colors.text, fontWeight: '800', fontSize: 15 },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },

  barsRow: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    gap: 6,
  },
  barColumn: {
    flex: 1, alignItems: 'center', gap: 4,
  },
  barValue: {
    color: colors.text, fontSize: 10, fontWeight: '700',
    direction: 'ltr',
  },
  barTrack: {
    width: '100%', justifyContent: 'flex-end',
    borderRadius: 8, overflow: 'hidden',
    backgroundColor: 'rgba(15, 18, 28, 0.05)',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    color: colors.textMuted, fontSize: 11, fontWeight: '600',
    marginTop: 2,
  },
  barLabelActive: { color: colors.voltageYellow, fontWeight: '800' },

  emptyWrap: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 13, fontWeight: '500' },
});

function EmptyQuotes({ t, theme, onCreate }) {
  return (
    <View style={styles.emptyCard}>
      <LinearGradient
        colors={[theme.accent + '15', theme.secondary + '10', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Decorative bubbles */}
      <View style={[styles.emptyBubble, styles.emptyBubble1, { backgroundColor: theme.accent + '20' }]} />
      <View style={[styles.emptyBubble, styles.emptyBubble2, { backgroundColor: theme.secondary + '25' }]} />
      <View style={[styles.emptyBubble, styles.emptyBubble3, { backgroundColor: theme.iconAccent + '30' }]} />

      <View style={[styles.emptyIconWrap, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '66' }]}>
        <MaterialIcons name={theme.ctaIcon} size={52} color={theme.accent} />
      </View>
      <Text style={styles.emptyTitle}>{t('home.empty.title')}</Text>
      <Text style={styles.emptySub}>{t('home.empty.sub')}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.emptyButton,
          { borderColor: theme.accent, backgroundColor: theme.accent },
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
        onPress={onCreate}
      >
        <MaterialIcons name="add" size={22} color="#fff" />
        <Text style={[styles.emptyButtonText, { color: '#fff' }]}>{t('home.empty.cta')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 28 },

  bgBoltTop: { position: 'absolute', top: -25, right: -20, opacity: 0.08, transform: [{ rotate: '15deg' }] },
  bgBoltMid: { position: 'absolute', top: 320, left: -35, opacity: 0.06, transform: [{ rotate: '-25deg' }] },
  bgBoltBottom: { position: 'absolute', bottom: 80, right: -15, opacity: 0.07, transform: [{ rotate: '8deg' }] },

  banner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14,
    backgroundColor: colors.voltageYellow + '14',
    borderRadius: 16,
    borderWidth: 1, borderColor: colors.accentAmber + '66',
    marginTop: 16,
  },
  bannerTitle: { fontWeight: '800', color: colors.text, fontSize: 14 },
  bannerSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  bannerCta: { color: colors.voltageYellow, fontWeight: '800' },

  verifyBanner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14,
    backgroundColor: colors.circuitTeal + '14',
    borderRadius: 16,
    borderWidth: 1, borderColor: colors.circuitTeal + '66',
    marginTop: 16,
  },
  verifyBannerTitle: { fontWeight: '800', color: colors.text, fontSize: 14 },
  verifyBannerSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  verifyBannerActions: { flexDirection: 'row', gap: 18, marginTop: 8 },
  verifyBannerAction: { color: colors.circuitTeal, fontWeight: '800', fontSize: 12 },

  ctaShadow: {
    marginTop: 18,
    borderRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 22,
    elevation: 10,
  },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 26,
    paddingVertical: 22, paddingHorizontal: 22,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  ctaBgBolt: {
    position: 'absolute', right: -25, top: -35,
    opacity: 0.08, transform: [{ rotate: '20deg' }],
  },
  ctaIconBox: {
    width: 58, height: 58, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaTitle: { color: '#fff', fontSize: 19, fontWeight: '900', letterSpacing: 0.3 },
  ctaSub: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 5, letterSpacing: 0.2 },
  ctaArrow: { padding: 8, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.22)' },

  statsRow: { flexDirection: 'row', marginTop: 18 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20, padding: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12,
  },
  statIconWrap: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  statLabel: { color: colors.textMuted, fontWeight: '600', marginTop: 14, fontSize: 11.5, letterSpacing: 0.3, textTransform: 'uppercase' },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 4, letterSpacing: -0.4 },
  statFootnote: { color: colors.textFaint, fontSize: 11, marginTop: 3, fontWeight: '500' },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22, gap: 8 },
  sectionTitle: { fontWeight: '900', fontSize: 16, color: '#fff', flex: 1, letterSpacing: 0.3 },
  sectionTrailing: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' },

  quoteTile: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20, padding: 14, marginTop: 12,
    borderWidth: 1, borderColor: colors.cardBorder,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10,
  },
  quoteAccent: {
    position: 'absolute',
    right: 0, top: 10, bottom: 10,
    width: 4, borderRadius: 3,
    backgroundColor: colors.primaryBright,
  },
  quoteIconWrap: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: colors.voltageYellow + '1A',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.voltageYellow + '40',
  },
  quoteName: { fontWeight: '700', fontSize: 14, color: colors.text },
  quoteMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  quoteTotal: { color: colors.primaryBright, fontWeight: '800', marginEnd: 6 },
  badgeRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
    marginTop: 6,
  },
  payBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  payBadgeText: { fontSize: 11, fontWeight: '800' },

  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 32,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  modalHandle: {
    alignSelf: 'center', width: 44, height: 4, borderRadius: 2,
    backgroundColor: colors.dividerDark, marginBottom: 14,
  },
  modalTitle: { color: colors.text, fontWeight: '900', fontSize: 18, marginBottom: 6, textAlign: 'right' },
  modalSub: { color: colors.textMuted, fontSize: 13, marginBottom: 14, textAlign: 'right' },
  modalInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.cardElevated,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4,
    borderWidth: 1, borderColor: colors.cardBorder,
    marginBottom: 14,
  },
  modalCurrency: { color: colors.textMuted, fontSize: 22, fontWeight: '800' },
  modalInput: { flex: 1, fontSize: 22, color: colors.text, textAlign: 'right', paddingVertical: 10, fontWeight: '800' },
  modalActions: { flexDirection: 'row', gap: 10 },
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

  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 24, padding: 28, marginTop: 12,
    alignItems: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: colors.cardBorder,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 14,
  },
  emptyIconWrap: {
    width: 96, height: 96, borderRadius: 28,
    backgroundColor: colors.circuitTeal + '22',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.circuitTeal + '55',
  },
  emptyTitle: { fontWeight: '900', fontSize: 18, marginTop: 16, color: colors.text, letterSpacing: 0.2 },
  emptySub: { color: colors.textMuted, fontSize: 14, marginTop: 6, textAlign: 'center' },
  emptyButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 22, paddingVertical: 13,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 4,
  },
  emptyButtonText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.3 },
  emptyBubble: { position: 'absolute', borderRadius: 999 },
  emptyBubble1: { width: 90, height: 90, top: -20, right: -20 },
  emptyBubble2: { width: 60, height: 60, bottom: 10, left: -10 },
  emptyBubble3: { width: 36, height: 36, top: 30, left: 20 },

  hint: { color: 'rgba(255,255,255,0.75)', fontSize: 11, textAlign: 'center', marginTop: 14, fontWeight: '600' },

  feedbackChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 18, marginBottom: 4,
    paddingHorizontal: 16, paddingVertical: 12,
    alignSelf: 'center',
    borderRadius: 999,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryBright + '88',
    backgroundColor: colors.primaryBright + '14',
  },
  feedbackChipText: { color: colors.primaryBright, fontWeight: '800', fontSize: 13 },

  progressMini: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999, borderWidth: 1,
    marginTop: 4,
  },
  progressMiniText: { fontWeight: '900', fontSize: 11 },
});
