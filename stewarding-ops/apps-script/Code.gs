/**
 * ════════════════════════════════════════════════════════════════════
 *  Stewarding Ops Control Center — Google Apps Script API layer
 * ════════════════════════════════════════════════════════════════════
 *  SETUP
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Paste this file, set SECRET below to a long random string
 *  3. Deploy → New deployment → Web app
 *       Execute as : Me
 *       Who has access : Anyone
 *  4. Copy the /exec URL into APPS_SCRIPT_URL on Vercel,
 *     and the same SECRET into APPS_SCRIPT_SECRET.
 *
 *  GET  ?secret=...                 → all tabs as JSON { "Tab Name": [ {col:val} ] }
 *  GET  ?secret=...&action=health   → quick pipeline check (tab presence + row counts)
 *  POST { secret, tab, row }        → appends a row mapped by header names
 *
 *  SECRET below MUST equal APPS_SCRIPT_SECRET in your Vercel env / .env.local.
 */

const SECRET = "stw-ops-7Kq2VtX9mLp4hRf8sBnY6wD3jUc1Ae5Gx0NoTbQiHl";

const TABS = [
  "Cambro Water Dispenser Deep Clean",
  "Cambro Black Box Deep Clean",
  "Machine Deep Clean",
  "5 Minute QC Kitchen Utensils",
  "5 Minute QC Pest Control",
  "Rubbish Disposal Timing",
  "Red Tag Item Management",
  "Defect Log",
  "Rework Tracker"
];

function doGet(e) {
  if (!e.parameter || e.parameter.secret !== SECRET) return json_({ error: "unauthorized" }, 401);
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (e.parameter.action === "health") {
    const tabs = {};
    TABS.forEach(function (name) {
      const sh = ss.getSheetByName(name);
      tabs[name] = sh ? Math.max(0, sh.getLastRow() - 1) : null; // data rows, or null if missing
    });
    return json_({ ok: true, mode: "health", spreadsheet: ss.getName(), tabs: tabs }, 200);
  }

  const out = {};
  TABS.forEach(function (name) {
    const sh = ss.getSheetByName(name);
    if (!sh) { out[name] = []; return; }
    const values = sh.getDataRange().getValues();
    if (values.length < 2) { out[name] = []; return; }
    const headers = values[0].map(String);
    out[name] = values.slice(1).map(function (r) {
      const o = {};
      headers.forEach(function (h, i) {
        let v = r[i];
        if (v instanceof Date) v = Utilities.formatDate(v, "Asia/Singapore", "yyyy-MM-dd HH:mm");
        o[h] = v === undefined || v === null ? "" : v;
      });
      return o;
    });
  });
  return json_(out, 200);
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ error: "bad json" }, 400); }
  if (body.secret !== SECRET) return json_({ error: "unauthorized" }, 401);
  if (TABS.indexOf(body.tab) === -1) return json_({ error: "unknown tab" }, 400);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(body.tab);
  if (!sh) return json_({ error: "tab missing in sheet" }, 400);

  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  const row = headers.map(function (h) { return body.row && body.row[h] !== undefined ? body.row[h] : ""; });
  sh.appendRow(row);
  return json_({ ok: true }, 200);
}

function json_(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
