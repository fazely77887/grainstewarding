"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, Field } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { StatusPill, Pill } from "@/components/ui/pill";
import { StatBox } from "@/components/stat-box";
import { MiniBars } from "@/components/charts";
import { moduleStats, sevenDayCounts, isToday } from "@/lib/kpi";
import { exportCsv, cn } from "@/lib/utils";
import { appendRow } from "@/lib/sheets";
import { OPERATORS, type ModuleConfig } from "@/lib/modules";
import { triggerAreas, TODAY, type ModuleRecord, type Status } from "@/lib/demo-data";
import { useSheetsContext } from "@/components/shell";

const td = "border-b border-line-soft px-4 py-3 align-middle";

const STATUS_OPTIONS: Record<ModuleConfig["kind"], { value: Status; label: string }[]> = {
  cleaning: [
    { value: "completed", label: "Completed" }, { value: "in_progress", label: "In Progress" },
    { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" },
  ],
  qc: [{ value: "pass", label: "Pass" }, { value: "fail", label: "Fail" }],
  disposal: [
    { value: "on_time", label: "On Time" }, { value: "delayed", label: "Delayed" }, { value: "missed", label: "Missed" },
  ],
  redtag: [
    { value: "open", label: "Open" }, { value: "in_progress", label: "In Progress" }, { value: "resolved", label: "Resolved" },
  ],
};

const SHEET_STATUS: Record<Status, string> = {
  completed: "Completed", in_progress: "In Progress", pending: "Pending", failed: "Failed",
  pass: "Pass", fail: "Fail", on_time: "On Time", delayed: "Delayed", missed: "Missed",
  open: "Open", resolved: "Resolved",
};

export function ModulePage({ cfg }: { cfg: ModuleConfig }) {
  const { live, isDemo } = useSheetsContext();
  const [local, setLocal] = useState<ModuleRecord[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const base = live?.[cfg.sheetTab]?.length ? live[cfg.sheetTab] : cfg.demo;
  const records = useMemo(
    () => [...local, ...base].sort((a, b) => b.ts.localeCompare(a.ts)),
    [base, local]
  );

  const stats = moduleStats(cfg, records);
  const trend = sevenDayCounts(records);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (timeFilter === "today" && !isToday(r.ts)) return false;
      if (timeFilter === "7d" && r.ts.slice(0, 10) < "2026-06-01") return false;
      if (!q) return true;
      return [r.unitId, r.unitName, r.operator, r.remarks, r.area, r.inspector, r.findings, r.corrective, r.itemId, r.itemName, r.reason, r.actionTaken]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [records, query, statusFilter, timeFilter]);

  /* ── form state ── */
  const empty = { unitId: "", unitName: "", operator: OPERATORS[0], status: STATUS_OPTIONS[cfg.kind][0].value as Status, remarks: "", area: triggerAreas[0], inspector: OPERATORS[0], findings: "", corrective: "", disposalTime: "06:00", itemId: "", itemName: "", reason: "", actionTaken: "" };
  const [form, setForm] = useState(empty);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    setSaving(true);
    const now = new Date();
    const ts = `${TODAY} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const rec: ModuleRecord = { ts, status: form.status };
    const row: Record<string, string> = { Timestamp: ts };

    if (cfg.kind === "cleaning") {
      rec.unitId = form.unitId; rec.operator = form.operator; rec.remarks = form.remarks;
      if (cfg.key === "machine") { rec.unitName = form.unitName; row["Machine ID"] = form.unitId; row["Machine Name"] = form.unitName; }
      else if (cfg.key === "water") row["Dispenser ID"] = form.unitId;
      else row["Cambro ID"] = form.unitId;
      row["Operator Name"] = form.operator; row["Cleaning Status"] = SHEET_STATUS[form.status]; row["Remarks"] = form.remarks;
    } else if (cfg.kind === "qc") {
      rec.area = form.area; rec.inspector = form.inspector; rec.findings = form.findings; rec.corrective = form.corrective;
      row["Area"] = form.area; row["Inspector Name"] = form.inspector; row["Pass/Fail"] = SHEET_STATUS[form.status];
      row["Findings"] = form.findings; row["Corrective Action"] = form.corrective;
    } else if (cfg.kind === "disposal") {
      rec.area = form.area; rec.disposalTime = form.disposalTime; rec.operator = form.operator; rec.remarks = form.remarks;
      row["Area"] = form.area; row["Disposal Time"] = form.disposalTime; row["Operator Name"] = form.operator;
      row["Status"] = SHEET_STATUS[form.status]; row["Remarks"] = form.remarks;
    } else {
      rec.itemId = form.itemId; rec.itemName = form.itemName; rec.reason = form.reason; rec.operator = form.operator; rec.actionTaken = form.actionTaken;
      row["Item ID"] = form.itemId; row["Item Name"] = form.itemName; row["Reason"] = form.reason;
      row["Reported By"] = form.operator; row["Status"] = SHEET_STATUS[form.status]; row["Action Taken"] = form.actionTaken;
    }

    if (!isDemo) await appendRow(cfg.sheetTab, row);
    setLocal((l) => [rec, ...l]);
    setSaving(false);
    setAddOpen(false);
    setForm(empty);
  }

  function onExport() {
    let headers: string[]; let rows: (string | number)[][];
    if (cfg.kind === "cleaning") {
      headers = ["Timestamp", cfg.unitLabel ?? "Unit ID", ...(cfg.key === "machine" ? ["Machine Name"] : []), "Operator", "Status", "Remarks"];
      rows = filtered.map((r) => [r.ts, r.unitId ?? "", ...(cfg.key === "machine" ? [r.unitName ?? ""] : []), r.operator ?? "", SHEET_STATUS[r.status], r.remarks ?? ""]);
    } else if (cfg.kind === "qc") {
      headers = ["Timestamp", "Area", "Inspector", "Result", "Findings", "Corrective Action"];
      rows = filtered.map((r) => [r.ts, r.area ?? "", r.inspector ?? "", SHEET_STATUS[r.status], r.findings ?? "", r.corrective ?? ""]);
    } else if (cfg.kind === "disposal") {
      headers = ["Timestamp", "Area", "Disposal Time", "Operator", "Status", "Remarks"];
      rows = filtered.map((r) => [r.ts, r.area ?? "", r.disposalTime ?? "", r.operator ?? "", SHEET_STATUS[r.status], r.remarks ?? ""]);
    } else {
      headers = ["Timestamp", "Item ID", "Item Name", "Reason", "Reported By", "Status", "Action Taken"];
      rows = filtered.map((r) => [r.ts, r.itemId ?? "", r.itemName ?? "", r.reason ?? "", r.operator ?? "", SHEET_STATUS[r.status], r.actionTaken ?? ""]);
    }
    exportCsv(cfg.slug, headers, rows);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl text-2xl"
            style={{ height: 52, width: 52, background: `${cfg.accent}1f`, boxShadow: `0 0 0 1px ${cfg.accent}33, 0 12px 30px -12px ${cfg.accent}66` }}
          >
            {cfg.emoji}
          </span>
          <div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">{cfg.title}</h1>
            <p className="mt-0.5 text-sm font-semibold text-muted">
              <span className="font-mono tabular-nums text-ink">{stats.total}</span> total records ·{" "}
              <span className="font-mono tabular-nums text-ink">{stats.today}</span> today
              {isDemo && <span className="text-amber-400"> · Demo data</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" onClick={onExport}><Download size={15} /> Export CSV</Button>
          <Button onClick={() => setAddOpen(true)}><Plus size={15} /> Add Record</Button>
        </div>
      </header>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatBox label="Total" value={stats.total} />
        <StatBox label="Today" value={stats.today} tone="blue" />
        {stats.pills.map((p) => (
          <StatBox key={p.label} label={p.label} value={p.value} tone={p.tone as never} />
        ))}
      </div>

      {/* 7-day trend */}
      <Card>
        <CardHeader title="7-Day Activity Trend" subtitle="Records logged per day" />
        <div className="px-4 pb-3 pt-2"><MiniBars data={trend} accent={cfg.accent} /></div>
      </Card>

      {/* Records */}
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line-soft px-5 py-4">
          <Input placeholder={`Search ${cfg.nav.toLowerCase()} records…`} value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS[cfg.kind].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="w-36">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
          </Select>
          <p className="ml-auto text-xs font-bold text-muted">
            <span className="font-mono tabular-nums text-ink">{filtered.length}</span> records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr>
                {(cfg.kind === "cleaning"
                  ? ["Timestamp", cfg.unitLabel ?? "Unit ID", ...(cfg.key === "machine" ? ["Machine Name"] : []), "Operator", "Status", "Remarks"]
                  : cfg.kind === "qc"
                  ? ["Timestamp", "Area", "Inspector", "Result", "Findings", "Corrective Action"]
                  : cfg.kind === "disposal"
                  ? ["Timestamp", "Area", "Disposal Time", "Operator", "Status", "Remarks"]
                  : ["Timestamp", "Item ID", "Item Name", "Reason", "Reported By", "Status", "Action Taken"]
                ).map((h) => (
                  <th key={h} className="table-head border-b border-line bg-panel-2/60 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {filtered.map((r, i) => (
                <tr key={i} className="transition hover:bg-panel-2/60">
                  <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.ts}</td>
                  {cfg.kind === "cleaning" && (
                    <>
                      <td className={cn(td, "font-mono font-semibold")} style={{ color: cfg.accent }}>{r.unitId}</td>
                      {cfg.key === "machine" && <td className={td}>{r.unitName}</td>}
                      <td className={td}>{r.operator}</td>
                      <td className={td}><StatusPill status={r.status} /></td>
                      <td className={cn(td, "max-w-[260px] truncate text-muted")} title={r.remarks}>{r.remarks || "—"}</td>
                    </>
                  )}
                  {cfg.kind === "qc" && (
                    <>
                      <td className={td}><Pill tone="violet">{r.area}</Pill></td>
                      <td className={td}>{r.inspector}</td>
                      <td className={td}><StatusPill status={r.status} /></td>
                      <td className={cn(td, "max-w-[240px] truncate text-muted")} title={r.findings}>{r.findings || "—"}</td>
                      <td className={cn(td, "max-w-[220px] truncate text-muted")} title={r.corrective}>{r.corrective || "—"}</td>
                    </>
                  )}
                  {cfg.kind === "disposal" && (
                    <>
                      <td className={td}><Pill tone="orange">{r.area}</Pill></td>
                      <td className={cn(td, "font-mono")}>{r.disposalTime}</td>
                      <td className={td}>{r.operator}</td>
                      <td className={td}><StatusPill status={r.status} /></td>
                      <td className={cn(td, "max-w-[260px] truncate text-muted")} title={r.remarks}>{r.remarks || "—"}</td>
                    </>
                  )}
                  {cfg.kind === "redtag" && (
                    <>
                      <td className={cn(td, "font-mono font-semibold text-rose-300")}>{r.itemId}</td>
                      <td className={cn(td, "font-semibold")}>{r.itemName}</td>
                      <td className={cn(td, "max-w-[220px] truncate text-muted")} title={r.reason}>{r.reason}</td>
                      <td className={td}>{r.operator}</td>
                      <td className={td}><StatusPill status={r.status} /></td>
                      <td className={cn(td, "max-w-[200px] truncate text-muted")} title={r.actionTaken}>{r.actionTaken || "—"}</td>
                    </>
                  )}
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-faint">No records match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Record */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title={`Add Record — ${cfg.nav}`} subtitle={isDemo ? "Demo mode: record is kept locally for this session" : `Appends to “${cfg.sheetTab}”`} wide>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cfg.kind === "cleaning" && (
            <>
              <Field label={cfg.unitLabel ?? "Unit ID"}><Input placeholder={cfg.key === "water" ? "WD-001" : cfg.key === "blackbox" ? "CB-001" : "DW-001"} value={form.unitId} onChange={set("unitId")} /></Field>
              {cfg.key === "machine" && <Field label="Machine Name"><Input placeholder="Industrial Dishwasher" value={form.unitName} onChange={set("unitName")} /></Field>}
              <Field label="Operator"><Select value={form.operator} onChange={set("operator")}>{OPERATORS.map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Status"><Select value={form.status} onChange={set("status")}>{STATUS_OPTIONS.cleaning.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></Field>
              <Field label="Remarks" ><Input placeholder="Optional remarks" value={form.remarks} onChange={set("remarks")} /></Field>
            </>
          )}
          {cfg.kind === "qc" && (
            <>
              <Field label="Area"><Select value={form.area} onChange={set("area")}>{triggerAreas.map((a) => <option key={a}>{a}</option>)}</Select></Field>
              <Field label="Inspector"><Select value={form.inspector} onChange={set("inspector")}>{OPERATORS.map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Result"><Select value={form.status} onChange={set("status")}>{STATUS_OPTIONS.qc.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></Field>
              <div className="sm:col-span-2"><Field label="Findings"><Textarea placeholder="What was observed?" value={form.findings} onChange={set("findings")} /></Field></div>
              <div className="sm:col-span-2"><Field label="Corrective Action"><Textarea placeholder="Required if result is Fail" value={form.corrective} onChange={set("corrective")} /></Field></div>
            </>
          )}
          {cfg.kind === "disposal" && (
            <>
              <Field label="Area"><Select value={form.area} onChange={set("area")}>{triggerAreas.map((a) => <option key={a}>{a}</option>)}</Select></Field>
              <Field label="Scheduled Time"><Select value={form.disposalTime} onChange={set("disposalTime")}>{["06:00","10:00","14:00","18:00","22:00"].map((t) => <option key={t}>{t}</option>)}</Select></Field>
              <Field label="Operator"><Select value={form.operator} onChange={set("operator")}>{OPERATORS.map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Status"><Select value={form.status} onChange={set("status")}>{STATUS_OPTIONS.disposal.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></Field>
              <div className="sm:col-span-2"><Field label="Remarks"><Input placeholder="Optional remarks" value={form.remarks} onChange={set("remarks")} /></Field></div>
            </>
          )}
          {cfg.kind === "redtag" && (
            <>
              <Field label="Item ID"><Input placeholder="RT-013" value={form.itemId} onChange={set("itemId")} /></Field>
              <Field label="Item Name"><Input placeholder="Cracked Serving Tray" value={form.itemName} onChange={set("itemName")} /></Field>
              <div className="sm:col-span-2"><Field label="Reason"><Textarea placeholder="Why is this item tagged?" value={form.reason} onChange={set("reason")} /></Field></div>
              <Field label="Reported By"><Select value={form.operator} onChange={set("operator")}>{OPERATORS.map((o) => <option key={o}>{o}</option>)}</Select></Field>
              <Field label="Status"><Select value={form.status} onChange={set("status")}>{STATUS_OPTIONS.redtag.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></Field>
              <div className="sm:col-span-2"><Field label="Action Taken"><Input placeholder="Optional" value={form.actionTaken} onChange={set("actionTaken")} /></Field></div>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save Record"}</Button>
        </div>
      </Dialog>
    </div>
  );
}
