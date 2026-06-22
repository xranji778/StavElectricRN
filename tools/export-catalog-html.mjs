// One-off: read src/data/catalog.js and emit a printable + interactive HTML review sheet.
// Output goes to Desktop for local viewing, and to docs/catalog-review.html for GitHub Pages hosting.
// Usage: node tools/export-catalog-html.mjs

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const catalogPath = path.join(projectRoot, 'src', 'data', 'catalog.js');
const src = fs.readFileSync(catalogPath, 'utf8');

const STAV_WHATSAPP = '972526873674';

const categoriesBlock = src.match(/export const CATEGORIES = \[([\s\S]*?)\n\];/)[1];
const catalogBlock = src.match(/export const CATALOG = \[([\s\S]*?)\n\];/)[1];

const categories = [];
const catRe = /\{\s*id:\s*'([^']+)',\s*label:\s*'([^']+)'[^}]*?professions:\s*\[([^\]]+)\][^}]*\}/g;
let m;
while ((m = catRe.exec(categoriesBlock)) !== null) {
  const professions = m[3].split(',').map((s) => s.trim().replace(/'/g, '')).filter(Boolean);
  categories.push({ id: m[1], label: m[2], professions });
}

const items = [];
const itemRe = /\{\s*id:\s*'([^']+)',[\s\S]*?label:\s*'((?:[^'\\]|\\.)*)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?unit:\s*'([^']+)'/g;
while ((m = itemRe.exec(catalogBlock)) !== null) {
  items.push({
    id: m[1],
    label: m[2].replace(/\\'/g, "'"),
    category: m[3],
    unit: m[4],
  });
}

const itemsByCat = {};
for (const it of items) {
  if (!itemsByCat[it.category]) itemsByCat[it.category] = [];
  itemsByCat[it.category].push(it);
}

const professionLabels = {
  electrician: { he: 'חשמלאי', emoji: '⚡', color: '#1E40AF' },
  plumber: { he: 'אינסטלטור', emoji: '🔧', color: '#0E7490' },
  comms: { he: 'איש תקשורת', emoji: '📡', color: '#6D28D9' },
  contractor: { he: 'שיפוצניק', emoji: '🎨', color: '#B45309' },
  shared: { he: 'משותף לכל המקצועות', emoji: '🧰', color: '#374151' },
};

const unitLabels = { point: 'נק׳', piece: 'יח׳', meter: 'מטר' };

const catsByProf = { electrician: [], plumber: [], comms: [], contractor: [], shared: [] };
for (const c of categories) {
  if (c.professions.length >= 4) catsByProf.shared.push(c);
  else if (c.professions.length === 1) catsByProf[c.professions[0]].push(c);
  else catsByProf.shared.push(c);
}

const totalItems = items.length;
const totalCategories = categories.length;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderCategory(cat) {
  const list = itemsByCat[cat.id] || [];
  if (list.length === 0) return '';
  const rows = list.map((it) => `
    <tr data-item-id="${esc(it.id)}" data-item-label="${esc(it.label)}" data-cat-id="${esc(cat.id)}">
      <td class="check">
        <label class="opt opt-keep"><input type="radio" name="mark-${esc(it.id)}" value="keep"> שמור</label>
        <label class="opt opt-edit"><input type="radio" name="mark-${esc(it.id)}" value="edit"> תקן</label>
        <label class="opt opt-del"><input type="radio" name="mark-${esc(it.id)}" value="del"> מחק</label>
      </td>
      <td class="unit">${esc(unitLabels[it.unit] || it.unit)}</td>
      <td class="name">${esc(it.label)}</td>
      <td class="notes"><input type="text" class="note-input" placeholder="הערה / תיקון..."></td>
    </tr>
  `).join('');
  return `
    <section class="category" data-cat-id="${esc(cat.id)}" data-cat-label="${esc(cat.label)}">
      <h3>${esc(cat.label)} <span class="count">(${list.length} פריטים)</span></h3>
      <table>
        <thead>
          <tr>
            <th class="check">החלטה</th>
            <th class="unit">יח׳</th>
            <th class="name">שם הפריט</th>
            <th class="notes">הערות / תיקון</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="missing-row">
        <label>פריטים חסרים בקטגוריה זו (כתבו מופרדים בפסיק או שורה חדשה):</label>
        <textarea class="missing-input" rows="2" placeholder="לדוגמה: נקודת מאור בגינה, שקע מוגן IP67..."></textarea>
      </div>
    </section>
  `;
}

function renderProfession(profId) {
  const cats = catsByProf[profId];
  if (!cats || cats.length === 0) return '';
  const meta = professionLabels[profId];
  const itemsCount = cats.reduce((sum, c) => sum + (itemsByCat[c.id]?.length || 0), 0);
  return `
    <div class="profession" style="--prof-color: ${meta.color}">
      <h2>${meta.emoji} ${esc(meta.he)} <span class="count">(${cats.length} קטגוריות · ${itemsCount} פריטים)</span></h2>
      ${cats.map(renderCategory).join('')}
    </div>
  `;
}

const today = new Date().toLocaleDateString('he-IL');

const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>סקירת קטלוג תעריפים — הצעות מחיר</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: "Heebo", "Segoe UI", "Arial Hebrew", Tahoma, sans-serif;
      font-size: 14px;
      color: #111827;
      line-height: 1.4;
      margin: 0;
      padding: 14px;
      background: #F9FAFB;
      -webkit-text-size-adjust: 100%;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    .header {
      background: linear-gradient(135deg, #1E40AF, #2563EB);
      color: #fff;
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 14px;
    }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .subtitle { font-size: 13px; opacity: 0.9; margin: 0; }
    .reviewer-card {
      background: #fff;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .reviewer-card label { display: block; font-weight: 600; font-size: 13px; margin-bottom: 6px; color: #374151; }
    .reviewer-card input {
      width: 100%;
      padding: 10px 12px;
      border: 1.5px solid #D1D5DB;
      border-radius: 8px;
      font-size: 15px;
      font-family: inherit;
    }
    .instructions {
      background: #FEF3C7;
      border: 1px solid #FCD34D;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 14px;
      font-size: 13px;
      line-height: 1.55;
    }
    .instructions strong { color: #92400E; }
    .instructions ul { margin: 6px 0 0; padding-right: 18px; }
    .summary-bar {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .summary-bar div {
      background: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: #374151;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .summary-bar strong { color: #111827; font-size: 14px; }
    .profession {
      background: #fff;
      border-radius: 14px;
      padding: 14px 14px 18px;
      margin-bottom: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .profession h2 {
      font-size: 17px;
      color: var(--prof-color, #111827);
      border-bottom: 2px solid var(--prof-color, #111827);
      padding: 4px 0 8px;
      margin: 0 0 8px;
    }
    .category { margin: 10px 0 6px; }
    .category h3 {
      font-size: 14px;
      margin: 12px 0 4px;
      color: #1F2937;
      background: #F9FAFB;
      padding: 7px 10px;
      border-radius: 6px;
      border-right: 4px solid var(--prof-color, #6B7280);
    }
    .count { color: #6B7280; font-weight: 400; font-size: 12px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      background: #F3F4F6;
      text-align: right;
      padding: 6px 8px;
      font-weight: 700;
      border-bottom: 1px solid #D1D5DB;
      font-size: 12px;
      color: #4B5563;
    }
    td {
      padding: 8px 8px;
      border-bottom: 1px solid #F1F5F9;
      vertical-align: middle;
    }
    tr:has(input[value="del"]:checked) td.name { text-decoration: line-through; color: #9CA3AF; }
    th.check, td.check { width: 36%; min-width: 220px; }
    th.unit, td.unit { width: 8%; text-align: center; color: #6B7280; }
    th.name, td.name { width: 26%; font-weight: 500; }
    th.notes, td.notes { width: 30%; }
    .note-input {
      width: 100%;
      padding: 5px 7px;
      border: 1px solid #E5E7EB;
      border-radius: 5px;
      font-family: inherit;
      font-size: 12.5px;
      background: #FAFBFC;
    }
    .note-input:focus { background: #fff; outline: 2px solid #2563EB; border-color: #2563EB; }
    .opt {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 9px;
      margin: 2px 2px 2px 0;
      font-size: 13px;
      color: #374151;
      cursor: pointer;
      border-radius: 8px;
      border: 1.5px solid #E5E7EB;
      background: #fff;
      user-select: none;
      transition: all 0.15s;
    }
    .opt input {
      width: 16px;
      height: 16px;
      margin: 0;
      cursor: pointer;
    }
    .opt:active { transform: scale(0.97); }
    .opt-keep input { accent-color: #16A34A; }
    .opt-edit input { accent-color: #D97706; }
    .opt-del input { accent-color: #DC2626; }
    .opt:has(input:checked) { font-weight: 700; }
    .opt-keep:has(input:checked) { background: #DCFCE7; border-color: #16A34A; color: #166534; }
    .opt-edit:has(input:checked) { background: #FEF3C7; border-color: #D97706; color: #92400E; }
    .opt-del:has(input:checked) { background: #FEE2E2; border-color: #DC2626; color: #991B1B; }
    .missing-row {
      margin-top: 6px;
      padding: 8px 10px;
      background: #F0F9FF;
      border-radius: 7px;
      border: 1px dashed #93C5FD;
    }
    .missing-row label { display: block; font-size: 12px; color: #1E40AF; margin-bottom: 4px; font-weight: 600; }
    .missing-input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #BFDBFE;
      border-radius: 5px;
      font-family: inherit;
      font-size: 13px;
      resize: vertical;
      background: #fff;
    }
    .submit-bar {
      position: sticky;
      bottom: 0;
      background: linear-gradient(180deg, rgba(249,250,251,0.6), #F9FAFB 30%);
      padding: 14px 0;
      margin-top: 18px;
      z-index: 10;
    }
    .submit-btn {
      display: block;
      width: 100%;
      padding: 16px;
      font-size: 17px;
      font-weight: 700;
      color: #fff;
      background: linear-gradient(135deg, #16A34A, #15803D);
      border: none;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(22,163,74,0.35);
      font-family: inherit;
    }
    .submit-btn:hover { transform: translateY(-1px); }
    .submit-btn:active { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .submit-hint { text-align: center; font-size: 12px; color: #6B7280; margin-top: 8px; }
    .submit-stats {
      background: #fff;
      border-radius: 10px;
      padding: 10px 14px;
      margin-bottom: 8px;
      display: flex;
      gap: 14px;
      font-size: 13px;
      justify-content: center;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .submit-stats span { display: inline-flex; align-items: center; gap: 4px; }
    .stat-edit { color: #D97706; }
    .stat-del { color: #DC2626; }
    .stat-keep { color: #16A34A; }
    .stat-missing { color: #1E40AF; }

    /* Mobile tweaks */
    @media (max-width: 720px) {
      body { padding: 8px; font-size: 14px; }
      .header { padding: 14px; }
      h1 { font-size: 19px; }
      table, thead, tbody, th, td, tr { display: block; }
      thead { display: none; }
      tr {
        background: #fff;
        border: 1px solid #E5E7EB;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 8px;
      }
      td { padding: 4px 0; border: none; }
      td.name { font-size: 15px; font-weight: 600; color: #111827; }
      td.name::before { content: "📦 "; }
      td.unit { color: #6B7280; font-size: 12px; text-align: right; }
      td.unit::before { content: "יחידה: "; }
      td.check { width: 100%; min-width: 0; }
      td.notes { width: 100%; padding-top: 6px; }
      .opt { flex: 1; justify-content: center; padding: 8px; }
      .note-input { font-size: 14px; padding: 8px; }
      .missing-input { font-size: 14px; padding: 8px; }
      tr:has(input[value="del"]:checked) { background: #FEF2F2; border-color: #FCA5A5; }
      tr:has(input[value="edit"]:checked) { background: #FFFBEB; border-color: #FCD34D; }
      tr:has(input[value="keep"]:checked) { background: #F0FDF4; border-color: #86EFAC; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 סקירת קטלוג תעריפים</h1>
      <p class="subtitle">אפליקציית "הצעות מחיר" · עודכן ${today}</p>
    </div>

    <div class="reviewer-card">
      <label for="reviewerName">השם שלך (כדי שסתיו יידע מי שלח):</label>
      <input type="text" id="reviewerName" placeholder="לדוגמה: דני כהן (חשמלאי)" autocomplete="name">
    </div>

    <div class="instructions">
      <strong>איך זה עובד:</strong>
      <ul>
        <li>לכל פריט תבחר אפשרות אחת: <strong style="color:#16A34A">שמור</strong> · <strong style="color:#D97706">תקן</strong> · <strong style="color:#DC2626">מחק</strong></li>
        <li>אם בחרת "תקן" — כתוב בעמודת ההערות איך לתקן (שם חדש, יחידה חדשה, וכו')</li>
        <li>אם חסר פריט שאתה חושב שצריך להיות — כתוב אותו בתיבת "פריטים חסרים" של הקטגוריה הנכונה</li>
        <li>אין צורך לתת מחירים — מחירים נקבעים אצל כל בעל מקצוע באפליקציה. רק להחליט אילו פריטים צריכים להיות ברשימה.</li>
        <li>בסוף — לחץ על הכפתור הירוק למטה לשליחת הסיכום בוואטסאפ.</li>
      </ul>
    </div>

    <div class="summary-bar">
      <div><strong>${totalItems}</strong> פריטים סה"כ</div>
      <div><strong>${totalCategories}</strong> קטגוריות</div>
      <div><strong>4</strong> מקצועות</div>
    </div>

    ${renderProfession('electrician')}
    ${renderProfession('plumber')}
    ${renderProfession('comms')}
    ${renderProfession('contractor')}
    ${renderProfession('shared')}

    <div class="submit-bar">
      <div class="submit-stats" id="submitStats">
        <span class="stat-keep">✅ <strong id="countKeep">0</strong> לשמור</span>
        <span class="stat-edit">📝 <strong id="countEdit">0</strong> לתקן</span>
        <span class="stat-del">🗑️ <strong id="countDel">0</strong> למחיקה</span>
        <span class="stat-missing">➕ <strong id="countMissing">0</strong> חסרים</span>
      </div>
      <button class="submit-btn" id="submitBtn" onclick="submitToWhatsApp()">
        📲 שלח סיכום בוואטסאפ לסתיו
      </button>
      <p class="submit-hint">הכפתור יפתח וואטסאפ עם הודעה מוכנה. רק תלחץ "שליחה".</p>
    </div>
  </div>

  <script>
    const STAV_NUMBER = "${STAV_WHATSAPP}";

    function getCatLabel(catId) {
      const el = document.querySelector('section.category[data-cat-id="' + catId + '"]');
      return el ? el.getAttribute('data-cat-label') : catId;
    }

    function updateStats() {
      let keep = 0, edit = 0, del = 0, missing = 0;
      document.querySelectorAll('tr[data-item-id]').forEach((row) => {
        const checked = row.querySelector('input[type="radio"]:checked');
        if (!checked) return;
        if (checked.value === 'keep') keep++;
        else if (checked.value === 'edit') edit++;
        else if (checked.value === 'del') del++;
      });
      document.querySelectorAll('.missing-input').forEach((ta) => {
        const v = ta.value.trim();
        if (v) {
          missing += v.split(/[,\\n]/).map((s) => s.trim()).filter(Boolean).length;
        }
      });
      document.getElementById('countKeep').textContent = keep;
      document.getElementById('countEdit').textContent = edit;
      document.getElementById('countDel').textContent = del;
      document.getElementById('countMissing').textContent = missing;
    }

    document.addEventListener('change', updateStats);
    document.addEventListener('input', updateStats);

    function submitToWhatsApp() {
      const name = document.getElementById('reviewerName').value.trim();
      if (!name) {
        alert('אנא הזן את שמך בראש הדף לפני השליחה');
        document.getElementById('reviewerName').focus();
        return;
      }

      const editsByCat = {};
      const delsByCat = {};
      let keepCount = 0;

      document.querySelectorAll('tr[data-item-id]').forEach((row) => {
        const checked = row.querySelector('input[type="radio"]:checked');
        if (!checked) return;
        const itemLabel = row.getAttribute('data-item-label');
        const catId = row.getAttribute('data-cat-id');
        const catLabel = getCatLabel(catId);
        const noteInput = row.querySelector('.note-input');
        const note = noteInput ? noteInput.value.trim() : '';

        if (checked.value === 'edit') {
          if (!editsByCat[catLabel]) editsByCat[catLabel] = [];
          editsByCat[catLabel].push(note ? itemLabel + ' → ' + note : itemLabel + ' (ללא פירוט)');
        } else if (checked.value === 'del') {
          if (!delsByCat[catLabel]) delsByCat[catLabel] = [];
          delsByCat[catLabel].push(note ? itemLabel + ' (' + note + ')' : itemLabel);
        } else if (checked.value === 'keep') {
          keepCount++;
        }
      });

      const missingByCat = {};
      document.querySelectorAll('section.category').forEach((sec) => {
        const ta = sec.querySelector('.missing-input');
        if (!ta) return;
        const v = ta.value.trim();
        if (!v) return;
        const catLabel = sec.getAttribute('data-cat-label');
        missingByCat[catLabel] = v.split(/[,\\n]/).map((s) => s.trim()).filter(Boolean);
      });

      const lines = [];
      lines.push('📋 סקירת קטלוג מאת ' + name);
      lines.push('תאריך: ' + new Date().toLocaleDateString('he-IL'));
      lines.push('');

      const editEntries = Object.entries(editsByCat);
      if (editEntries.length > 0) {
        const total = editEntries.reduce((s, [, arr]) => s + arr.length, 0);
        lines.push('📝 לתיקון (' + total + ' פריטים):');
        for (const [cat, arr] of editEntries) {
          lines.push('• ' + cat + ':');
          for (const item of arr) lines.push('   – ' + item);
        }
        lines.push('');
      }

      const delEntries = Object.entries(delsByCat);
      if (delEntries.length > 0) {
        const total = delEntries.reduce((s, [, arr]) => s + arr.length, 0);
        lines.push('🗑️ למחיקה (' + total + ' פריטים):');
        for (const [cat, arr] of delEntries) {
          lines.push('• ' + cat + ':');
          for (const item of arr) lines.push('   – ' + item);
        }
        lines.push('');
      }

      const missingEntries = Object.entries(missingByCat);
      if (missingEntries.length > 0) {
        const total = missingEntries.reduce((s, [, arr]) => s + arr.length, 0);
        lines.push('➕ פריטים חסרים שצריך להוסיף (' + total + '):');
        for (const [cat, arr] of missingEntries) {
          lines.push('• ' + cat + ':');
          for (const item of arr) lines.push('   – ' + item);
        }
        lines.push('');
      }

      if (keepCount > 0) {
        lines.push('✅ לשמור כמו שזה: ' + keepCount + ' פריטים');
        lines.push('');
      }

      const totalActioned = Object.values(editsByCat).reduce((s, a) => s + a.length, 0)
                          + Object.values(delsByCat).reduce((s, a) => s + a.length, 0);
      if (totalActioned === 0 && missingEntries.length === 0) {
        if (!confirm('לא סימנת אף פריט לתיקון או מחיקה ולא הוספת פריטים חסרים. לשלוח בכל זאת?')) return;
      }

      const message = lines.join('\\n');
      const url = 'https://wa.me/' + STAV_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank');
    }

    updateStats();
  </script>
</body>
</html>
`;

const desktopOut = path.join(process.env.USERPROFILE || process.env.HOME || '.', 'Desktop', 'catalog-review.html');
const docsDir = path.join(projectRoot, 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
const docsOut = path.join(docsDir, 'catalog-review.html');
const docsIndex = path.join(docsDir, 'index.html');

fs.writeFileSync(desktopOut, html, 'utf8');
fs.writeFileSync(docsOut, html, 'utf8');
fs.writeFileSync(docsIndex, html, 'utf8');

console.log(`✅ Wrote ${desktopOut}`);
console.log(`✅ Wrote ${docsOut}`);
console.log(`✅ Wrote ${docsIndex} (so / and /catalog-review both work)`);
console.log(`   ${totalItems} items across ${totalCategories} categories.`);
