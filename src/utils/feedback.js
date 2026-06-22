import { Linking, Alert, Platform } from 'react-native';
import Constants from 'expo-constants';

const STAV_WHATSAPP_PHONE = '972526873674';

export const FEEDBACK_CATEGORIES = [
  { id: 'bug', labelKey: 'feedback.catBug', emoji: '🐞' },
  { id: 'missingItem', labelKey: 'feedback.catMissingItem', emoji: '🧰' },
  { id: 'idea', labelKey: 'feedback.catIdea', emoji: '💡' },
  { id: 'other', labelKey: 'feedback.catOther', emoji: '✉️' },
];

function getAppVersion() {
  return (
    Constants?.expoConfig?.version
    || Constants?.manifest?.version
    || '1.0.0'
  );
}

function getPlatformLabel() {
  if (Platform.OS === 'ios') return 'iPhone';
  if (Platform.OS === 'android') return 'Android';
  return Platform.OS;
}

function buildFeedbackMessage({ category, description, user }) {
  const cat = FEEDBACK_CATEGORIES.find((c) => c.id === category) || FEEDBACK_CATEGORIES[3];
  const catLabel = {
    bug: 'באג / תקלה',
    missingItem: 'פריט חסר',
    idea: 'רעיון לשיפור',
    other: 'אחר',
  }[cat.id];

  const userLine = user?.displayName ? `*משתמש:* ${user.displayName}` : '';
  const bizLine = user?.businessName ? `*עסק:* ${user.businessName}` : '';
  const phoneLine = user?.phone ? `*טלפון:* ${user.phone}` : '';

  const lines = [
    `${cat.emoji} *דיווח חדש מהאפליקציה*`,
    '',
    `*סוג:* ${catLabel}`,
    '',
    '*תיאור:*',
    description?.trim() || '(ללא תיאור)',
    '',
    '— — — — — — — —',
    userLine,
    bizLine,
    phoneLine,
    `*גרסה:* ${getAppVersion()}`,
    `*מכשיר:* ${getPlatformLabel()}`,
    `*תאריך:* ${new Date().toLocaleString('he-IL')}`,
  ].filter((l) => l !== null && l !== undefined && l !== '');

  return lines.join('\n');
}

export async function sendFeedbackViaWhatsApp({ category, description, user }) {
  const message = buildFeedbackMessage({ category, description, user });
  const encoded = encodeURIComponent(message);
  const primary = `whatsapp://send?phone=${STAV_WHATSAPP_PHONE}&text=${encoded}`;
  const fallback = `https://wa.me/${STAV_WHATSAPP_PHONE}?text=${encoded}`;

  try {
    const canOpen = await Linking.canOpenURL(primary);
    if (canOpen) {
      await Linking.openURL(primary);
      return true;
    }
  } catch (e) {
    // ignore and fall through
  }
  try {
    await Linking.openURL(fallback);
    return true;
  } catch (e) {
    Alert.alert('WhatsApp', 'לא ניתן לפתוח את WhatsApp במכשיר זה');
    return false;
  }
}
