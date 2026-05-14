import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

export default function ScreenHeader({ icon, title, subtitle, showUser = true }) {
  const { user, logout } = useAuth();

  const pulse = useRef(new Animated.Value(0)).current;
  const iconGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(iconGlow, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(iconGlow, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    ).start();
  }, [pulse, iconGlow]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });
  const iconGlowOpacity = iconGlow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] });

  return (
    <View style={styles.cardWrap}>
      <LinearGradient
        colors={['#0A1228', '#16223F', '#0C1428']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <MaterialIcons name="bolt" size={170} color={colors.primaryBright} style={styles.bgBoltLeft} />
      <MaterialIcons name="flash-on" size={120} color={colors.circuitTeal} style={styles.bgBoltRight} />

      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <Animated.View style={[styles.iconGlow, { opacity: iconGlowOpacity }]} />
            <MaterialIcons name={icon || 'electrical-services'} size={24} color={colors.voltageYellow} />
          </View>
          <Text style={styles.title}>{title}</Text>
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
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <LinearGradient
          colors={['transparent', colors.primaryBright, colors.circuitTeal, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.bottomLine}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: colors.primaryBright,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1, borderColor: 'rgba(94, 137, 255, 0.18)',
  },
  bgBoltLeft: {
    position: 'absolute',
    left: -20, top: -30,
    opacity: 0.08,
    transform: [{ rotate: '-12deg' }],
  },
  bgBoltRight: {
    position: 'absolute',
    right: -10, bottom: -20,
    opacity: 0.06,
    transform: [{ rotate: '24deg' }],
  },
  cardContent: { padding: 18 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.voltageYellow + '14',
    borderWidth: 1, borderColor: colors.voltageYellow + '55',
    alignItems: 'center', justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute', width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.voltageYellow,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '800', flex: 1, marginStart: 2 },
  subtitle: { color: 'rgba(255,255,255,0.82)', fontSize: 13, marginTop: 12 },

  userChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
    maxWidth: 160,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)',
  },
  dotWrap: { width: 10, height: 10, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.liveWire, position: 'absolute' },
  dotRing: {
    position: 'absolute',
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.liveWire,
  },
  userName: { color: '#fff', fontWeight: '700', fontSize: 12, flexShrink: 1 },

  bottomLine: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 2,
    opacity: 0.7,
  },
});
