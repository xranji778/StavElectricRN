// One-off: read src/data/catalog.js and emit a landing page + one review page per profession.
// Electrician section is excluded — already reviewed by טובי.
// Output goes to docs/ for GitHub Pages hosting (index.html = picker, review-<prof>.html = per-trade review).
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

// Electrician already reviewed — not offered in the picker anymore.
const PROFESSIONS = ['plumber', 'comms', 'contractor'];

const professionLabels = {
  plumber: { he: 'אינסטלטור', emoji: '🔧', color: '#0E7490', file: 'review-plumber.html' },
  comms: { he: 'איש תקשורת', emoji: '📡', color: '#6D28D9', file: 'review-comms.html' },
  contractor: { he: 'קבלן / שיפוצניק', emoji: '🎨', color: '#B45309', file: 'review-contractor.html' },
};

const unitLabels = { point: 'נק׳', piece: 'יח׳', meter: 'מטר' };

// Only categories exclusive to that one profession — shared/electrician items are left out.
const catsByProf = { plumber: [], comms: [], contractor: [] };
for (const c of categories) {
  if (c.professions.length === 1 && catsByProf[c.professions[0]]) {
    catsByProf[c.professions[0]].push(c);
  }
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderCategory(cat) {
  const list = itemsByCat[cat.id] || [];
  if (list.length === 0) return '';
  const rows = list.map((it) => `
    <tr data-item-id="${esc(it.id)}" data-item-label="${esc(it.label)}" data-cat-id="${esc(cat.id)}" data-mark="">
      <td class="check">
        <button type="button" class="opt opt-edit" data-mark-btn="edit">📝 תקן</button>
        <button type="button" class="opt opt-del" data-mark-btn="del">🗑️ מחק</button>
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
            <th class="check">יש בעיה?</th>
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

const SHARED_STYLE = `
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
      background: linear-gradient(135deg, var(--prof-color, #1E40AF), #2563EB);
      color: #fff;
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 14px;
    }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .subtitle { font-size: 13px; opacity: 0.9; margin: 0; }
    .back-link {
      display: inline-block;
      margin-bottom: 14px;
      color: #374151;
      font-size: 13px;
      text-decoration: none;
      background: #fff;
      padding: 8px 14px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
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
    tr[data-mark="del"] td.name { text-decoration: line-through; color: #9CA3AF; }
    tr[data-mark="del"] { background: #FEF2F2; }
    tr[data-mark="edit"] { background: #FFFBEB; }
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
      padding: 7px 12px;
      margin: 2px 2px 2px 0;
      font-size: 13px;
      font-family: inherit;
      color: #374151;
      cursor: pointer;
      border-radius: 8px;
      border: 1.5px solid #E5E7EB;
      background: #fff;
      user-select: none;
      transition: all 0.15s;
    }
    .opt:active { transform: scale(0.97); }
    .opt.active { font-weight: 700; }
    .opt-edit.active { background: #FEF3C7; border-color: #D97706; color: #92400E; }
    .opt-del.active { background: #FEE2E2; border-color: #DC2626; color: #991B1B; }
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
      .opt { flex: 1; justify-content: center; padding: 10px; font-size: 14px; }
      .note-input { font-size: 14px; padding: 8px; }
      .missing-input { font-size: 14px; padding: 8px; }
      tr[data-mark="del"] { border-color: #FCA5A5; }
      tr[data-mark="edit"] { border-color: #FCD34D; }
    }
`;

function reviewScript(profLabel) {
  return `
  <script>
    const STAV_NUMBER = "${STAV_WHATSAPP}";
    const PROF_LABEL = "${profLabel}";

    function getCatLabel(catId) {
      const el = document.querySelector('section.category[data-cat-id="' + catId + '"]');
      return el ? el.getAttribute('data-cat-label') : catId;
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-mark-btn]');
      if (!btn) return;
      const row = btn.closest('tr[data-item-id]');
      if (!row) return;
      const clicked = btn.getAttribute('data-mark-btn');
      const current = row.getAttribute('data-mark');
      const next = current === clicked ? '' : clicked;
      row.setAttribute('data-mark', next);
      row.querySelectorAll('[data-mark-btn]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-mark-btn') === next);
      });
      updateStats();
    });

    function updateStats() {
      let total = 0, edit = 0, del = 0, missing = 0;
      document.querySelectorAll('tr[data-item-id]').forEach((row) => {
        total++;
        const mark = row.getAttribute('data-mark');
        if (mark === 'edit') edit++;
        else if (mark === 'del') del++;
      });
      document.querySelectorAll('.missing-input').forEach((ta) => {
        const v = ta.value.trim();
        if (v) {
          missing += v.split(/[,\\n]/).map((s) => s.trim()).filter(Boolean).length;
        }
      });
      document.getElementById('countKeep').textContent = total - edit - del;
      document.getElementById('countEdit').textContent = edit;
      document.getElementById('countDel').textContent = del;
      document.getElementById('countMissing').textContent = missing;
    }

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
        const mark = row.getAttribute('data-mark');
        const itemLabel = row.getAttribute('data-item-label');
        const catId = row.getAttribute('data-cat-id');
        const catLabel = getCatLabel(catId);
        const noteInput = row.querySelector('.note-input');
        const note = noteInput ? noteInput.value.trim() : '';

        if (mark === 'edit') {
          if (!editsByCat[catLabel]) editsByCat[catLabel] = [];
          editsByCat[catLabel].push(note ? itemLabel + ' → ' + note : itemLabel + ' (ללא פירוט)');
        } else if (mark === 'del') {
          if (!delsByCat[catLabel]) delsByCat[catLabel] = [];
          delsByCat[catLabel].push(note ? itemLabel + ' (' + note + ')' : itemLabel);
        } else {
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
      lines.push('📋 סקירת קטלוג (' + PROF_LABEL + ') מאת ' + name);
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
`;
}

function renderProfessionPage(profId) {
  const meta = professionLabels[profId];
  const cats = catsByProf[profId];
  const itemsCount = cats.reduce((sum, c) => sum + (itemsByCat[c.id]?.length || 0), 0);
  const today = new Date().toLocaleDateString('he-IL');

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>סקירת קטלוג — ${esc(meta.he)} — מחירן</title>
  <style>${SHARED_STYLE}</style>
</head>
<body style="--prof-color: ${meta.color}">
  <div class="container">
    <a class="back-link" href="index.html">→ חזרה לבחירת מקצוע</a>

    <div class="header">
      <h1>${meta.emoji} סקירת קטלוג — ${esc(meta.he)}</h1>
      <p class="subtitle">אפליקציית "מחירן" · עודכן ${today}</p>
    </div>

    <div class="reviewer-card">
      <label for="reviewerName">השם שלך (כדי שסתיו יידע מי שלח):</label>
      <input type="text" id="reviewerName" placeholder="לדוגמה: דני כהן" autocomplete="name">
    </div>

    <div class="instructions">
      <strong>איך זה עובד — פשוט:</strong>
      <ul>
        <li>כל פריט כבר נחשב <strong style="color:#16A34A">תקין</strong> — אין צורך לגעת בו. תסמן רק פריטים שבאמת <strong>יש איתם בעיה</strong>.</li>
        <li>פריט לא טוב? לחץ <strong style="color:#D97706">📝 תקן</strong> וכתוב בעמודת ההערות מה לתקן, או <strong style="color:#DC2626">🗑️ מחק</strong> אם הוא מיותר.</li>
        <li>חסר פריט? כתוב אותו בתיבת "פריטים חסרים" בתחתית הקטגוריה המתאימה.</li>
        <li>אין צורך לתת מחירים — רק להחליט אילו פריטים צריכים להיות ברשימה.</li>
        <li>בסוף — לחץ על הכפתור הירוק למטה לשליחת הסיכום בוואטסאפ.</li>
      </ul>
    </div>

    <div class="summary-bar">
      <div><strong>${itemsCount}</strong> פריטים סה"כ</div>
      <div><strong>${cats.length}</strong> קטגוריות</div>
    </div>

    ${cats.map(renderCategory).join('')}

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
${reviewScript(meta.he)}
</body>
</html>
`;
}

function renderIndexPage() {
  const today = new Date().toLocaleDateString('he-IL');
  const cards = PROFESSIONS.map((profId) => {
    const meta = professionLabels[profId];
    const cats = catsByProf[profId];
    const itemsCount = cats.reduce((sum, c) => sum + (itemsByCat[c.id]?.length || 0), 0);
    return `
      <a class="prof-card" href="${meta.file}" style="--prof-color: ${meta.color}">
        <div class="prof-emoji">${meta.emoji}</div>
        <div class="prof-name">${esc(meta.he)}</div>
        <div class="prof-count">${cats.length} קטגוריות · ${itemsCount} פריטים</div>
      </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>סקירת קטלוג תעריפים — מחירן</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: "Heebo", "Segoe UI", "Arial Hebrew", Tahoma, sans-serif;
      color: #111827;
      margin: 0;
      padding: 14px;
      background: #F9FAFB;
      -webkit-text-size-adjust: 100%;
    }
    .container { max-width: 640px; margin: 40px auto; }
    .header {
      background: linear-gradient(135deg, #1E40AF, #2563EB);
      color: #fff;
      border-radius: 14px;
      padding: 22px 20px;
      margin-bottom: 20px;
      text-align: center;
    }
    h1 { font-size: 22px; margin: 0 0 6px; }
    .subtitle { font-size: 13px; opacity: 0.9; margin: 0; }
    .intro {
      background: #fff;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 18px;
      font-size: 14px;
      line-height: 1.6;
      color: #374151;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .prof-grid { display: flex; flex-direction: column; gap: 12px; }
    .prof-card {
      display: block;
      background: #fff;
      border-radius: 14px;
      padding: 18px 20px;
      text-decoration: none;
      color: #111827;
      border-right: 6px solid var(--prof-color, #6B7280);
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      transition: transform 0.1s;
    }
    .prof-card:active { transform: scale(0.98); }
    .prof-emoji { font-size: 28px; margin-bottom: 4px; }
    .prof-name { font-size: 18px; font-weight: 700; color: var(--prof-color, #111827); }
    .prof-count { font-size: 13px; color: #6B7280; margin-top: 2px; }
    .footer-links { text-align: center; margin-top: 22px; font-size: 12px; }
    .footer-links a { color: #6B7280; text-decoration: none; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 סקירת קטלוג תעריפים</h1>
      <p class="subtitle">אפליקציית "מחירן" · עודכן ${today}</p>
    </div>
    <div class="intro">
      תבחר את המקצוע שלך למטה, ותעבור רק על הפריטים ששייכים אליך — לא על כל הקטלוג.
    </div>
    <div class="prof-grid">
      ${cards}
    </div>
    <div class="footer-links">
      <a href="privacy.html">מדיניות פרטיות</a> · <a href="terms.html">תנאי שימוש</a>
    </div>
  </div>
</body>
</html>
`;
}

const docsDir = path.join(projectRoot, 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

fs.writeFileSync(path.join(docsDir, 'index.html'), renderIndexPage(), 'utf8');
console.log(`✅ Wrote docs/index.html (profession picker)`);

for (const profId of PROFESSIONS) {
  const meta = professionLabels[profId];
  fs.writeFileSync(path.join(docsDir, meta.file), renderProfessionPage(profId), 'utf8');
  console.log(`✅ Wrote docs/${meta.file} (${meta.he}: ${catsByProf[profId].length} categories, ${catsByProf[profId].reduce((s, c) => s + (itemsByCat[c.id]?.length || 0), 0)} items)`);
}

// Old combined page is replaced by the picker flow — remove it so no stale link stays live.
const oldCombined = path.join(docsDir, 'catalog-review.html');
if (fs.existsSync(oldCombined)) {
  fs.unlinkSync(oldCombined);
  console.log(`🗑️  Removed stale docs/catalog-review.html`);
}
