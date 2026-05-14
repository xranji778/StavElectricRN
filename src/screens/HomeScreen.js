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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { formatILS } from '../utils/currency';
import { loadRates, loadQuotes, hasAnyRate, deleteQuote } from '../data/storage';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ScreenHeader from '../components/ScreenHeader';

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'home.greetMorning';
  if (h < 17) return 'home.greetAfternoon';
  if (h < 21) return 'home.greetEvening';
  return 'home.greetNight';
}

function monthTotal(quotes) {
  const now = new Date();
  return quotes
    .filter((q) => q.createdAt.getFullYear() === now.getFullYear() && q.createdAt.getMonth() === now.getMonth())
    .reduce((s, q) => s + q.total, 0);
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [rates, setRates] = useState({});
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const ctaGlow = useRef(new Animated.Value(0)).current;
  const sparkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaGlow, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(ctaGlow, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(sparkOpacity, { toValue: 1, duration: 90, useNativeDriver: true }),
        Animated.timing(sparkOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.delay(200),
        Animated.timing(sparkOpacity, { toValue: 0.7, duration: 60, useNativeDriver: true }),
        Animated.timing(sparkOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]),
    ).start();
  }, [ctaGlow, sparkOpacity]);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryBright} />
      </SafeAreaView>
    );
  }

  const ratesSet = hasAnyRate(rates);
  const shadowOpacity = ctaGlow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.75] });

  return (
    <View style={styles.flex}>
      <BgDecoration />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); refresh(); }} tintColor={colors.primaryBright} />}
        >
          <ScreenHeader
            icon="electrical-services"
            title="StavElectric"
            subtitle={`${t(greetingKey())}, ${user?.displayName || ''} 👋   ${t('home.readyForNew')}`}
          />

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

          <Animated.View style={[styles.ctaShadow, { shadowOpacity }]}>
            <Pressable onPress={() => navigation.navigate('Quote', { quoteId: undefined })}>
              <LinearGradient
                colors={['#2563FF', '#1E5BFF', '#0EA5C7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaCard}
              >
                <MaterialIcons name="bolt" size={180} color="#fff" style={styles.ctaBgBolt} />
                <Animated.View style={[styles.ctaSpark, { opacity: sparkOpacity }]}>
                  <MaterialIcons name="bolt" size={48} color={colors.voltageYellow} />
                </Animated.View>
                <View style={styles.ctaIconBox}>
                  <MaterialIcons name="bolt" size={32} color="#fff" />
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
              iconColor={colors.circuitTeal}
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

          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="folder-special" size={20} color={colors.voltageYellow} />
            <Text style={styles.sectionTitle}>{t('home.projects')}</Text>
            {quotes.length > 5 && (
              <Text style={styles.sectionTrailing}>{quotes.length} {t('home.total')}</Text>
            )}
          </View>

          {quotes.length === 0 ? (
            <EmptyQuotes t={t} onCreate={() => navigation.navigate('Quote', { quoteId: undefined })} />
          ) : (
            quotes.slice(0, 5).map((q) => (
              <QuoteTile
                key={q.id}
                t={t}
                quote={q}
                onPress={() => navigation.navigate('Quote', { quoteId: q.id })}
                onLongPress={() => onDeleteQuote(q)}
              />
            ))
          )}

          {quotes.length > 0 && (
            <Text style={styles.hint}>{t('home.hint')}</Text>
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
      <MaterialIcons name="bolt" size={260} color={colors.primaryBright} style={styles.bgBoltTop} />
      <MaterialIcons name="flash-on" size={200} color={colors.circuitTeal} style={styles.bgBoltMid} />
      <MaterialIcons name="bolt" size={180} color={colors.voltageYellow} style={styles.bgBoltBottom} />
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

function QuoteTile({ t, quote, onPress, onLongPress }) {
  const date = quote.createdAt;
  const dateStr = `${date.getDate()}/${date.getMonth() + 1}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const title = quote.projectName?.trim() || quote.clientName?.trim() || t('home.unnamed');
  const itemsText = t('home.itemsCount', { n: quote.itemCount });
  const sub = quote.projectName && quote.clientName ? `${quote.clientName} · ${itemsText}` : `${itemsText} · ${dateStr}`;
  return (
    <Pressable
      style={({ pressed }) => [styles.quoteTile, pressed && { transform: [{ scale: 0.99 }], borderColor: colors.cardBorderActive }]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
    >
      <View style={styles.quoteAccent} />
      <View style={styles.quoteIconWrap}>
        <MaterialIcons name="bolt" size={22} color={colors.voltageYellow} />
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={styles.quoteName} numberOfLines={1}>{title}</Text>
        <Text style={styles.quoteMeta} numberOfLines={1}>{sub}</Text>
      </View>
      <Text style={styles.quoteTotal}>{formatILS(quote.total)}</Text>
      <MaterialIcons name="chevron-left" size={22} color={colors.textFaint} />
    </Pressable>
  );
}

function EmptyQuotes({ t, onCreate }) {
  return (
    <View style={styles.emptyCard}>
      <LinearGradient
        colors={[colors.circuitTeal + '22', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.emptyIconWrap}>
        <MaterialIcons name="bolt" size={36} color={colors.circuitTeal} />
      </View>
      <Text style={styles.emptyTitle}>{t('home.empty.title')}</Text>
      <Text style={styles.emptySub}>{t('home.empty.sub')}</Text>
      <Pressable style={styles.emptyButton} onPress={onCreate}>
        <MaterialIcons name="add" size={20} color={colors.primaryBright} />
        <Text style={styles.emptyButtonText}>{t('home.empty.cta')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  container: { padding: 16, paddingBottom: 28 },

  bgBoltTop: { position: 'absolute', top: -40, right: -30, opacity: 0.04, transform: [{ rotate: '15deg' }] },
  bgBoltMid: { position: 'absolute', top: 260, left: -50, opacity: 0.035, transform: [{ rotate: '-25deg' }] },
  bgBoltBottom: { position: 'absolute', bottom: 80, right: -20, opacity: 0.04, transform: [{ rotate: '8deg' }] },

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

  ctaShadow: {
    marginTop: 16,
    borderRadius: 22,
    shadowColor: colors.primaryBright,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 22,
    elevation: 10,
  },
  ctaCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 22,
    padding: 18,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  ctaBgBolt: {
    position: 'absolute', right: -30, top: -40,
    opacity: 0.14, transform: [{ rotate: '20deg' }],
  },
  ctaSpark: {
    position: 'absolute', left: 40, top: 14,
  },
  ctaIconBox: {
    width: 58, height: 58, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  ctaSub: { color: 'rgba(255,255,255,0.92)', fontSize: 13, marginTop: 4 },
  ctaArrow: { padding: 6, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)' },

  statsRow: { flexDirection: 'row', marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16, padding: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  statIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  statLabel: { color: colors.textMuted, fontWeight: '600', marginTop: 12, fontSize: 12 },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2, letterSpacing: -0.5 },
  statFootnote: { color: colors.textFaint, fontSize: 11, marginTop: 2, fontWeight: '500' },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22, gap: 8 },
  sectionTitle: { fontWeight: '800', fontSize: 16, color: colors.text, flex: 1 },
  sectionTrailing: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },

  quoteTile: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16, padding: 12, marginTop: 10,
    borderWidth: 1, borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  quoteAccent: {
    position: 'absolute',
    right: 0, top: 8, bottom: 8,
    width: 3, borderRadius: 2,
    backgroundColor: colors.primaryBright,
  },
  quoteIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.voltageYellow + '1A',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.voltageYellow + '40',
  },
  quoteName: { fontWeight: '700', fontSize: 14, color: colors.text },
  quoteMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  quoteTotal: { color: colors.primaryBright, fontWeight: '800', marginEnd: 6 },

  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 22, marginTop: 10,
    alignItems: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  emptyIconWrap: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: colors.circuitTeal + '22',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.circuitTeal + '55',
  },
  emptyTitle: { fontWeight: '800', fontSize: 16, marginTop: 12, color: colors.text },
  emptySub: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  emptyButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1, borderColor: colors.primaryBright + 'AA',
    backgroundColor: colors.primaryBright + '1A',
    marginTop: 14,
  },
  emptyButtonText: { color: colors.primaryBright, fontWeight: '800' },

  hint: { color: colors.textFaint, fontSize: 11, textAlign: 'center', marginTop: 14 },
});
