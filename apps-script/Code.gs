/* Student 2 practice record: receives rows from the practice pages (site/assets/sheetlog.js) and writes them to this Sheet,
   "Student 2 – Maths progress record". Modelled on Student 1's Code.gs (9 Nov 2026), without its status rules, teacher
   decisions and paper photos, which can be added when they are needed.
   Install: in the Sheet, Extensions > Apps Script, paste this file, Save, then
   Deploy > New deployment > Web app, Execute as: Me, Who has access: Anyone > Deploy.
   Copy the web app URL (ends in /exec) into site/assets/sheet-config.js.
   Update: paste the new file, Save, then Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy.
   That keeps the same URL; a New deployment would make a new one. */

const TOKEN = 's2-d16c8b2adbb8';   // must match token in site/assets/sheet-config.js
const ACTIVITY = 'Activity', NOW = 'Now';
const ACTIVITY_COLS = ['ts','lesson','session','event','set','role','eq','x','answer','right','own','support','checks','device','uid','detail'];
const NOW_COLS = ['ts','lesson','set','ki','teacher','status','stage','own_right','items','uid'];

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return reply({ ok: false, error: 'bad json' }); }
  if (body.token !== TOKEN || !Array.isArray(body.rows)) return reply({ ok: false, error: 'refused' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const act = ss.getSheetByName(ACTIVITY), now = ss.getSheetByName(NOW);
    const seen = new Set(recentUids(act, ACTIVITY_COLS.indexOf('uid') + 1));
    const rows = [];
    let states = 0;
    body.rows.forEach(r => {
      if (!r || !r.uid || seen.has(r.uid)) return;
      seen.add(r.uid);
      const ts = r.ts ? new Date(r.ts) : new Date();
      if (r.kind === 'state') { upsertNow(now, NOW_COLS.map(c => c === 'ts' ? ts : clean(r[c]))); states++; }
      else rows.push(ACTIVITY_COLS.map(c => c === 'ts' ? ts : clean(r[c])));
    });
    if (rows.length) act.getRange(act.getLastRow() + 1, 1, rows.length, ACTIVITY_COLS.length).setValues(rows);
    /* The Signals tab (Signals.gs) is rewritten from Activity. A failure there must never lose her answers. */
    let signals = 'not updated';
    if (rows.length) { try { updateSignals(); signals = 'updated'; } catch (err) { signals = 'failed: ' + err; } }
    return reply({ ok: true, activity: rows.length, states: states, signals: signals });
  } finally {
    lock.releaseLock();
  }
}

/* Opening the web app URL in a browser answers the Sheet's name: a quick check that it is reachable. */
function doGet() { return reply({ ok: true, sheet: SpreadsheetApp.getActiveSpreadsheet().getName() }); }

/* Now keeps one row per lesson + practice set: its latest state. */
function upsertNow(sheet, row) {
  const last = sheet.getLastRow();
  if (last > 1) {
    const keys = sheet.getRange(2, 1, last - 1, 3).getValues();
    for (let i = 0; i < keys.length; i++) {
      if (keys[i][1] === row[1] && String(keys[i][2]) === String(row[2])) { sheet.getRange(i + 2, 1, 1, row.length).setValues([row]); return; }
    }
  }
  sheet.getRange(last + 1, 1, 1, row.length).setValues([row]);
}

function recentUids(sheet, uidCol) {
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const n = Math.min(1500, last - 1);
  return sheet.getRange(last - n + 1, uidCol, n, 1).getValues().map(v => v[0]).filter(String);
}

/* Text that starts with = + - @ would be read as a formula; keep it as text. */
function clean(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function reply(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
