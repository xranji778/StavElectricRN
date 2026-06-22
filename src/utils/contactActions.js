import { Linking, Alert, Platform } from 'react-native';

function toIntlPhone(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('972')) return digits;
  if (digits.startsWith('0')) return '972' + digits.slice(1);
  return '972' + digits;
}

export async function callPhone(phone) {
  if (!phone) return;
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return;
  const url = `tel:${digits}`;
  try {
    await Linking.openURL(url);
  } catch (e) {
    Alert.alert('שגיאה', 'לא ניתן לפתוח את אפליקציית הטלפון');
  }
}

export async function whatsappTo(phone) {
  const intl = toIntlPhone(phone);
  if (!intl) return;
  const primary = `whatsapp://send?phone=${intl}`;
  const fallback = `https://wa.me/${intl}`;
  try {
    const canOpen = await Linking.canOpenURL(primary);
    if (canOpen) {
      await Linking.openURL(primary);
      return;
    }
  } catch (e) {
    // ignore
  }
  try {
    await Linking.openURL(fallback);
  } catch (e) {
    Alert.alert('WhatsApp', 'לא ניתן לפתוח את WhatsApp');
  }
}

export async function navigateToAddress(address) {
  if (!address) return;
  const encoded = encodeURIComponent(String(address).trim());
  const waze = `waze://?q=${encoded}&navigate=yes`;
  const googleMaps = Platform.OS === 'ios'
    ? `https://maps.apple.com/?daddr=${encoded}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
  try {
    const canOpenWaze = await Linking.canOpenURL(waze);
    if (canOpenWaze) {
      await Linking.openURL(waze);
      return;
    }
  } catch (e) {
    // ignore
  }
  try {
    await Linking.openURL(googleMaps);
  } catch (e) {
    Alert.alert('ניווט', 'לא ניתן לפתוח את אפליקציית הניווט');
  }
}
