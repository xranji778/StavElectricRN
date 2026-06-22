// Per-profession theming — each profession owns a vivid signature color.
// Inspired by Notion/Duolingo: bold accent, friendly icons, soft surfaces.

const APP_NAME = 'הצעות מחיר';

export const PROFESSION_THEMES = {
  electrician: {
    appName: APP_NAME,
    professionLabel: 'חשמלאי',
    accent: '#7C3AED',          // vivid purple
    accentSoft: '#A78BFA',
    accentDark: '#5B21B6',
    secondary: '#F59E0B',        // sunshine pairs with purple
    iconAccent: '#FBBF24',
    bgIconPrimary: 'bolt',
    bgIconSecondary: 'flash-on',
    bgIconTertiary: 'bolt',
    headerIcon: 'electrical-services',
    ctaIcon: 'bolt',
    ctaBgIcon: 'bolt',
    tileIcon: 'bolt',
    ctaGradient: ['#F59E0B', '#FBBF24'],   // sunshine CTA pops on green bg
    headerGradient: ['#0F0A1E', '#1A0B2E', '#0F0A1E'],  // very dark purple hero for contrast
  },
  plumber: {
    appName: APP_NAME,
    professionLabel: 'אינסטלטור',
    accent: '#06B6D4',           // sky cyan
    accentSoft: '#22D3EE',
    accentDark: '#0E7490',
    secondary: '#0EA5E9',
    iconAccent: '#67E8F9',
    bgIconPrimary: 'water-drop',
    bgIconSecondary: 'opacity',
    bgIconTertiary: 'plumbing',
    headerIcon: 'plumbing',
    ctaIcon: 'water-drop',
    ctaBgIcon: 'water-drop',
    tileIcon: 'plumbing',
    ctaGradient: ['#FB923C', '#FDBA74'],
    headerGradient: ['#0B1B30', '#13294B', '#0B1B30'],
  },
  comms: {
    appName: APP_NAME,
    professionLabel: 'איש תקשורת',
    accent: '#10B981',           // emerald
    accentSoft: '#34D399',
    accentDark: '#047857',
    secondary: '#22C55E',
    iconAccent: '#6EE7B7',
    bgIconPrimary: 'wifi',
    bgIconSecondary: 'router',
    bgIconTertiary: 'settings-input-antenna',
    headerIcon: 'router',
    ctaIcon: 'settings-input-antenna',
    ctaBgIcon: 'router',
    tileIcon: 'router',
    ctaGradient: ['#FBBF24', '#FCD34D'],
    headerGradient: ['#0A0F12', '#101820', '#0A0F12'],
  },
  contractor: {
    appName: APP_NAME,
    professionLabel: 'שיפוצניק',
    accent: '#F97316',           // warm orange
    accentSoft: '#FB923C',
    accentDark: '#C2410C',
    secondary: '#F59E0B',
    iconAccent: '#FDBA74',
    bgIconPrimary: 'construction',
    bgIconSecondary: 'handyman',
    bgIconTertiary: 'home-repair-service',
    headerIcon: 'construction',
    ctaIcon: 'home-repair-service',
    ctaBgIcon: 'construction',
    tileIcon: 'construction',
    ctaGradient: ['#F97316', '#FB923C'],
    headerGradient: ['#2A1408', '#3A1F0E', '#2A1408'],
  },
};

export function getProfessionTheme(professionId) {
  return PROFESSION_THEMES[professionId] || PROFESSION_THEMES.electrician;
}
