/* ════════════════════════════════════════════════════════════════════
   Demo dataset — values transcribed from the reference screenshots
   (Sunday 7 June 2026). When Supabase is connected, hooks in lib/data.ts
   replace these with live rows; the shapes stay identical.
   ════════════════════════════════════════════════════════════════════ */

export type Status =
  | "completed" | "in_progress" | "pending" | "failed"
  | "pass" | "fail"
  | "on_time" | "delayed" | "missed"
  | "open" | "resolved";

export const TODAY = "2026-06-07";
export const TODAY_LABEL = "Sunday, 7 June 2026";
export const TODAY_PILL = "7 Jun 2026";

/* ── Executive hero ─────────────────────────────────────────────── */
export const hero = {
  compliance: 76,
  recordsToday: 40,
  cleanRate: 71,
  qcPassRate: 82,
  openRedTags: 4,
  tasksCompleted: 86,
  pendingTasks: 18,
  missedDisposals: 2,
  deepCleanRate: 71,
};

/* ── Module completion (bar chart + Module Status list) ─────────── */
export const moduleCompletion = [
  { key: "water",   label: "Water Disp.", color: "#10b981", value: 71 },
  { key: "blackbox",label: "Black Box",   color: "#06b6d4", value: 71 },
  { key: "machine", label: "Machine",     color: "#3b82f6", value: 71 },
  { key: "qckit",   label: "QC Kitchen",  color: "#a78bfa", value: 76 },
  { key: "qcpest",  label: "QC Pest",     color: "#a855f7", value: 88 },
  { key: "rubbish", label: "Rubbish",     color: "#f59e0b", value: 80 },
];

export const qcSplit = { pass: 28, fail: 6 };

/* ── 7-day trend (Daily Breakdown table is source of truth) ─────── */
export const weekDays = ["Mon 1", "Tue 2", "Wed 3", "Thu 4", "Fri 5", "Sat 6", "Sun 7"];
export const dailyBreakdown = [
  { day: "Mon 1", date: "2026-06-01", total: 7,  completed: 7,  incidents: 0, rate: 100 },
  { day: "Tue 2", date: "2026-06-02", total: 7,  completed: 5,  incidents: 0, rate: 71 },
  { day: "Wed 3", date: "2026-06-03", total: 7,  completed: 5,  incidents: 1, rate: 71 },
  { day: "Thu 4", date: "2026-06-04", total: 13, completed: 12, incidents: 1, rate: 92 },
  { day: "Fri 5", date: "2026-06-05", total: 16, completed: 11, incidents: 1, rate: 69 },
  { day: "Sat 6", date: "2026-06-06", total: 27, completed: 20, incidents: 6, rate: 74 },
  { day: "Sun 7", date: "2026-06-07", total: 40, completed: 26, incidents: 6, rate: 65 },
];

/* ── Recent incidents (8 open) ──────────────────────────────────── */
export type Incident = { module: string; tag: string; severity: "High" | "Medium"; title: string; by: string; at: string };
export const incidents: Incident[] = [
  { module: "disposal",  tag: "DISPOSAL",   severity: "Medium", title: "Banquet Kitchen missed at 14:00",                      by: "Ravi Kumar",   at: "2026-06-07 14:00" },
  { module: "qc",        tag: "QC",         severity: "Medium", title: "Banquet Kitchen — Stained serving platters found",     by: "Ahmad Faisal", at: "2026-06-07 11:30" },
  { module: "red_tag",   tag: "RED TAG",    severity: "Medium", title: "RT-003 Damaged Spatula",                               by: "Siti Rahimah", at: "2026-06-07 10:00" },
  { module: "qc",        tag: "QC",         severity: "Medium", title: "Dry Store — Mouse droppings found near rice sacks",    by: "Ahmad Faisal", at: "2026-06-07 09:00" },
  { module: "red_tag",   tag: "RED TAG",    severity: "Medium", title: "RT-001 Cracked Serving Tray",                          by: "Ahmad Faisal", at: "2026-06-07 08:00" },
  { module: "qc",        tag: "QC",         severity: "Medium", title: "Banquet Kitchen — Knives not properly sanitised",      by: "Sarah Tan",    at: "2026-06-07 07:30" },
  { module: "qc",        tag: "QC",         severity: "Medium", title: "Bar Area — Ice bucket not sanitised",                  by: "Ahmad Faisal", at: "2026-06-06 08:30" },
  { module: "deep_clean",tag: "DEEP CLEAN", severity: "High",   title: "WD-006 failed",                                        by: "James Oduya",  at: "2026-06-06 08:00" },
];

/* ── Drill-down panel rows ──────────────────────────────────────── */
export const drillTotalRecords = [
  { time: "14:00", module: "RUBBISH",     status: "delayed",   operator: "Ahmad Faisal", area: "Main Kitchen" },
  { time: "14:00", module: "RUBBISH",     status: "missed",    operator: "Ravi Kumar",   area: "Banquet Kitchen" },
  { time: "11:30", module: "QC KITCHEN",  status: "fail",      operator: "—",            area: "Banquet Kitchen" },
  { time: "11:00", module: "WATER DISP.", status: "completed", operator: "Fatimah Bte",  area: "—" },
  { time: "11:00", module: "BLACK BOX",   status: "completed", operator: "James Oduya",  area: "—" },
  { time: "11:00", module: "QC PEST",     status: "pass",      operator: "—",            area: "Staff Room" },
  { time: "10:30", module: "QC KITCHEN",  status: "pass",      operator: "—",            area: "Main Kitchen" },
  { time: "10:00", module: "WATER DISP.", status: "pending",   operator: "Lim Wei Chen", area: "—" },
  { time: "10:00", module: "BLACK BOX",   status: "completed", operator: "Fatimah Bte",  area: "—" },
  { time: "10:00", module: "MACHINE",     status: "completed", operator: "James Oduya",  area: "—" },
  { time: "10:00", module: "QC PEST",     status: "pass",      operator: "—",            area: "Main Kitchen" },
  { time: "10:00", module: "RUBBISH",     status: "on_time",   operator: "Siti Rahimah", area: "Main Kitchen" },
];

