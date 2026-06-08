/**
 * ════════════════════════════════════════════════════════════════════
 *  Stewarding Ops Control Center — Sheet provisioner (DATABASE layer)
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT THIS DOES
 *  Creates every tab the dashboard reads, with the EXACT header row, in one
 *  click. Idempotent — existing tabs are left untouched, so it is safe to
 *  re-run and safe to run AFTER createForms() (it will only add the tabs the
 *  forms did not create, i.e. Defect Log + Rework Tracker).
 *
 *  HOW TO RUN
 *  1. Google Sheet → Extensions → Apps Script.
 *  2. Add this file, then run  setupSheet().
 *
 *  TWO SUPPORTED FLOWS
 *  A) Field forms (recommended):  createForms()  →  setupSheet()
 *     Forms own the 7 operational tabs; setupSheet adds the 2 management tabs.
 *  B) Dashboard-only (no Google Forms):  setupSheet()
 *     Creates all 9 tabs; data is entered via the dashboard's Add Record /
 *     Log Defect / Log Rework dialogs.
 *
 *  Header names are the single source of truth shared with:
 *     lib/sheets.ts · lib/demo-data.ts · apps-script/Code.gs
 * ════════════════════════════════════════════════════════════════════
 */

var TAB_HEADERS = {
  "Cambro Water Dispenser Deep Clean": ["Timestamp", "Dispenser ID", "Operator Name", "Cleaning Status", "Remarks"],
  "Cambro Black Box Deep Clean":       ["Timestamp", "Cambro ID", "Operator Name", "Cleaning Status", "Remarks"],
  "Machine Deep Clean":                ["Timestamp", "Machine ID", "Machine Name", "Operator Name", "Cleaning Status", "Remarks"],
  "5 Minute QC Kitchen Utensils":      ["Timestamp", "Area", "Inspector Name", "Pass/Fail", "Findings", "Corrective Action"],
  "5 Minute QC Pest Control":          ["Timestamp", "Area", "Inspector Name", "Pass/Fail", "Findings", "Corrective Action"],
  "Rubbish Disposal Timing":           ["Timestamp", "Area", "Disposal Time", "Operator Name", "Status", "Remarks"],
  "Red Tag Item Management":           ["Timestamp", "Item ID", "Item Name", "Reason", "Reported By", "Status", "Action Taken"],
  "Defect Log":                        ["Month", "Severity", "Reported By", "Description", "Action Taken", "Preventive Action", "Status"],
  "Rework Tracker":                    ["Month", "Total Items", "Rework Items", "Trigger Area", "Rework Case", "Action Taken", "Prevent Action"]
};

/** The 2 management tabs that field forms never create. */
var MANAGEMENT_TABS = ["Defect Log", "Rework Tracker"];

/**
 * MAIN ENTRY POINT — provisions every missing tab with its header row.
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Run this from the Apps Script bound to your Google Sheet.");

  var created = [], skipped = [];
  Object.keys(TAB_HEADERS).forEach(function (name) {
    if (ss.getSheetByName(name)) { skipped.push(name); return; }
    var sh = ss.insertSheet(name);
    writeHeaders_(sh, TAB_HEADERS[name]);
    created.push(name);
  });

  removeDefaultSheet_(ss);

  Logger.log("\n════════ SHEET SETUP COMPLETE ════════");
  Logger.log("Created (%s): %s", created.length, created.join(", ") || "none");
  Logger.log("Skipped (%s): %s", skipped.length, skipped.join(", ") || "none");
  Logger.log("══════════════════════════════════════");
  return { created: created, skipped: skipped };
}

/**
 * Provisions ONLY the management tabs (Defect Log + Rework Tracker).
 * Use this if you ran createForms() and just want to finish the DB.
 */
function setupManagementTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var created = [], skipped = [];
  MANAGEMENT_TABS.forEach(function (name) {
    if (ss.getSheetByName(name)) { skipped.push(name); return; }
    var sh = ss.insertSheet(name);
    writeHeaders_(sh, TAB_HEADERS[name]);
    created.push(name);
  });
  Logger.log("Management tabs — created: %s | skipped: %s", created.join(", ") || "none", skipped.join(", ") || "none");
  return { created: created, skipped: skipped };
}

/** Write + style the header row and freeze it. */
function writeHeaders_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight("bold")
    .setBackground("#0a1124")
    .setFontColor("#e8edf7");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

/** Delete the empty default "Sheet1" if it is still blank and not needed. */
function removeDefaultSheet_(ss) {
  var def = ss.getSheetByName("Sheet1");
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) {
    ss.deleteSheet(def);
  }
}

/**
 * DANGER: wipes every data row (keeps headers) on all 9 tabs.
 * Handy when you want to clear test data before going live.
 */
function clearAllData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cleared = [];
  Object.keys(TAB_HEADERS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (sh && sh.getLastRow() > 1) {
      sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
      cleared.push(name);
    }
  });
  Logger.log("Cleared data rows on: %s", cleared.join(", ") || "none");
  return cleared;
}
