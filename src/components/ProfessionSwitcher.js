import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { PROFESSIONS } from '../data/auth';
import { useAuth } from '../contexts/AuthContext';

// Renders a horizontal chip row for switching the user's active profession.
// Returns null if user has 0 or 1 professions (nothing to switch).
export default function ProfessionSwitcher() {
  const { user, switchProfession } = useAuth();
  const professions = user?.professions || [];
  const active = user?.activeProfession;

  if (professions.length < 2) return null;

  const items = PROFESSIONS.filter((p) => professions.includes(p.id));

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((p) => {
          const isActive = p.id === active;
          return (
            <Pressable
              key={p.id}
              onPress={() => switchProfession(p.id)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={styles.chipEmoji}>{p.emoji}</Text>
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{p.label}</Text>
              {isActive && (
                <MaterialIcons name="check-circle" size={14} color={colors.primaryBright} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 14 },
  scrollContent: { gap: 8, paddingHorizontal: 2 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 999,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  chipActive: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primaryBright + '1A',
  },
  chipEmoji: { fontSize: 16 },
  chipLabel: { color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  chipLabelActive: { color: colors.primaryBright },
});