export const drillTasksCompleted = [
  { dt: "2026-06-07 11:00", module: "DEEP CLEAN", result: "completed", operator: "Fatimah Bte",  area: "—" },
  { dt: "2026-06-07 11:00", module: "DEEP CLEAN", result: "completed", operator: "James Oduya",  area: "—" },
  { dt: "2026-06-07 11:00", module: "QC",         result: "pass",      operator: "—",            area: "Staff Room" },
  { dt: "2026-06-07 10:30", module: "QC",         result: "pass",      operator: "—",            area: "Main Kitchen" },
  { dt: "2026-06-07 10:00", module: "DEEP CLEAN", result: "completed", operator: "Fatimah Bte",  area: "—" },
  { dt: "2026-06-07 10:00", module: "DEEP CLEAN", result: "completed", operator: "James Oduya",  area: "—" },
  { dt: "2026-06-07 10:00", module: "QC",         result: "pass",      operator: "—",            area: "Main Kitchen" },
  { dt: "2026-06-07 10:00", module: "RUBBISH",    result: "on_time",   operator: "Siti Rahimah", area: "Main Kitchen" },
  { dt: "2026-06-07 10:00", module: "RUBBISH",    result: "on_time",   operator: "Lim Wei Chen", area: "Banquet Kitchen" },
  { dt: "2026-06-07 10:00", module: "RUBBISH",    result: "on_time",   operator: "James Oduya",  area: "Loading Bay" },
  { dt: "2026-06-07 09:30", module: "QC",         result: "pass",      operator: "—",            area: "Bar Area" },
  { dt: "2026-06-07 09:00", module: "DEEP CLEAN", result: "completed", operator: "Fatimah Bte",  area: "—" },
];

export const drillPending = [
  { dt: "2026-06-07 10:00", module: "DEEP CLEAN", status: "pending",     itemId: "WD-004", operator: "Lim Wei Chen", area: "—" },
  { dt: "2026-06-07 10:00", module: "RED TAG",    status: "open",        itemId: "RT-003", operator: "Siti Rahimah", area: "—" },
  { dt: "2026-06-07 09:00", module: "DEEP CLEAN", status: "in_progress", itemId: "WD-003", operator: "Ravi Kumar",   area: "—" },
  { dt: "2026-06-07 09:00", module: "DEEP CLEAN", status: "pending",     itemId: "CB-004", operator: "Lim Wei Chen", area: "—" },
  { dt: "2026-06-07 09:00", module: "RED TAG",    status: "in_progress", itemId: "RT-002", operator: "James Oduya",  area: "—" },
  { dt: "2026-06-07 08:00", module: "DEEP CLEAN", status: "in_progress", itemId: "CB-003", operator: "Ravi Kumar",   area: "—" },
  { dt: "2026-06-07 08:00", module: "DEEP CLEAN", status: "pending",     itemId: "BC-001", operator: "Lim Wei Chen", area: "—" },
  { dt: "2026-06-07 08:00", module: "RED TAG",    status: "open",        itemId: "RT-001", operator: "Ahmad Faisal", area: "—" },
  { dt: "2026-06-07 07:00", module: "DEEP CLEAN", status: "in_progress", itemId: "FC-001", operator: "Ravi Kumar",   area: "—" },
];

export const drillCompliance = [
  { module: "WATER DISP.", total: 17, completed: 12, pending: 5, rate: 71 },
  { module: "BLACK BOX",   total: 17, completed: 12, pending: 5, rate: 71 },
  { module: "MACHINE DC",  total: 17, completed: 12, pending: 5, rate: 71 },
  { module: "QC KITCHEN",  total: 17, completed: 13, pending: 4, rate: 76 },
  { module: "QC PEST",     total: 17, completed: 15, pending: 2, rate: 88 },
  { module: "RUBBISH",     total: 20, completed: 16, pending: 4, rate: 80 },
];

export const drillQc = [
  { dt: "2026-06-07 11:30", type: "QC KITCHEN", area: "Banquet Kitchen", result: "fail", inspector: "Ahmad Faisal", findings: "Stained serving platters found" },
  { dt: "2026-06-07 11:00", type: "QC PEST",    area: "Staff Room",      result: "pass", inspector: "Sarah Tan",    findings: "Clean, no visible pest activity" },
  { dt: "2026-06-07 10:30", type: "QC KITCHEN", area: "Main Kitchen",    result: "pass", inspector: "Sarah Tan",    findings: "Cutting boards colour-coded" },
  { dt: "2026-06-07 10:00", type: "QC PEST",    area: "Main Kitchen",    result: "pass", inspector: "James Oduya",  findings: "No signs of infestation" },
  { dt: "2026-06-07 09:30", type: "QC KITCHEN", area: "Bar Area",        result: "pass", inspector: "James Oduya",  findings: "Glassware spot-free" },
  { dt: "2026-06-07 09:00", type: "QC PEST",    area: "Dry Store",       result: "fail", inspector: "Ahmad Faisal", findings: "Mouse droppings found" },
  { dt: "2026-06-07 08:30", type: "QC KITCHEN", area: "Staff Kitchen",   result: "pass", inspector: "Ahmad Faisal", findings: "Satisfactory" },
  { dt: "2026-06-07 08:00", type: "QC PEST",    area: "Cold Storage",    result: "pass", inspector: "Sarah Tan",    findings: "Sealed and clean" },
  { dt: "2026-06-07 07:30", type: "QC KITCHEN", area: "Banquet Kitchen", result: "fail", inspector: "Sarah Tan",    findings: "Knives not properly sanitised" },
];

export const drillRedTags = [
  { reported: "2026-06-07 10:00", itemId: "RT-003", name: "Damaged Spatula",        area: "—", status: "open",        by: "Siti Rahimah" },
  { reported: "2026-06-07 09:00", itemId: "RT-002", name: "Broken Thermometer",     area: "—", status: "in_progress", by: "James Oduya" },
  { reported: "2026-06-07 08:00", itemId: "RT-001", name: "Cracked Serving Tray",   area: "—", status: "open",        by: "Ahmad Faisal" },
  { reported: "2026-06-05 09:00", itemId: "RT-007", name: "Bent Ladle",             area: "—", status: "in_progress", by: "James Oduya" },
  { reported: "2026-06-05 08:00", itemId: "RT-006", name: "Leaking Food Container", area: "—", status: "open",        by: "Fatimah Bte" },
  { reported: "2026-06-04 09:00", itemId: "RT-009", name: "Dented Pot",             area: "—", status: "open",        by: "Siti Rahimah" },
];

