import type { ModuleRecord, Status } from "./demo-data";

/** Raw shape returned by the Apps Script: { "Tab Name": [{Header: value}] } */
export type RawSheets = Record<string, Record<string, string | number>[]>;

const s = (v: unknown) => (v === undefined || v === null ? "" : String(v).trim());

function normStatus(v: string): Status {
  const k = v.toLowerCase().replace(/[\s-]+/g, "_");
  const map: Record<string, Status> = {
    completed: "completed", complete: "completed", done: "completed",
    in_progress: "in_progress", progress: "in_progress",
    pending: "pending", failed: "failed", fail: "fail", pass: "pass",
    on_time: "on_time", ontime: "on_time", delayed: "delayed", late: "delayed",
    missed: "missed", open: "open", resolved: "resolved", close: "resolved", closed: "resolved",
  };
  return map[k] ?? ("pending" as Status);
}

/** Map a sheet tab's rows into the app's ModuleRecord shape. */
export function normaliseTab(tab: string, rows: Record<string, string | number>[]): ModuleRecord[] {
  return rows
    .map((r) => {
      const ts = s(r["Timestamp"]);
      if (!ts) return null;
      const rec: ModuleRecord = { ts, status: "pending" };
      if (tab.includes("Water"))   { rec.unitId = s(r["Dispenser ID"]); rec.operator = s(r["Operator Name"]); rec.status = normStatus(s(r["Cleaning Status"])); rec.remarks = s(r["Remarks"]); }
      else if (tab.includes("Black Box")) { rec.unitId = s(r["Cambro ID"]); rec.operator = s(r["Operator Name"]); rec.status = normStatus(s(r["Cleaning Status"])); rec.remarks = s(r["Remarks"]); }
      else if (tab.includes("Machine"))   { rec.unitId = s(r["Machine ID"]); rec.unitName = s(r["Machine Name"]); rec.operator = s(r["Operator Name"]); rec.status = normStatus(s(r["Cleaning Status"])); rec.remarks = s(r["Remarks"]); }
      else if (tab.includes("QC"))        { rec.area = s(r["Area"]); rec.inspector = s(r["Inspector Name"]); rec.status = normStatus(s(r["Pass/Fail"])); rec.findings = s(r["Findings"]); rec.corrective = s(r["Corrective Action"]); }
      else if (tab.includes("Rubbish"))   { rec.area = s(r["Area"]); rec.disposalTime = s(r["Disposal Time"]); rec.operator = s(r["Operator Name"]); rec.status = normStatus(s(r["Status"])); rec.remarks = s(r["Remarks"]); }
      else if (tab.includes("Red Tag"))   { rec.itemId = s(r["Item ID"]); rec.itemName = s(r["Item Name"]); rec.reason = s(r["Reason"]); rec.operator = s(r["Reported By"]); rec.status = normStatus(s(r["Status"])); rec.actionTaken = s(r["Action Taken"]); }
      return rec;
    })
    .filter(Boolean) as ModuleRecord[];
}

/** Append a record through the server proxy. Resolves false in demo mode. */
export async function appendRow(tab: string, row: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tab, row }),
    });
    const data = await res.json();
    return Boolean(data.ok);
  } catch {
    return false;
  }
}
