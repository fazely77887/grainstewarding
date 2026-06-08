/**
 * ════════════════════════════════════════════════════════════════════
 *  Stewarding Ops Control Center — Google Forms generator (INPUT layer)
 * ════════════════════════════════════════════════════════════════════
 *
 *  WHAT THIS DOES
 *  Builds the 7 field-operations Google Forms (English) and links each one
 *  to THIS spreadsheet. Every form question title is set to the EXACT column
 *  header the dashboard expects, and Google Forms adds the "Timestamp" column
 *  automatically — so the response tab lines up 1:1 with:
 *      lib/sheets.ts        (normaliseTab)
 *      lib/demo-data.ts     (sheetTabs)
 *      apps-script/Code.gs  (TABS + doPost header mapping)
 *
 *  HOW TO RUN
 *  1. Open your Google Sheet → Extensions → Apps Script.
 *  2. Add this file (CreateForms.gs) alongside Code.gs.
 *  3. Run  createForms()  once. Approve the permission prompt.
 *  4. Open View → Logs (or Executions) to copy the live form links.
 *
 *  ORDER (recommended)
 *    createForms()   ← run FIRST  (creates the 7 operational response tabs)
 *    setupSheet()    ← run SECOND (adds the 2 management tabs it is missing)
 *
 *  IDEMPOTENT: if a canonical tab already exists, that form is skipped
 *  (so re-running never creates duplicates). Delete the tab first if you
 *  want to regenerate a form.
 * ════════════════════════════════════════════════════════════════════
 */

/** Shared option lists — keep in sync with lib/modules.ts + module-page.tsx. */
var OPERATORS = [
  "Ahmad Faisal", "Siti Rahimah", "Ravi Kumar", "Lim Wei Chen",
  "Fatimah Bte", "James Oduya", "Sarah Tan"
];

var AREAS = [
  "Main Kitchen", "Banquet Kitchen", "Staff Kitchen", "Bar Area",
  "Loading Bay", "Cold Storage", "Dry Store", "Dishwash Area",
  "Pot Wash Area", "Cambro Station", "Machine Room", "Other"
];

var DISPOSAL_SLOTS = ["06:00", "10:00", "14:00", "18:00", "22:00"];

/**
 * Form blueprints. `tab` MUST equal the canonical sheet tab name.
 * Each field: { title, type, required, choices?, help? }
 *   type: "text" | "paragraph" | "choice" | "operators" | "areas" | "slots"
 * The order here is the order shown to the operator; Timestamp is auto-added
 * by Google Forms as the first column of the response tab.
 */
var FORM_SPECS = [
  {
    tab: "Cambro Water Dispenser Deep Clean",
    title: "💧 Water Dispenser Deep Clean",
    desc: "Log each Cambro water dispenser deep clean. One submission per unit per clean.",
    fields: [
      { title: "Dispenser ID", type: "text", required: true, help: "e.g. WD-001" },
      { title: "Operator Name", type: "operators", required: true },
      { title: "Cleaning Status", type: "choice", required: true, choices: ["Completed", "In Progress", "Pending", "Failed"] },
      { title: "Remarks", type: "paragraph", required: false, help: "Optional notes, e.g. filter replaced / nozzle blocked" }
    ]
  },
  {
    tab: "Cambro Black Box Deep Clean",
    title: "📦 Black Box Deep Clean",
    desc: "Log each Cambro black box deep clean. One submission per unit per clean.",
    fields: [
      { title: "Cambro ID", type: "text", required: true, help: "e.g. CB-001" },
      { title: "Operator Name", type: "operators", required: true },
      { title: "Cleaning Status", type: "choice", required: true, choices: ["Completed", "In Progress", "Pending", "Failed"] },
      { title: "Remarks", type: "paragraph", required: false }
    ]
  },
  {
    tab: "Machine Deep Clean",
    title: "⚙️ Machine Deep Clean",
    desc: "Log each machine deep clean (dishwasher, glasswasher, slicer, etc.).",
    fields: [
      { title: "Machine ID", type: "text", required: true, help: "e.g. DW-001" },
      { title: "Machine Name", type: "text", required: true, help: "e.g. Industrial Dishwasher" },
      { title: "Operator Name", type: "operators", required: true },
      { title: "Cleaning Status", type: "choice", required: true, choices: ["Completed", "In Progress", "Pending", "Failed"] },
      { title: "Remarks", type: "paragraph", required: false }
    ]
  },
  {
    tab: "5 Minute QC Kitchen Utensils",
    title: "🔍 5-Minute QC — Kitchen Utensils",
    desc: "Five-minute quality check on kitchen utensils. Record findings even on a pass.",
    fields: [
      { title: "Area", type: "areas", required: true },
      { title: "Inspector Name", type: "operators", required: true },
      { title: "Pass/Fail", type: "choice", required: true, choices: ["Pass", "Fail"] },
      { title: "Findings", type: "paragraph", required: false, help: "What did you observe?" },
      { title: "Corrective Action", type: "paragraph", required: false, help: "Required if Fail" }
    ]
  },
  {
    tab: "5 Minute QC Pest Control",
    title: "🛡️ 5-Minute QC — Pest Control",
    desc: "Five-minute pest-control sweep. Log any droppings, gnaw marks or activity.",
    fields: [
      { title: "Area", type: "areas", required: true },
      { title: "Inspector Name", type: "operators", required: true },
      { title: "Pass/Fail", type: "choice", required: true, choices: ["Pass", "Fail"] },
      { title: "Findings", type: "paragraph", required: false },
      { title: "Corrective Action", type: "paragraph", required: false, help: "Required if Fail" }
    ]
  },
  {
    tab: "Rubbish Disposal Timing",
    title: "🗑️ Rubbish Disposal Timing",
    desc: "Log each scheduled rubbish disposal run and whether it was on time.",
    fields: [
      { title: "Area", type: "areas", required: true },
      { title: "Disposal Time", type: "slots", required: true, help: "Scheduled slot" },
      { title: "Operator Name", type: "operators", required: true },
      { title: "Status", type: "choice", required: true, choices: ["On Time", "Delayed", "Missed"] },
      { title: "Remarks", type: "paragraph", required: false, help: "Reason if delayed or missed" }
    ]
  },
  {
    tab: "Red Tag Item Management",
    title: "🔴 Red Tag Item Management",
    desc: "Report a damaged / unsafe item and tag it out of service.",
    fields: [
      { title: "Item ID", type: "text", required: true, help: "e.g. RT-001" },
      { title: "Item Name", type: "text", required: true, help: "e.g. Cracked Serving Tray" },
      { title: "Reason", type: "paragraph", required: true, help: "Why is it being red-tagged?" },
      { title: "Reported By", type: "operators", required: true },
      { title: "Status", type: "choice", required: true, choices: ["Open", "In Progress", "Resolved"] },
      { title: "Action Taken", type: "paragraph", required: false }
    ]
  }
];