export const drillMissed = [
  { logged: "2026-06-07 14:00", area: "Banquet Kitchen", scheduled: "14:00", status: "missed", operator: "Ravi Kumar",  notes: "—" },
  { logged: "2026-06-06 06:00", area: "Loading Bay",     scheduled: "06:00", status: "missed", operator: "James Oduya", notes: "—" },
];

export const drillDeepClean = [
  { dt: "2026-06-07 11:00", type: "WATER DISP.", unitId: "WD-005", status: "completed",   operator: "Fatimah Bte" },
  { dt: "2026-06-07 11:00", type: "BLACK BOX",   unitId: "CB-006", status: "completed",   operator: "James Oduya" },
  { dt: "2026-06-07 10:00", type: "WATER DISP.", unitId: "WD-004", status: "pending",     operator: "Lim Wei Chen" },
  { dt: "2026-06-07 10:00", type: "BLACK BOX",   unitId: "CB-005", status: "completed",   operator: "Fatimah Bte" },
  { dt: "2026-06-07 10:00", type: "MACHINE",     unitId: "WM-001", status: "completed",   operator: "James Oduya" },
  { dt: "2026-06-07 09:00", type: "WATER DISP.", unitId: "WD-003", status: "in_progress", operator: "Ravi Kumar" },
  { dt: "2026-06-07 09:00", type: "BLACK BOX",   unitId: "CB-004", status: "pending",     operator: "Lim Wei Chen" },
  { dt: "2026-06-07 09:00", type: "MACHINE",     unitId: "MS-001", status: "completed",   operator: "Fatimah Bte" },
  { dt: "2026-06-07 08:30", type: "WATER DISP.", unitId: "WD-002", status: "completed",   operator: "Siti Rahimah" },
];

/* ── Module page records ────────────────────────────────────────── */
export type ModuleRecord = {
  ts: string; unitId?: string; unitName?: string; operator?: string; status: Status;
  remarks?: string; area?: string; inspector?: string; findings?: string; corrective?: string;
  disposalTime?: string; itemId?: string; itemName?: string; reason?: string; actionTaken?: string;
};

export const waterRecords: ModuleRecord[] = [
  { ts: "2026-06-07 07:15", unitId: "WD-001", operator: "Ahmad Faisal", status: "completed",   remarks: "All clear" },
  { ts: "2026-06-07 08:30", unitId: "WD-002", operator: "Siti Rahimah", status: "completed",   remarks: "Filter replaced" },
  { ts: "2026-06-07 09:00", unitId: "WD-003", operator: "Ravi Kumar",   status: "in_progress", remarks: "Soaking in progress" },
  { ts: "2026-06-07 10:00", unitId: "WD-004", operator: "Lim Wei Chen", status: "pending" },
  { ts: "2026-06-07 11:00", unitId: "WD-005", operator: "Fatimah Bte",  status: "completed",   remarks: "Sanitised" },
  { ts: "2026-06-06 07:00", unitId: "WD-001", operator: "Ahmad Faisal", status: "completed" },
  { ts: "2026-06-06 08:00", unitId: "WD-006", operator: "James Oduya",  status: "failed",      remarks: "Nozzle blocked — escalated" },
  { ts: "2026-06-05 07:30", unitId: "WD-002", operator: "Siti Rahimah", status: "completed" },
  { ts: "2026-06-05 09:00", unitId: "WD-003", operator: "Ravi Kumar",   status: "completed" },
  { ts: "2026-06-04 07:00", unitId: "WD-004", operator: "Lim Wei Chen", status: "completed" },
  { ts: "2026-06-04 08:30", unitId: "WD-005", operator: "Fatimah Bte",  status: "completed",   remarks: "Deep rinse done" },
  { ts: "2026-06-03 07:15", unitId: "WD-001", operator: "Ahmad Faisal", status: "completed" },
  { ts: "2026-06-03 09:00", unitId: "WD-006", operator: "James Oduya",  status: "in_progress" },
  { ts: "2026-06-02 07:00", unitId: "WD-002", operator: "Siti Rahimah", status: "completed" },
  { ts: "2026-06-02 08:00", unitId: "WD-003", operator: "Ravi Kumar",   status: "pending" },
  { ts: "2026-06-01 07:30", unitId: "WD-001", operator: "Ahmad Faisal", status: "completed" },
  { ts: "2026-06-01 08:30", unitId: "WD-004", operator: "Lim Wei Chen", status: "completed" },
];

export const blackBoxRecords: ModuleRecord[] = [
  { ts: "2026-06-07 07:00", unitId: "CB-001", operator: "Ahmad Faisal", status: "completed",   remarks: "Lid gasket checked" },
  { ts: "2026-06-07 07:30", unitId: "CB-002", operator: "Siti Rahimah", status: "completed" },
  { ts: "2026-06-07 08:00", unitId: "CB-003", operator: "Ravi Kumar",   status: "in_progress", remarks: "Soaking" },
  { ts: "2026-06-07 09:00", unitId: "CB-004", operator: "Lim Wei Chen", status: "pending" },
  { ts: "2026-06-07 10:00", unitId: "CB-005", operator: "Fatimah Bte",  status: "completed",   remarks: "Sanitised" },
  { ts: "2026-06-07 11:00", unitId: "CB-006", operator: "James Oduya",  status: "completed" },
  { ts: "2026-06-06 07:00", unitId: "CB-007", operator: "Ahmad Faisal", status: "completed" },
  { ts: "2026-06-06 08:00", unitId: "CB-008", operator: "Siti Rahimah", status: "failed",      remarks: "Odour detected — re-clean ordered" },
  { ts: "2026-06-05 07:30", unitId: "CB-001", operator: "Ravi Kumar",   status: "completed" },
  { ts: "2026-06-05 08:30", unitId: "CB-002", operator: "Lim Wei Chen", status: "completed" },
  { ts: "2026-06-04 07:00", unitId: "CB-003", operator: "Fatimah Bte",  status: "completed" },
  { ts: "2026-06-04 09:00", unitId: "CB-004", operator: "James Oduya",  status: "in_progress" },
  { ts: "2026-06-03 07:30", unitId: "CB-005", operator: "Ahmad Faisal", status: "completed" },
  { ts: "2026-06-03 08:30", unitId: "CB-006", operator: "Siti Rahimah", status: "pending" },
  { ts: "2026-06-02 07:00", unitId: "CB-007", operator: "Ravi Kumar",   status: "completed" },
  { ts: "2026-06-01 07:30", unitId: "CB-001", operator: "Lim Wei Chen", status: "completed" },
  { ts: "2026-06-01 08:30", unitId: "CB-002", operator: "Fatimah Bte",  status: "completed" },
];

