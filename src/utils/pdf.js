import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getProfessionTheme } from '../theme/professionThemes';
import { LOGO_PNG_BASE64 } from './logoBase64';
import { readPhotoAsBase64 } from './photos';

const APP_NAME = 'הצעות מחיר';
const LOGO_DATA_URI = `data:image/png;base64,${LOGO_PNG_BASE64}`;

function fmt(n) {
  const num = Number.isFinite(n) ? n : 0;
  return num.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function businessHeader(user) {
  const bizName = user?.businessName || user?.displayName || '';
  const phone = user?.phone || '';
  const email = user?.email || '';
  const license = user?.licenseNumber || '';
  const address = user?.address || '';

  const contactBits = [];
  if (phone) contactBits.push(`<span>📞 ${escapeHtml(phone)}</span>`);
  if (email) contactBits.push(`<span>✉ ${escapeHtml(email)}</span>`);
  if (license) contactBits.push(`<span>🔖 רישיון: ${escapeHtml(license)}</span>`);
  if (address) contactBits.push(`<span>📍 ${escapeHtml(address)}</span>`);

  return `
    <div class="biz">
      <div class="biz-name">${escapeHtml(bizName)}</div>
      ${contactBits.length ? `<div class="biz-contact">${contactBits.join(' · ')}</div>` : ''}
    </div>
  `;
}

function sharedStyles(theme) {
  const accent = theme.accent;
  const accentDark = theme.accentDark || theme.accent;
  return `
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap');
  * { box-sizing: border-box; }
  body {
    font-family: 'Heebo', -apple-system, Arial, sans-serif;
    padding: 28px 32px;
    color: #0F1A2B;
    line-height: 1.5;
    margin: 0;
  }
  .header {
    background: linear-gradient(135deg, ${accentDark} 0%, ${accent} 100%);
    color: white;
    padding: 22px 26px;
    border-radius: 18px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .header-logo {
    width: 84px; height: 84px;
    border-radius: 18px;
    background: #0F1729;
    padding: 4px;
    flex-shrink: 0;
  }
  .header-logo img { width: 100%; height: 100%; object-fit: contain; }
  .header-text { flex: 1; }
  .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
  .header .sub { opacity: 0.92; font-size: 13px; margin-top: 4px; font-weight: 500; }
  .biz {
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.25);
  }
  .biz-name {
    font-size: 17px; font-weight: 800; margin: 0 0 4px 0;
  }
  .biz-contact {
    font-size: 11.5px; opacity: 0.92; line-height: 1.7;
  }
  .biz-contact span { white-space: nowrap; }
  .meta {
    margin-top: 22px;
    display: flex;
    justify-content: space-between;
    padding: 14px 18px;
    background: #F6F8FB;
    border-radius: 12px;
  }
  .meta .item { font-size: 13px; color: #5B6878; }
  .meta strong { color: #0F1A2B; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin-top: 22px; }
  th {
    background: #0F1A2B;
    color: #fff;
    padding: 12px 10px;
    text-align: right;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.2px;
  }
  th:first-child { border-radius: 0 10px 10px 0; }
  th:last-child { border-radius: 10px 0 0 10px; }
  td { padding: 12px 10px; border-bottom: 1px solid #E3E8EF; font-size: 13px; }
  td.num { font-weight: 700; color: #0F1A2B; text-align: left; direction: ltr; }
  tr:last-child td { border-bottom: none; }
  .totals {
    margin-top: 22px;
    padding: 18px;
    background: linear-gradient(135deg, #F6F8FB 0%, #ECF1F8 100%);
    border-radius: 14px;
    border: 1px solid #E3E8EF;
  }
  .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
  .totals .row .num { font-weight: 700; direction: ltr; }
  .totals .bold {
    font-size: 20px;
    font-weight: 800;
    color: ${accent};
    border-top: 2px solid #E3E8EF;
    padding-top: 12px;
    margin-top: 8px;
  }
  .footer {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px dashed #E3E8EF;
    color: #5B6878;
    font-size: 10px;
    text-align: center;
  }
  .brand { color: ${accent}; font-weight: 800; }
  .supplier-banner {
    margin-top: 14px;
    padding: 10px 14px;
    background: #FFF6E0;
    border: 1px solid #FFD66B;
    border-radius: 10px;
    color: #7A5A00;
    font-size: 12px;
    font-weight: 700;
  }
  .photos-section {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px dashed #E3E8EF;
  }
  .photos-title {
    font-size: 14px;
    font-weight: 800;
    color: #0F1A2B;
    margin-bottom: 10px;
  }
  .photos-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .photo-item {
    width: 30%;
    max-width: 180px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #E3E8EF;
  }
  .photo-item img {
    width: 100%;
    height: 130px;
    object-fit: cover;
    display: block;
  }
  `;
}

async function photosHtmlSection(photos) {
  if (!photos || photos.length === 0) return '';
  const tiles = [];
  for (const p of photos) {
    const b64 = await readPhotoAsBase64(p.uri);
    if (!b64) continue;
    tiles.push(`<div class="photo-item"><img src="data:image/jpeg;base64,${b64}" /></div>`);
  }
  if (tiles.length === 0) return '';
  return `
    <div class="photos-section">
      <div class="photos-title">תמונות (${tiles.length})</div>
      <div class="photos-grid">${tiles.join('')}</div>
    </div>
  `;
}

export async function buildQuoteHtml(quote, user) {
  const clientName = escapeHtml(quote.clientName || 'ללא שם');
  const clientPhone = escapeHtml(quote.clientPhone || '');
  const clientAddress = escapeHtml(quote.clientAddress || '');
  const projectName = escapeHtml(quote.projectName || '');
  const dateStr = formatDate(quote.createdAt);
  const items = quote.items || [];
  const extras = quote.extras || [];
  const hasExtras = extras.length > 0;
  const originalSubtotal = quote.originalSubtotal !== undefined ? quote.originalSubtotal : items.reduce((s, it) => s + (Number(it.lineTotal) || 0), 0);
  const extrasSubtotal = quote.extrasSubtotal !== undefined ? quote.extrasSubtotal : extras.reduce((s, it) => s + (Number(it.lineTotal) || 0), 0);
  const theme = getProfessionTheme(user?.activeProfession);
  const photosHtml = await photosHtmlSection(quote.photos);

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>${sharedStyles(theme)}</style>
</head>
<body>
  <div class="header">
    <div class="header-logo"><img src="${LOGO_DATA_URI}" alt="הצעות מחיר" /></div>
    <div class="header-text">
      <h1>הצעת מחיר</h1>
      <div class="sub">${dateStr}${projectName ? ' · ' + projectName : ''}</div>
      ${businessHeader(user)}
    </div>
  </div>

  <div class="meta">
    <div class="item">לקוח: <strong>${clientName}</strong></div>
    ${clientPhone ? `<div class="item">טלפון: <strong>${clientPhone}</strong></div>` : ''}
    ${clientAddress ? `<div class="item">כתובת: <strong>${clientAddress}</strong></div>` : ''}
    <div class="item">תאריך: <strong>${dateStr}</strong></div>
    ${quote.validityDays > 0 ? `<div class="item">תקף עד: <strong>${formatDate(new Date((quote.createdAt instanceof Date ? quote.createdAt : new Date(quote.createdAt)).getTime() + quote.validityDays * 86400000))}</strong></div>` : ''}
  </div>

  ${hasExtras ? '<h3 style="margin:18px 0 6px;font-size:15px;">עבודה מקורית</h3>' : ''}
  <table>
    <thead>
      <tr>
        <th>פריט</th>
        <th>כמות</th>
        <th>מחיר ליחידה</th>
        <th>סה״כ</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((it) => `
        <tr>
          <td>${escapeHtml(it.label)}</td>
          <td class="num">${it.qty}</td>
          <td class="num">₪${fmt(it.unitPrice)}</td>
          <td class="num">₪${fmt(it.lineTotal)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${hasExtras ? `
  <h3 style="margin:24px 0 6px;font-size:15px;color:#d97706;">תוספות בשטח</h3>
  <table>
    <thead>
      <tr>
        <th>פריט</th>
        <th>כמות</th>
        <th>מחיר ליחידה</th>
        <th>סה״כ</th>
      </tr>
    </thead>
    <tbody>
      ${extras.map((it) => `
        <tr>
          <td>${escapeHtml(it.label)}</td>
          <td class="num">${it.qty}</td>
          <td class="num">₪${fmt(it.unitPrice)}</td>
          <td class="num">₪${fmt(it.lineTotal)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  <div class="totals">
    ${hasExtras ? `
      <div class="row"><span>סכום עבודה מקורית</span><span class="num">₪${fmt(originalSubtotal)}</span></div>
      <div class="row"><span>סכום תוספות בשטח</span><span class="num">₪${fmt(extrasSubtotal)}</span></div>
      <div class="row"><span>סכום ביניים</span><span class="num">₪${fmt(quote.subtotal)}</span></div>
    ` : `
      <div class="row"><span>סכום ביניים</span><span class="num">₪${fmt(quote.subtotal)}</span></div>
    `}
    ${Number(quote.discountAmount) > 0 ? `
      <div class="row"><span>הנחה${quote.discountType === 'percent' ? ` (${quote.discountValue}%)` : ''}</span><span class="num">-₪${fmt(quote.discountAmount)}</span></div>
      <div class="row"><span>אחרי הנחה</span><span class="num">₪${fmt(quote.afterDiscount)}</span></div>
    ` : ''}
    <div class="row"><span>מע״מ (18%)</span><span class="num">₪${fmt(quote.vat)}</span></div>
    <div class="row bold"><span>סה״כ לתשלום</span><span class="num">₪${fmt(quote.total)}</span></div>
  </div>

  ${photosHtml}

  ${quote.signature ? `
  <div style="margin-top:36px;padding-top:14px;border-top:1px solid #cbd5e1;">
    <div style="color:#475569;font-size:12px;margin-bottom:6px;">חתימת הלקוח:</div>
    <img src="${quote.signature}" style="max-height:120px;max-width:280px;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:6px;" />
    <div style="color:#475569;font-size:11px;margin-top:4px;">${clientName}${clientPhone ? ` · ${clientPhone}` : ''}</div>
  </div>
  ` : ''}

  <div class="footer">
    נוצר באמצעות <span class="brand">${APP_NAME}</span>
  </div>
</body>
</html>`;
}

export function buildSupplierHtml(quote, user) {
  const projectName = escapeHtml(quote.projectName || '');
  const dateStr = formatDate(quote.createdAt);
  const originalItems = quote.items || [];
  const extras = quote.extras || [];
  // Combine quantities by item id for the supplier (original + extras)
  const merged = new Map();
  for (const it of originalItems) {
    merged.set(it.id, { label: it.label, qty: Number(it.qty) || 0 });
  }
  for (const it of extras) {
    const existing = merged.get(it.id);
    if (existing) existing.qty += Number(it.qty) || 0;
    else merged.set(it.id, { label: it.label, qty: Number(it.qty) || 0 });
  }
  const items = Array.from(merged.values());
  const totalQty = items.reduce((sum, it) => sum + it.qty, 0);
  const theme = getProfessionTheme(user?.activeProfession);

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>${sharedStyles(theme)}</style>
</head>
<body>
  <div class="header">
    <div class="header-logo"><img src="${LOGO_DATA_URI}" alt="הצעות מחיר" /></div>
    <div class="header-text">
      <h1>רשימת ציוד לספק</h1>
      <div class="sub">${dateStr}${projectName ? ' · פרויקט: ' + projectName : ''}</div>
      ${businessHeader(user)}
    </div>
  </div>

  <div class="supplier-banner">
    📦 רשימה זו מיועדת לספק בלבד · ללא מחירים
  </div>

  <table>
    <thead>
      <tr>
        <th>פריט</th>
        <th>כמות</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((it) => `
        <tr>
          <td>${escapeHtml(it.label)}</td>
          <td class="num">${it.qty}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="row bold"><span>סה״כ פריטים</span><span class="num">${totalQty}</span></div>
  </div>

  <div class="footer">
    הופק באמצעות <span class="brand">${APP_NAME}</span>
  </div>
</body>
</html>`;
}

export async function exportQuoteToPdf(quote, user) {
  const html = await buildQuoteHtml(quote, user);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      dialogTitle: 'שתף את ההצעה',
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
  }
  return uri;
}

export async function exportSupplierPdf(quote, user) {
  const html = buildSupplierHtml(quote, user);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      dialogTitle: 'שתף עם הספק',
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
  }
  return uri;
}

function buildAnnualReportHtml(quotes, year, user) {
  const theme = getProfessionTheme(user?.activeProfession);
  const yearQuotes = quotes.filter((q) => {
    const d = q.createdAt instanceof Date ? q.createdAt : new Date(q.createdAt);
    return d.getFullYear() === year;
  });

  const MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const byMonth = Array.from({ length: 12 }, () => ({ quotes: [], subtotal: 0, vat: 0, total: 0, paid: 0 }));

  for (const q of yearQuotes) {
    const d = q.createdAt instanceof Date ? q.createdAt : new Date(q.createdAt);
    const m = d.getMonth();
    const sub = Number(q.subtotal) || (Number(q.total) || 0) / 1.18;
    const vat = Number(q.vat) || 0;
    const total = Number(q.total) || 0;
    const paid = q.paymentStatus === 'paid' ? total : (Number(q.paidAmount) || 0);
    byMonth[m].quotes.push(q);
    byMonth[m].subtotal += sub;
    byMonth[m].vat += vat;
    byMonth[m].total += total;
    byMonth[m].paid += paid;
  }

  const grand = byMonth.reduce((acc, m) => ({
    subtotal: acc.subtotal + m.subtotal,
    vat: acc.vat + m.vat,
    total: acc.total + m.total,
    paid: acc.paid + m.paid,
    count: acc.count + m.quotes.length,
  }), { subtotal: 0, vat: 0, total: 0, paid: 0, count: 0 });

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>${sharedStyles(theme)}</style>
</head>
<body>
  <div class="header">
    <div class="header-logo"><img src="${LOGO_DATA_URI}" alt="הצעות מחיר" /></div>
    <div class="header-text">
      <h1>דוח שנתי לרו"ח · ${year}</h1>
      <div class="sub">סיכום חודשי של כל ההצעות לשנת ${year}</div>
      ${businessHeader(user)}
    </div>
  </div>

  <h3 style="margin:24px 0 8px;">סיכום חודשי</h3>
  <table>
    <thead>
      <tr>
        <th>חודש</th>
        <th>הצעות</th>
        <th>סכום ביניים</th>
        <th>מע״מ</th>
        <th>סה"כ</th>
        <th>נכנס בפועל</th>
      </tr>
    </thead>
    <tbody>
      ${byMonth.map((m, i) => m.quotes.length === 0 ? '' : `
        <tr>
          <td>${MONTHS[i]}</td>
          <td class="num">${m.quotes.length}</td>
          <td class="num">₪${fmt(m.subtotal)}</td>
          <td class="num">₪${fmt(m.vat)}</td>
          <td class="num">₪${fmt(m.total)}</td>
          <td class="num">₪${fmt(m.paid)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>סה"כ הצעות בשנה</span><span class="num">${grand.count}</span></div>
    <div class="row"><span>סה"כ ללא מע״מ</span><span class="num">₪${fmt(grand.subtotal)}</span></div>
    <div class="row"><span>סה"כ מע״מ</span><span class="num">₪${fmt(grand.vat)}</span></div>
    <div class="row bold"><span>סה"כ עם מע״מ</span><span class="num">₪${fmt(grand.total)}</span></div>
    <div class="row bold"><span>נכנס בפועל בשנה</span><span class="num">₪${fmt(grand.paid)}</span></div>
  </div>

  <h3 style="margin:32px 0 8px;">פירוט מלא של ההצעות</h3>
  <table>
    <thead>
      <tr>
        <th>תאריך</th>
        <th>לקוח</th>
        <th>פרויקט</th>
        <th>סטטוס</th>
        <th>סה"כ</th>
        <th>שולם</th>
      </tr>
    </thead>
    <tbody>
      ${yearQuotes
        .sort((a, b) => {
          const da = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const db = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return da - db;
        })
        .map((q) => {
          const total = Number(q.total) || 0;
          const paid = q.paymentStatus === 'paid' ? total : (Number(q.paidAmount) || 0);
          const payLabel = q.paymentStatus === 'paid' ? 'שולם' : q.paymentStatus === 'partial' ? 'חלקי' : 'לא שולם';
          return `
        <tr>
          <td>${formatDate(q.createdAt)}</td>
          <td>${escapeHtml(q.clientName || '')}</td>
          <td>${escapeHtml(q.projectName || '')}</td>
          <td>${payLabel}</td>
          <td class="num">₪${fmt(total)}</td>
          <td class="num">₪${fmt(paid)}</td>
        </tr>
      `;
        }).join('')}
    </tbody>
  </table>

  <div class="footer">
    הופק באמצעות <span class="brand">${APP_NAME}</span>
  </div>
</body>
</html>`;
}

export async function exportAnnualReport(quotes, year, user) {
  const html = buildAnnualReportHtml(quotes, year, user);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      dialogTitle: `דוח שנתי ${year}`,
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
  }
  return uri;
}
