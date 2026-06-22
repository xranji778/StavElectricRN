// Dark premium palette — deep navy bg, dark cards, vibrant pops per profession.
// Friendly + contemporary; supports per-profession accents.

export const colors = {
  // Brand defaults (overridden per profession)
  primarySeed: '#7C3AED',
  primaryBright: '#A78BFA',     // vivid lavender pops on dark
  accentAmber: '#F59E0B',
  voltageYellow: '#FBBF24',
  liveWire: '#34D399',
  circuitTeal: '#22D3EE',

  // Surfaces — deep navy / charcoal
  bg: '#0B0E18',                 // base
  bgSoft: '#141826',             // slightly elevated
  bgGradient: ['#0B0E18', '#141826', '#0B0E18'],  // subtle dark gradient
  card: '#1A1F30',
  cardElevated: '#22293F',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
  cardBorderActive: 'rgba(167, 139, 250, 0.55)',
  glowBlue: 'rgba(167, 139, 250, 0.18)',
  glowTeal: 'rgba(34, 211, 238, 0.18)',

  // Text (light on dark)
  text: '#F5F7FA',
  textMuted: 'rgba(245, 247, 250, 0.65)',
  textFaint: 'rgba(245, 247, 250, 0.40)',
  dividerDark: 'rgba(255, 255, 255, 0.06)',

  // Status
  success: '#34D399',
  danger: '#F87171',

  // Legacy aliases (PDF still expects light bg, keep separate)
  textPrimary: '#F5F7FA',
  textSecondary: '#9CA3AF',
  divider: '#2A2F45',
  surfaceLight: '#F5F4F0',       // PDF only
  panelDark: '#0B0E18',
  panelDarkSoft: '#141826',
  traceGold: '#FBBF24',
};