export const machineRecords: ModuleRecord[] = [
  { ts: "2026-06-07 06:00", unitId: "DW-001", unitName: "Industrial Dishwasher", operator: "Ahmad Faisal", status: "completed",   remarks: "Arms cleaned, filters cleared" },
  { ts: "2026-06-07 06:30", unitId: "DW-002", unitName: "Glasswasher",           operator: "Siti Rahimah", status: "completed" },
  { ts: "2026-06-07 07:00", unitId: "FC-001", unitName: "Food Chopper",          operator: "Ravi Kumar",   status: "in_progress", remarks: "Blades being cleaned" },
  { ts: "2026-06-07 08:00", unitId: "BC-001", unitName: "Blast Chiller",         operator: "Lim Wei Chen", status: "pending" },
  { ts: "2026-06-07 09:00", unitId: "MS-001", unitName: "Meat Slicer",           operator: "Fatimah Bte",  status: "completed",   remarks: "Blade sanitised" },
  { ts: "2026-06-07 10:00", unitId: "WM-001", unitName: "Washing Machine",       operator: "James Oduya",  status: "completed" },
  { ts: "2026-06-06 06:00", unitId: "DW-001", unitName: "Industrial Dishwasher", operator: "Ahmad Faisal", status: "completed" },
  { ts: "2026-06-06 07:00", unitId: "FC-001", unitName: "Food Chopper",          operator: "Siti Rahimah", status: "failed",      remarks: "Guard cracked — tagged" },
  { ts: "2026-06-05 06:30", unitId: "DW-002", unitName: "Glasswasher",           operator: "Ravi Kumar",   status: "completed" },
  { ts: "2026-06-05 08:00", unitId: "BC-001", unitName: "Blast Chiller",         operator: "Lim Wei Chen", status: "completed" },
  { ts: "2026-06-04 06:00", unitId: "MS-001", unitName: "Meat Slicer",           operator: "Fatimah Bte",  status: "completed" },
  { ts: "2026-06-04 07:30", unitId: "WM-001", unitName: "Washing Machine",       operator: "James Oduya",  status: "in_progress" },
  { ts: "2026-06-03 06:30", unitId: "DW-001", unitName: "Industrial Dishwasher", operator: "Ahmad Faisal", status: "completed" },
  { ts: "2026-06-03 08:00", unitId: "DW-002", unitName: "Glasswasher",           operator: "Siti Rahimah", status: "pending" },
  { ts: "2026-06-02 06:00", unitId: "FC-001", unitName: "Food Chopper",          operator: "Ravi Kumar",   status: "completed" },
  { ts: "2026-06-01 06:30", unitId: "BC-001", unitName: "Blast Chiller",         operator: "Lim Wei Chen", status: "completed" },
  { ts: "2026-06-01 07:30", unitId: "MS-001", unitName: "Meat Slicer",           operator: "Fatimah Bte",  status: "completed" },
];

export const kitchenQcRecords: ModuleRecord[] = [
  { ts: "2026-06-07 06:30", area: "Main Kitchen",    inspector: "James Oduya",  status: "pass", findings: "All utensils clean and stored correctly" },
  { ts: "2026-06-07 07:30", area: "Banquet Kitchen", inspector: "Sarah Tan",    status: "fail", findings: "Knives not properly sanitised", corrective: "Knives re-sanitised and logged" },
  { ts: "2026-06-07 08:30", area: "Staff Kitchen",   inspector: "Ahmad Faisal", status: "pass", findings: "Satisfactory" },
  { ts: "2026-06-07 09:30", area: "Bar Area",        inspector: "James Oduya",  status: "pass", findings: "Glassware spot-free" },
  { ts: "2026-06-07 10:30", area: "Main Kitchen",    inspector: "Sarah Tan",    status: "pass", findings: "Cutting boards colour-coded correctly" },
  { ts: "2026-06-07 11:30", area: "Banquet Kitchen", inspector: "Ahmad Faisal", status: "fail", findings: "Stained serving platters found", corrective: "Platters quarantined for deep clean" },
  { ts: "2026-06-06 06:30", area: "Main Kitchen",    inspector: "James Oduya",  status: "pass", findings: "All clear" },
  { ts: "2026-06-06 08:30", area: "Bar Area",        inspector: "Ahmad Faisal", status: "fail", findings: "Ice bucket not sanitised", corrective: "Re-sanitised, retrained staff" },
  { ts: "2026-06-05 07:00", area: "Staff Kitchen",   inspector: "Sarah Tan",    status: "pass", findings: "Satisfactory" },
  { ts: "2026-06-05 09:00", area: "Main Kitchen",    inspector: "James Oduya",  status: "pass", findings: "All clear" },
  { ts: "2026-06-04 06:30", area: "Banquet Kitchen", inspector: "Sarah Tan",    status: "pass", findings: "Pass after re-check" },
  { ts: "2026-06-04 08:00", area: "Main Kitchen",    inspector: "Ahmad Faisal", status: "pass", findings: "All clear" },
  { ts: "2026-06-03 07:00", area: "Bar Area",        inspector: "James Oduya",  status: "pass", findings: "Spot-free" },
  { ts: "2026-06-03 09:30", area: "Main Kitchen",    inspector: "Sarah Tan",    status: "fail", findings: "Tongs stored wet", corrective: "Air-dry rack added" },
  { ts: "2026-06-02 06:30", area: "Staff Kitchen",   inspector: "Ahmad Faisal", status: "pass", findings: "Satisfactory" },
  { ts: "2026-06-01 07:30", area: "Main Kitchen",    inspector: "James Oduya",  status: "pass", findings: "All clear" },
  { ts: "2026-06-01 09:00", area: "Banquet Kitchen", inspector: "Sarah Tan",    status: "pass", findings: "All clear" },
];

