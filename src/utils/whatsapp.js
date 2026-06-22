import { Linking, Alert } from 'react-native';
import { VAT_RATE } from '../data/catalog';

function formatILS(n) {
  const num = Number.isFinite(n) ? n : 0;
  return '₪' + num.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function toIntlPhone(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('972')) return digits;
  if (digits.startsWith('0')) return '972' + digits.slice(1);
  return '972' + digits;
}

function buildMessage(quote, user) {
  const greeting = quote.clientName ? `שלום ${quote.clientName},` : 'שלום,';
  const projectLine = quote.projectName ? `מצורפת הצעת מחיר עבור: *${quote.projectName}*` : 'מצורפת הצעת מחיר';
  const vatPct = Math.round(VAT_RATE * 100);

  const bizName = user?.businessName || user?.displayName || '';
  const bizPhone = user?.phone || '';
  const bizLine = bizName ? `*${bizName}*` : '';
  const phoneLine = bizPhone ? `📞 ${bizPhone}` : '';

  const lines = [
    greeting,
    '',
    projectLine,
    '',
    `🔧 פריטים: ${quote.itemCount}`,
    `💰 לפני מע״מ: ${formatILS(quote.subtotal)}`,
    `🏛️ מע״מ (${vatPct}%): ${formatILS(quote.vat)}`,
    `💳 *סה״כ לתשלום: ${formatILS(quote.total)}*`,
    '',
    'תוקף ההצעה: 30 ימים',
    '',
    'בברכה,',
    bizLine,
    phoneLine,
  ].filter((l) => l !== null && l !== undefined);

  return lines.join('\n');
}

function buildPaymentRequestMessage(quote, user) {
  const greeting = quote.clientName ? `שלום ${quote.clientName},` : 'שלום,';
  const projectLine = quote.projectName ? `עבור: *${quote.projectName}*` : '';

  const total = Number(quote.total) || 0;
  const paid = Number(quote.paidAmount) || 0;
  const due = Math.max(0, total - paid);

  const bizName = user?.businessName || user?.displayName || '';
  const bitPhone = user?.bitPhone || user?.phone || '';

  const dueLine = paid > 0 && paid < total
    ? `💰 *סכום נותר לתשלום: ${formatILS(due)}*`
    : `💰 *סכום לתשלום: ${formatILS(due)}*`;

  const lines = [
    greeting,
    '',
    projectLine,
    '',
    dueLine,
    '',
    '📲 *לתשלום ב-Bit / PayBox:*',
    bitPhone ? `מספר: ${bitPhone}` : '',
    '',
    'אנא שלח/י אישור תשלום בחזרה.',
    '',
    'תודה רבה!',
    bizName ? `*${bizName}*` : '',
  ].filter((l) => l !== null && l !== undefined && l !== '');

  return lines.join('\n');
}

export async function requestPaymentViaWhatsApp(quote, user) {
  const message = buildPaymentRequestMessage(quote, user);
  const encoded = encodeURIComponent(message);
  const phone = toIntlPhone(quote?.clientPhone);

  const primary = phone
    ? `whatsapp://send?phone=${phone}&text=${encoded}`
    : `whatsapp://send?text=${encoded}`;

  const fallback = phone
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;

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
    Alert.alert('WhatsApp', 'לא ניתן לפתוח את WhatsApp במכשיר זה');
  }
}

export async function shareQuoteToWhatsApp(quote, user) {
  const message = buildMessage(quote, user);
  const encoded = encodeURIComponent(message);
  const phone = toIntlPhone(quote?.clientPhone);

  const primary = phone
    ? `whatsapp://send?phone=${phone}&text=${encoded}`
    : `whatsapp://send?text=${encoded}`;

  const fallback = phone
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;

  try {
    const canOpen = await Linking.canOpenURL(primary);
    if (canOpen) {
      await Linking.openURL(primary);
      return;
    }
  } catch (e) {
    // ignore and fall through to fallback
  }

  try {
    await Linking.openURL(fallback);
  } catch (e) {
    Alert.alert('WhatsApp', 'לא ניתן לפתוח את WhatsApp במכשיר זה');
  }
}