/**
 * MAIN ENTRY POINT — run this once from the Apps Script editor.
 */
function createForms() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("Run this from the Apps Script bound to your Google Sheet (Extensions → Apps Script).");

  var summary = [];
  for (var i = 0; i < FORM_SPECS.length; i++) {
    summary.push(buildOneForm_(ss, FORM_SPECS[i]));
  }

  Logger.log("\n════════ STEWARDING OPS — FORM LINKS ════════");
  summary.forEach(function (s) {
    Logger.log("• %s\n    tab:       %s\n    live form: %s\n    edit form: %s\n", s.title, s.tab, s.live || "-", s.edit || "-");
  });
  Logger.log("═════════════════════════════════════════════");
  Logger.log("Next: run setupSheet() to add the Defect Log + Rework Tracker tabs, then deploy Code.gs as a Web App.");
  return summary;
}

/** Build (or skip) a single form and wire its response tab to the canonical name. */
function buildOneForm_(ss, spec) {
  // Idempotency guard — never duplicate an existing tab.
  if (ss.getSheetByName(spec.tab)) {
    Logger.log("SKIP  '%s' — tab already exists. Delete it first to regenerate.", spec.tab);
    return { title: spec.title, tab: spec.tab, skipped: true };
  }

  var form = FormApp.create(spec.title);
  form.setDescription(spec.desc);
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);
  form.setShowLinkToRespondAgain(true);

  spec.fields.forEach(function (f) { addField_(form, f); });

  // Snapshot existing tabs, link the form, then find + rename the new tab.
  var before = {};
  ss.getSheets().forEach(function (s) { before[s.getSheetId()] = true; });

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();

  var created = null;
  ss.getSheets().forEach(function (s) { if (!before[s.getSheetId()]) created = s; });

  if (created) {
    created.setName(spec.tab);
    formatHeaderRow_(created);
  } else {
    Logger.log("WARN  Could not locate the new response sheet for '%s'. Rename it to '%s' manually.", spec.title, spec.tab);
  }

  return {
    title: spec.title,
    tab: spec.tab,
    live: form.getPublishedUrl(),
    edit: form.getEditUrl(),
    skipped: false
  };
}

/** Add one question to the form based on its declared type. */
function addField_(form, f) {
  var item;
  switch (f.type) {
    case "paragraph":
      item = form.addParagraphTextItem();
      break;
    case "choice":
      item = form.addMultipleChoiceItem().setChoiceValues(f.choices);
      break;
    case "operators":
      item = form.addListItem().setChoiceValues(OPERATORS);
      break;
    case "areas":
      item = form.addListItem().setChoiceValues(AREAS);
      break;
    case "slots":
      item = form.addMultipleChoiceItem().setChoiceValues(DISPOSAL_SLOTS);
      break;
    case "text":
    default:
      item = form.addTextItem();
      break;
  }
  item.setTitle(f.title);
  if (f.help) item.setHelpText(f.help);
  if (typeof item.setRequired === "function") item.setRequired(!!f.required);
  return item;
}

/** Bold + freeze the header row so the response tab reads cleanly. */
function formatHeaderRow_(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return;
  sheet.getRange(1, 1, 1, lastCol)
    .setFontWeight("bold")
    .setBackground("#0a1124")
    .setFontColor("#e8edf7");
  sheet.setFrozenRows(1);
}

/**
 * Optional helper: print existing tabs + their headers, to confirm the
 * pipeline contract after setup.
 */
function auditTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach(function (s) {
    var lc = s.getLastColumn();
    var headers = lc ? s.getRange(1, 1, 1, lc).getValues()[0].join(" · ") : "(empty)";
    Logger.log("%s  →  %s", s.getName(), headers);
  });
}