export const pestQcRecords: ModuleRecord[] = [
  { ts: "2026-06-07 07:00", area: "Loading Bay",  inspector: "James Oduya",  status: "pass", findings: "No pest activity observed" },
  { ts: "2026-06-07 08:00", area: "Cold Storage", inspector: "Sarah Tan",    status: "pass", findings: "Sealed and clean" },
  { ts: "2026-06-07 09:00", area: "Dry Store",    inspector: "Ahmad Faisal", status: "fail", findings: "Mouse droppings found near rice sacks", corrective: "Pest control contacted — traps placed, sacks quarantined" },
  { ts: "2026-06-07 10:00", area: "Main Kitchen", inspector: "James Oduya",  status: "pass", findings: "No signs of infestation" },
  { ts: "2026-06-07 11:00", area: "Staff Room",   inspector: "Sarah Tan",    status: "pass", findings: "Clean, no visible pest activity" },
  { ts: "2026-06-06 07:00", area: "Loading Bay",  inspector: "Ahmad Faisal", status: "pass", findings: "All clear" },
  { ts: "2026-06-06 09:00", area: "Dry Store",    inspector: "Sarah Tan",    status: "fail", findings: "Gnaw marks on sack corner", corrective: "Stock rotated, bait station added" },
  { ts: "2026-06-05 07:30", area: "Cold Storage", inspector: "James Oduya",  status: "pass", findings: "Sealed and clean" },
  { ts: "2026-06-05 09:30", area: "Main Kitchen", inspector: "Ahmad Faisal", status: "pass", findings: "No activity" },
  { ts: "2026-06-04 07:00", area: "Staff Room",   inspector: "Sarah Tan",    status: "pass", findings: "Clean" },
  { ts: "2026-06-04 08:30", area: "Loading Bay",  inspector: "James Oduya",  status: "pass", findings: "All clear" },
  { ts: "2026-06-03 07:30", area: "Dry Store",    inspector: "Ahmad Faisal", status: "pass", findings: "Traps clear" },
  { ts: "2026-06-03 09:00", area: "Cold Storage", inspector: "Sarah Tan",    status: "pass", findings: "Sealed" },
  { ts: "2026-06-02 07:00", area: "Main Kitchen", inspector: "James Oduya",  status: "pass", findings: "No activity" },
  { ts: "2026-06-02 08:30", area: "Loading Bay",  inspector: "Ahmad Faisal", status: "pass", findings: "All clear" },
  { ts: "2026-06-01 07:30", area: "Staff Room",   inspector: "Sarah Tan",    status: "pass", findings: "Clean" },
  { ts: "2026-06-01 09:00", area: "Dry Store",    inspector: "James Oduya",  status: "pass", findings: "Traps clear" },
];

export const rubbishRecords: ModuleRecord[] = [
  { ts: "2026-06-07 06:00", area: "Main Kitchen",    disposalTime: "06:00", operator: "Ahmad Faisal", status: "on_time" },
  { ts: "2026-06-07 10:00", area: "Main Kitchen",    disposalTime: "10:00", operator: "Siti Rahimah", status: "on_time" },
  { ts: "2026-06-07 14:00", area: "Main Kitchen",    disposalTime: "14:00", operator: "Ahmad Faisal", status: "delayed", remarks: "Shift handover delay — completed 14:25" },
  { ts: "2026-06-07 06:00", area: "Banquet Kitchen", disposalTime: "06:00", operator: "Ravi Kumar",   status: "on_time" },
  { ts: "2026-06-07 10:00", area: "Banquet Kitchen", disposalTime: "10:00", operator: "Lim Wei Chen", status: "on_time" },
  { ts: "2026-06-07 14:00", area: "Banquet Kitchen", disposalTime: "14:00", operator: "Ravi Kumar",   status: "missed",  remarks: "No available operator — reported to supervisor" },
  { ts: "2026-06-07 06:00", area: "Loading Bay",     disposalTime: "06:00", operator: "Fatimah Bte",  status: "on_time" },
  { ts: "2026-06-07 10:00", area: "Loading Bay",     disposalTime: "10:00", operator: "James Oduya",  status: "on_time" },
  { ts: "2026-06-07 06:00", area: "Staff Kitchen",   disposalTime: "06:00", operator: "Siti Rahimah", status: "on_time" },
  { ts: "2026-06-06 06:00", area: "Loading Bay",     disposalTime: "06:00", operator: "James Oduya",  status: "missed" },
  { ts: "2026-06-06 10:00", area: "Main Kitchen",    disposalTime: "10:00", operator: "Ahmad Faisal", status: "on_time" },
  { ts: "2026-06-06 14:00", area: "Banquet Kitchen", disposalTime: "14:00", operator: "Ravi Kumar",   status: "delayed", remarks: "Compactor queue" },
  { ts: "2026-06-05 06:00", area: "Main Kitchen",    disposalTime: "06:00", operator: "Siti Rahimah", status: "on_time" },
  { ts: "2026-06-05 10:00", area: "Loading Bay",     disposalTime: "10:00", operator: "Fatimah Bte",  status: "on_time" },
  { ts: "2026-06-04 06:00", area: "Banquet Kitchen", disposalTime: "06:00", operator: "Lim Wei Chen", status: "on_time" },
  { ts: "2026-06-04 14:00", area: "Main Kitchen",    disposalTime: "14:00", operator: "Ahmad Faisal", status: "on_time" },
  { ts: "2026-06-03 06:00", area: "Loading Bay",     disposalTime: "06:00", operator: "James Oduya",  status: "on_time" },
  { ts: "2026-06-02 06:00", area: "Main Kitchen",    disposalTime: "06:00", operator: "Siti Rahimah", status: "on_time" },
  { ts: "2026-06-01 06:00", area: "Banquet Kitchen", disposalTime: "06:00", operator: "Ravi Kumar",   status: "on_time" },
  { ts: "2026-06-01 10:00", area: "Main Kitchen",    disposalTime: "10:00", operator: "Ahmad Faisal", status: "on_time" },
];

