import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { getProfessionTheme } from '../theme/professionThemes';
import { useAuth } from '../contexts/AuthContext';
import ProQuoteLogo from './ProQuoteLogo';

export default function ScreenHeader({ icon, title, subtitle, showUser = true, showSettings = true }) {
  const { user, logout } = useAuth();
  const theme = getProfessionTheme(user?.activeProfession);
  const navigation = useNavigation();
  const resolvedIcon = icon || theme.headerIcon;
  const resolvedTitle = title || theme.appName;

  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <View style={styles.cardWrap}>
      <LinearGradient
        colors={theme.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <MaterialIcons name={theme.bgIconPrimary} size={140} color={theme.accent} style={styles.bgIconLeft} />

      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <ProQuoteLogo size={42} gradient={theme.ctaGradient} />
          <View style={{ flex: 1, marginStart: 12 }}>
            <Text style={styles.title}>{resolvedTitle}</Text>
            <View style={styles.subBadgeRow}>
              <MaterialIcons name={resolvedIcon} size={11} color={theme.iconAccent} />
              <Text style={[styles.brandTagline, { color: theme.iconAccent }]}>{theme.professionLabel}</Text>
            </View>
          </View>
          {showUser && user && (
            <Pressable style={styles.userChip} onPress={logout} hitSlop={8}>
              <View style={styles.dotWrap}>
                <Animated.View style={[styles.dotRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
                <View style={styles.dot} />
              </View>
              <Text style={styles.userName} numberOfLines={1}>{user.displayName}</Text>
              <MaterialIcons name="logout" size={14} color="rgba(255,255,255,0.85)" />
            </Pressable>
          )}
          {showSettings && (
            <Pressable
              style={styles.gearBtn}
              onPress={() => navigation.navigate('Settings')}
              hitSlop={10}
            >
              <MaterialIcons name="settings" size={20} color="#fff" />
            </Pressable>
          )}
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={[styles.accentStripe, { backgroundColor: theme.accentSoft }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0F121C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 7,
  },
  bgIconLeft: {
    position: 'absolute',
    right: -10, top: -15,
    opacity: 0.07,
    transform: [{ rotate: '-12deg' }],
  },
  cardContent: { padding: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: 0.4 },
  subBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  brandTagline: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  subtitle: { color: 'rgba(255,255,255,0.78)', fontSize: 13, marginTop: 18, lineHeight: 18 },

  userChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
    maxWidth: 140,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
  },
  dotWrap: { width: 10, height: 10, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5FC79E', position: 'absolute' },
  dotRing: {
    position: 'absolute',
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#5FC79E',
  },
  userName: { color: '#fff', fontWeight: '700', fontSize: 12, flexShrink: 1 },

  gearBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginStart: 6,
  },

  accentStripe: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 3,
  },
});
