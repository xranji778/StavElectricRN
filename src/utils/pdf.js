import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

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

export function buildQuoteHtml(quote, user) {
  const clientName = escapeHtml(quote.clientName || 'ללא שם');
  const dateStr = formatDate(quote.createdAt);
  const items = quote.items || [];

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>
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
    background: linear-gradient(135deg, #1E5BFF 0%, #0EA5C7 100%);
    color: white;
    padding: 26px 28px;
    border-radius: 18px;
    position: relative;
    overflow: hidden;
  }
  .header::after {
    content: '⚡';
    position: absolute;
    left: 24px;
    top: 16px;
    font-size: 64px;
    opacity: 0.18;
  }
  .header h1 { margin: 0; font-size: 26px; font-weight: 800; }
  .header .sub { opacity: 0.92; font-size: 14px; margin-top: 6px; font-weight: 500; }
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
    color: #1E5BFF;
    border-top: 2px solid #E3E8EF;
    padding-top: 12px;
    margin-top: 8px;
  }
  .footer {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px dashed #E3E8EF;
    color: #5B6878;
    font-size: 11px;
    text-align: center;
  }
  .brand { color: #1E5BFF; font-weight: 800; }
</style>
</head>
<body>
  <div class="header">
    <h1>הצעת מחיר</h1>
    <div class="sub">${escapeHtml(user?.displayName || '')} · StavElectric</div>
  </div>

  <div class="meta">
    <div class="item">לקוח: <strong>${clientName}</strong></div>
    <div class="item">תאריך: <strong>${dateStr}</strong></div>
  </div>

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

  <div class="totals">
    <div class="row"><span>סכום ביניים</span><span class="num">₪${fmt(quote.subtotal)}</span></div>
    <div class="row"><span>מע״מ (18%)</span><span class="num">₪${fmt(quote.vat)}</span></div>
    <div class="row bold"><span>סה״כ לתשלום</span><span class="num">₪${fmt(quote.total)}</span></div>
  </div>

  <div class="footer">
    ההצעה נוצרה ב-<span class="brand">StavElectric</span> · ${dateStr}
  </div>
</body>
</html>`;
}

export async function exportQuoteToPdf(quote, user) {
  const html = buildQuoteHtml(quote, user);
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