export const redTagRecords: ModuleRecord[] = [
  { ts: "2026-06-07 08:00", itemId: "RT-001", itemName: "Cracked Serving Tray",   reason: "Structural damage — safety risk",          operator: "Ahmad Faisal", status: "open" },
  { ts: "2026-06-07 09:00", itemId: "RT-002", itemName: "Broken Thermometer",     reason: "Inaccurate reading — calibration failed",  operator: "James Oduya",  status: "in_progress", actionTaken: "Sent for repair" },
  { ts: "2026-06-07 10:00", itemId: "RT-003", itemName: "Damaged Spatula",        reason: "Handle cracked — hygiene concern",         operator: "Siti Rahimah", status: "open" },
  { ts: "2026-06-06 08:00", itemId: "RT-004", itemName: "Rusty Peeler",           reason: "Corrosion — food safety risk",             operator: "Ravi Kumar",   status: "resolved",    actionTaken: "Disposed and replaced" },
  { ts: "2026-06-06 09:00", itemId: "RT-005", itemName: "Chipped Chopping Board", reason: "Surface integrity compromised",            operator: "Lim Wei Chen", status: "resolved",    actionTaken: "Board replaced with new unit" },
  { ts: "2026-06-05 08:00", itemId: "RT-006", itemName: "Leaking Food Container", reason: "Seal damaged — contamination",             operator: "Fatimah Bte",  status: "open" },
  { ts: "2026-06-05 09:00", itemId: "RT-007", itemName: "Bent Ladle",             reason: "Deformed — unusable",                      operator: "James Oduya",  status: "in_progress" },
  { ts: "2026-06-04 08:00", itemId: "RT-008", itemName: "Frayed Brush",           reason: "Bristle loss — contamination risk",        operator: "Ahmad Faisal", status: "resolved",    actionTaken: "Replaced" },
  { ts: "2026-06-04 09:00", itemId: "RT-009", itemName: "Dented Pot",             reason: "Dent harbouring residue",                  operator: "Siti Rahimah", status: "open" },
  { ts: "2026-06-03 08:30", itemId: "RT-010", itemName: "Loose Whisk Handle",     reason: "Detachment risk",                          operator: "Ravi Kumar",   status: "resolved",    actionTaken: "Re-fixed and tested" },
  { ts: "2026-06-02 08:00", itemId: "RT-011", itemName: "Scorched Pan",           reason: "Carbon build-up beyond recovery",          operator: "Fatimah Bte",  status: "resolved",    actionTaken: "Disposed" },
  { ts: "2026-06-01 09:00", itemId: "RT-012", itemName: "Cracked Measuring Jug",  reason: "Hairline crack — leak risk",               operator: "Sarah Tan",    status: "resolved",    actionTaken: "Replaced" },
];

/* ── Reports ─────────────────────────────────────────────────────── */
export const moduleSummary = [
  { emoji: "💧", name: "Water Dispenser", slug: "water-dispenser", records: 17, today: 5, rate: 71, trend: "flat" as const,  color: "#f59e0b" },
  { emoji: "📦", name: "Black Box",       slug: "black-box",       records: 17, today: 6, rate: 71, trend: "flat" as const,  color: "#f59e0b" },
  { emoji: "⚙️", name: "Machine Clean",   slug: "machine-clean",   records: 17, today: 6, rate: 71, trend: "flat" as const,  color: "#f59e0b" },
  { emoji: "🔍", name: "QC Kitchen",      slug: "kitchen-utensils",records: 17, today: 6, rate: 76, trend: "flat" as const,  color: "#f59e0b" },
  { emoji: "🛡️", name: "QC Pest Control", slug: "pest-control",    records: 17, today: 5, rate: 88, trend: "up" as const,    color: "#10b981" },
  { emoji: "🗑️", name: "Rubbish Disposal",slug: "rubbish-disposal",records: 20, today: 9, rate: 80, trend: "up" as const,    color: "#10b981" },
  { emoji: "🔴", name: "Red Tag Items",   slug: "red-tag-items",   records: 12, today: 3, rate: 50, trend: "down" as const,  color: "#ef4444" },
];

export const recordsByModule = [
  { name: "Water Dispenser", value: 17, color: "#3b82f6" },
  { name: "Black Box",       value: 17, color: "#10b981" },
  { name: "Machine Clean",   value: 17, color: "#a78bfa" },
  { name: "QC Kitchen",      value: 17, color: "#f59e0b" },
  { name: "QC Pest Control", value: 17, color: "#06b6d4" },
  { name: "Rubbish Disposal",value: 20, color: "#ef4444" },
  { name: "Red Tag Items",   value: 12, color: "#ec4899" },
];

export const statusBreakdown = [
  { emoji: "💧", name: "Water Dispenser",  rows: [["Completed", 12], ["In Progress", 2], ["Pending", 2], ["Failed", 1]] },
  { emoji: "📦", name: "Black Box",        rows: [["Completed", 12], ["In Progress", 2], ["Pending", 2], ["Failed", 1]] },
  { emoji: "⚙️", name: "Machine Clean",    rows: [["Completed", 12], ["In Progress", 2], ["Pending", 2], ["Failed", 1]] },
  { emoji: "🔍", name: "QC Kitchen",       rows: [["Pass", 13], ["Fail", 4]] },
  { emoji: "🛡️", name: "QC Pest Control",  rows: [["Pass", 15], ["Fail", 2]] },
  { emoji: "🗑️", name: "Rubbish Disposal", rows: [["On Time", 16], ["Delayed", 2], ["Missed", 2]] },
  { emoji: "🔴", name: "Red Tag Items",    rows: [["Resolved", 6], ["In Progress", 2], ["Open", 4]] },
] as { emoji: string; name: string; rows: [string, number][] }[];

export const operators = [
  { rank: 1, name: "Ahmad Faisal", short: "Ahmad",   tasks: 27, done: 20, fail: 4, rate: 74, modules: "Water, Black Box, Machine, Rubbish, QC Kit, QC Pest, Red Tag" },
  { rank: 2, name: "James Oduya",  short: "James",   tasks: 26, done: 20, fail: 3, rate: 77, modules: "Water, Black Box, Machine, Rubbish, QC Kit, QC Pest, Red Tag" },
  { rank: 3, name: "Ravi Kumar",   short: "Ravi",    tasks: 15, done: 10, fail: 1, rate: 67, modules: "Water, Black Box, Machine, Rubbish, Red Tag" },
  { rank: 4, name: "Siti Rahimah", short: "Siti",    tasks: 14, done: 10, fail: 2, rate: 71, modules: "Water, Black Box, Machine, Rubbish, Red Tag" },
  { rank: 5, name: "Lim Wei Chen", short: "Lim",     tasks: 14, done: 9,  fail: 0, rate: 64, modules: "Water, Black Box, Machine, Rubbish, Red Tag" },
  { rank: 6, name: "Sarah Tan",    short: "Sarah",   tasks: 12, done: 11, fail: 1, rate: 92, modules: "QC Kit, QC Pest" },
  { rank: 7, name: "Fatimah Bte",  short: "Fatimah", tasks: 9,  done: 6,  fail: 0, rate: 67, modules: "Water, Black Box, Machine, Rubbish, Red Tag" },
];

export const areaPerformance = [
  { area: "Main Kitchen",    total: 18, pass: 16, fail: 1, missed: 0, rate: 89 },
  { area: "Banquet Kitchen", total: 10, pass: 6,  fail: 2, missed: 1, rate: 60 },
  { area: "Loading Bay",     total: 8,  pass: 7,  fail: 0, missed: 1, rate: 88 },
  { area: "Cold Storage",    total: 5,  pass: 5,  fail: 0, missed: 0, rate: 100 },
  { area: "Dry Store",       total: 4,  pass: 2,  fail: 2, missed: 0, rate: 50 },
  { area: "Staff Kitchen",   total: 3,  pass: 3,  fail: 0, missed: 0, rate: 100 },
  { area: "Bar Area",        total: 3,  pass: 2,  fail: 1, missed: 0, rate: 67 },
  { area: "Staff Room",      total: 3,  pass: 3,  fail: 0, missed: 0, rate: 100 },
];

export const incidentSummary = { total: 15, high: 5, medium: 10, openRedTags: 4 };

export const incidentLog = [
  { dt: "2026-06-07 14:00", emoji: "🗑️", module: "Rubbish",         detail: "Banquet Kitchen missed at 14:00",                          operator: "Ravi Kumar",   severity: "Medium" },
  { dt: "2026-06-07 11:30", emoji: "🔍", module: "QC Kitchen",      detail: "Banquet Kitchen — Stained serving platters found",         operator: "Ahmad Faisal", severity: "Medium" },
  { dt: "2026-06-07 10:00", emoji: "🔴", module: "Red Tag",         detail: "RT-003 Damaged Spatula — Handle cracked — hygiene concern",operator: "Siti Rahimah", severity: "Medium" },
  { dt: "2026-06-07 09:00", emoji: "🛡️", module: "QC Pest",         detail: "Dry Store — Mouse droppings found near rice sacks",        operator: "Ahmad Faisal", severity: "High" },
  { dt: "2026-06-07 08:00", emoji: "🔴", module: "Red Tag",         detail: "RT-001 Cracked Serving Tray — Structural damage — safety risk", operator: "Ahmad Faisal", severity: "Medium" },
  { dt: "2026-06-07 07:30", emoji: "🔍", module: "QC Kitchen",      detail: "Banquet Kitchen — Knives not properly sanitised",          operator: "Sarah Tan",    severity: "Medium" },
  { dt: "2026-06-06 08:30", emoji: "🔍", module: "QC Kitchen",      detail: "Bar Area — Ice bucket not sanitised",                      operator: "Ahmad Faisal", severity: "Medium" },
  { dt: "2026-06-06 08:00", emoji: "💧", module: "Water Dispenser", detail: "WD-006 — Nozzle blocked — escalated",                      operator: "James Oduya",  severity: "High" },
  { dt: "2026-06-06 08:00", emoji: "📦", module: "Black Box",       detail: "CB-008 — Odour detected — re-clean ordered",               operator: "Siti Rahimah", severity: "High" },
  { dt: "2026-06-06 07:00", emoji: "⚙️", module: "Machine",         detail: "FC-001 — Guard cracked — tagged",                          operator: "Siti Rahimah", severity: "High" },
  { dt: "2026-06-05 09:00", emoji: "🔴", module: "Red Tag",         detail: "RT-007 Bent Ladle — Deformed — unusable",                  operator: "James Oduya",  severity: "Medium" },
  { dt: "2026-06-05 08:00", emoji: "🔴", module: "Red Tag",         detail: "RT-006 Leaking Food Container — Seal damaged",             operator: "Fatimah Bte",  severity: "Medium" },
  { dt: "2026-06-04 09:00", emoji: "🔴", module: "Red Tag",         detail: "RT-009 Dented Pot — Dent harbouring residue",              operator: "Siti Rahimah", severity: "Medium" },
  { dt: "2026-06-03 09:30", emoji: "🔍", module: "QC Kitchen",      detail: "Main Kitchen — Tongs stored wet",                          operator: "Sarah Tan",    severity: "Medium" },
  { dt: "2026-06-06 09:00", emoji: "🛡️", module: "QC Pest",         detail: "Dry Store — Gnaw marks on sack corner",                    operator: "Sarah Tan",    severity: "High" },
];

export const shiftSummary = [
  { key: "morning",   label: "MORNING (06–14)",   records: 115, rate: 74, badge: "amber" },
  { key: "afternoon", label: "AFTERNOON (14–22)", records: 2,   rate: 0,  badge: "blue" },
  { key: "night",     label: "NIGHT (22–06)",     records: 0,   rate: 0,  badge: "violet" },
];

export const moduleShiftMatrix = [
  { module: "Water Disp.", morning: 71, afternoon: null, night: null },
  { module: "Black Box",   morning: 71, afternoon: null, night: null },
  { module: "Machine",     morning: 71, afternoon: null, night: null },
  { module: "QC Kitchen",  morning: 76, afternoon: null, night: null },
  { module: "QC Pest",     morning: 88, afternoon: null, night: null },
  { module: "Rubbish",     morning: 89, afternoon: 0,    night: null },
  { module: "Red Tag",     morning: 50, afternoon: null, night: null },
];

export const detailedShift = [
  { module: "Water Disp.", shift: "Morning",   records: 17, completed: 12, rate: 71 },
  { module: "Black Box",   shift: "Morning",   records: 17, completed: 12, rate: 71 },
  { module: "Machine",     shift: "Morning",   records: 17, completed: 12, rate: 71 },
  { module: "QC Kitchen",  shift: "Morning",   records: 17, completed: 13, rate: 76 },
  { module: "QC Pest",     shift: "Morning",   records: 17, completed: 15, rate: 88 },
  { module: "Rubbish",     shift: "Morning",   records: 18, completed: 16, rate: 89 },
  { module: "Rubbish",     shift: "Afternoon", records: 2,  completed: 0,  rate: 0 },
  { module: "Red Tag",     shift: "Morning",   records: 12, completed: 6,  rate: 50 },
];

export const weeklySummary = { records: 117, completed: 86, incidents: 15, avgRate: 74 };

export const heatmap: { module: string; cells: (number | null)[]; week: number }[] = [
  { module: "Water Disp.", cells: [100, 100, null, 100, 67, 75, 60], week: 71 },
  { module: "Black Box",   cells: [100, null, 100, 100, 50, 75, 67], week: 71 },
  { module: "Machine",     cells: [100, null, 100, 100, 50, 75, 67], week: 71 },
  { module: "QC Kitchen",  cells: [100, 100, null, 100, 100, 75, 67], week: 76 },
  { module: "QC Pest",     cells: [100, 100, 100, 100, 100, 75, 80], week: 88 },
  { module: "Rubbish",     cells: [100, 100, 100, 100, 100, 75, 78], week: 80 },
  { module: "Red Tag",     cells: [100, 100, 100, 50, 33, 50, 33],   week: 50 },
];

/* ── Defect & Rework Board ──────────────────────────────────────── */
export const defectStats = { total: 11, open: 3, resolutionRate: 73, resolvedOf: "8 of 11 resolved", reworkRate: 0.0 };

export const defectsPerMonth = [
  { month: "Jan 2025", high: 1, medium: 1, low: 0 },
  { month: "Feb 2025", high: 0, medium: 1, low: 1 },
  { month: "Mar 2025", high: 1, medium: 1, low: 0 },
  { month: "Apr 2025", high: 0, medium: 1, low: 1 },
  { month: "May 2025", high: 1, medium: 2, low: 0 },
];

export const defectLog = [
  { month: "May 2025", description: "Blast chiller door seal leak",          by: "James Oduya",  severity: "High",   status: "Open" },
  { month: "May 2025", description: "Label printer misprints batch codes",   by: "Siti Rahimah", severity: "Medium", status: "Open" },
  { month: "May 2025", description: "Trolley wheel seized",                  by: "Fatimah Bte",  severity: "Medium", status: "Open" },
  { month: "Apr 2025", description: "Glasswasher curtain torn",              by: "Ahmad Faisal", severity: "Medium", status: "Resolved" },
  { month: "Apr 2025", description: "Squeegee blades worn",                  by: "Lim Wei Chen", severity: "Low",    status: "Resolved" },
  { month: "Mar 2025", description: "Sanitiser concentration below spec",    by: "Sarah Tan",    severity: "High",   status: "Resolved" },
  { month: "Mar 2025", description: "Floor drain odour in pot wash",         by: "Ravi Kumar",   severity: "Medium", status: "Resolved" },
  { month: "Feb 2025", description: "Cambro lids mismatched after wash",     by: "James Oduya",  severity: "Medium", status: "Resolved" },
  { month: "Feb 2025", description: "Drying rack overflow on banquet days",  by: "Fatimah Bte",  severity: "Low",    status: "Resolved" },
  { month: "Jan 2025", description: "Dishwasher final rinse below 82°C",     by: "Ahmad Faisal", severity: "High",   status: "Resolved" },
  { month: "Jan 2025", description: "Chemical dosing pump airlock",          by: "Siti Rahimah", severity: "Medium", status: "Resolved" },
];

export const reworkTrend = [
  { month: "Jan 2025", rate: 4.8, items: 6 },
  { month: "Feb 2025", rate: 8.9, items: 11 },
  { month: "Mar 2025", rate: 4.6, items: 6 },
  { month: "Apr 2025", rate: 5.5, items: 8 },
  { month: "May 2025", rate: 2.9, items: 4 },
];

export const reworkLog = [
  { month: "May 2025", rate: "2.9%", volume: "4 / 138 items",  area: "Main Kitchen",     reworkCase: "Grease film on hood filters",                action: "Degreased and re-checked",  prevent: "Weekly filter swap added" },
  { month: "Apr 2025", rate: "5.5%", volume: "8 / 145 items",  area: "Pastry Rack Area", reworkCase: "Cockroach traces found at bamboo steamer rack", action: "Quarantine + deep clean",  prevent: "Pest control frequency increased" },
  { month: "Mar 2025", rate: "4.6%", volume: "6 / 130 items",  area: "Cambro Station",   reworkCase: "1 rework case found at bamboo steamer rack",  action: "Steamer rack re-cleaned",   prevent: "Rack rotation schedule updated" },
  { month: "Feb 2025", rate: "8.9%", volume: "11 / 124 items", area: "Dishwash Area",    reworkCase: "Water spotting on glassware batch",           action: "Full re-wash cycle",        prevent: "Rinse-aid dosage recalibrated" },
  { month: "Jan 2025", rate: "4.8%", volume: "6 / 126 items",  area: "Pot Wash Area",    reworkCase: "Carbon residue found on stock pots",          action: "Re-scrubbed and re-inspected", prevent: "Pre-soak SOP reinforced" },
];

export const triggerAreas = ["Main Kitchen","Banquet Kitchen","Staff Kitchen","Bar Area","Loading Bay","Cold Storage","Dry Store","Dishwash Area","Pot Wash Area","Cambro Station","Machine Room","Other"];

export const sheetTabs = [
  { emoji: "💧", label: "Water Dispenser",  value: "Cambro Water Dispenser Deep Clean", headers: ["Timestamp","Dispenser ID","Operator Name","Cleaning Status","Remarks"] },
  { emoji: "📦", label: "Black Box",        value: "Cambro Black Box Deep Clean",       headers: ["Timestamp","Cambro ID","Operator Name","Cleaning Status","Remarks"] },
  { emoji: "⚙️", label: "Machine Clean",    value: "Machine Deep Clean",                headers: ["Timestamp","Machine ID","Machine Name","Operator Name","Cleaning Status","Remarks"] },
  { emoji: "🔍", label: "QC Kitchen",       value: "5 Minute QC Kitchen Utensils",      headers: ["Timestamp","Area","Inspector Name","Pass/Fail","Findings","Corrective Action"] },
  { emoji: "🛡️", label: "QC Pest Control",  value: "5 Minute QC Pest Control",          headers: ["Timestamp","Area","Inspector Name","Pass/Fail","Findings","Corrective Action"] },
  { emoji: "🗑️", label: "Rubbish Disposal", value: "Rubbish Disposal Timing",           headers: ["Timestamp","Area","Disposal Time","Operator Name","Status","Remarks"] },
  { emoji: "🔴", label: "Red Tag Items",    value: "Red Tag Item Management",           headers: ["Timestamp","Item ID","Item Name","Reason","Reported By","Status","Action Taken"] },
];
