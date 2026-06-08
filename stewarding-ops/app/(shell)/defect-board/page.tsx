"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select, Textarea, Field } from "@/components/ui/input";
import { Pill, SeverityPill } from "@/components/ui/pill";
import { StatBox } from "@/components/stat-box";
import { DefectsStacked } from "@/components/charts";
import { defectLog, defectStats, TODAY_PILL } from "@/lib/demo-data";
import { OPERATORS } from "@/lib/modules";
import { appendRow } from "@/lib/sheets";
import { exportCsv, cn } from "@/lib/utils";
import { useSheetsContext } from "@/components/shell";

const td = "border-b border-line-soft px-4 py-3 align-middle";
type Defect = (typeof defectLog)[number];

const MONTHS = ["Jan 2025","Feb 2025","Mar 2025","Apr 2025","May 2025","Jun 2025","Jul 2025","Aug 2025","Sep 2025","Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026"];

export default function DefectBoard() {
  const { isDemo, raw } = useSheetsContext();
  const [local, setLocal] = useState<Defect[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sevFilter, setSevFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Live rows from the "Defect Log" tab (newest first); fall back to demo data.
  const liveDefects = useMemo<Defect[]>(() => {
    const rows = raw?.["Defect Log"];
    if (!rows?.length) return [];
    return rows
      .map((r) => ({
        month: String(r["Month"] ?? ""),
        description: String(r["Description"] ?? ""),
        by: String(r["Reported By"] ?? ""),
        severity: String(r["Severity"] ?? "Medium"),
        status: String(r["Status"] ?? "Open"),
      }))
      .reverse();
  }, [raw]);

  const all = useMemo(
    () => [...local, ...(liveDefects.length ? liveDefects : defectLog)],
    [local, liveDefects]
  );
  const rows = all.filter(
    (d) => (sevFilter === "all" || d.severity === sevFilter) && (statusFilter === "all" || d.status === statusFilter)
  );

  const openCount = all.filter((d) => d.status === "Open").length;
  const resolved = all.length - openCount;
  const resolution = all.length ? Math.round((resolved / all.length) * 100) : 0;

  const [form, setForm] = useState({ month: "Jun 2026", severity: "Medium", by: OPERATORS[0], description: "", action: "", prevent: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    setSaving(true);
    if (!isDemo) {
      await appendRow("Defect Log", {
        Month: form.month, Severity: form.severity, "Reported By": form.by,
        Description: form.description, "Action Taken": form.action, "Preventive Action": form.prevent, Status: "Open",
      });
    }
    setLocal((l) => [{ month: form.month, description: form.description, by: form.by, severity: form.severity, status: "Open" }, ...l]);
    setSaving(false);
    setOpen(false);
    setForm({ month: "Jun 2026", severity: "Medium", by: OPERATORS[0], description: "", action: "", prevent: "" });
  }

  return (
    <div className="space-y-6">
      {/* Red hero */}
      <section className="card relative overflow-hidden bg-gradient-to-br from-[#3f0d1d] via-[#2a0a18] to-[#0a1124] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-rose-400">Quality Control</p>
            <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">Defect Tracking Board</h1>
            <p className="mt-1 text-sm font-semibold text-muted">Monthly defect log with severity, ownership and CAPA{isDemo && <span className="text-amber-400"> · Demo data</span>}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>
            <Button variant="danger" onClick={() => setOpen(true)}><Plus size={15} /> Log Defect</Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox label="Total Defects" value={all.length} />
        <div className="card border-rose-500/30 px-4 py-3.5 shadow-[0_0_0_1px_rgba(244,63,94,0.15)]">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-rose-400">Open Defects</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-rose-300">{openCount}</p>
        </div>
        <div className="card px-4 py-3.5">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-faint">Resolution Rate</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-emerald-300">{resolution}%</p>
          <p className="text-[11px] font-semibold text-faint">{resolved} of {all.length} resolved</p>
        </div>
        <StatBox label="Latest Rework Rate" value={`${defectStats.reworkRate.toFixed(1)}%`} tone="green" />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader title="Defects per Month" subtitle="Stacked by severity" />
        <div className="p-4"><DefectsStacked /></div>
      </Card>

      {/* Table */}
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line-soft px-5 py-4">
          <h3 className="card-title">Defect Log</h3>
          <div className="ml-auto flex flex-wrap items-center gap-2.5">
            <Select value={sevFilter} onChange={(e) => setSevFilter(e.target.value)} className="w-36">
              <option value="all">All Severities</option><option>High</option><option>Medium</option><option>Low</option>
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36">
              <option value="all">All Statuses</option><option>Open</option><option>Resolved</option>
            </Select>
            <Button
              variant="outline" size="sm"
              onClick={() => exportCsv("defect-log", ["Month","Description","Reported By","Severity","Status"], rows.map((d) => [d.month, d.description, d.by, d.severity, d.status]))}
            >
              <Download size={14} /> CSV
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0">
            <thead>
              <tr>
                {["Month","Description","Reported By","Severity","Status"].map((h) => (
                  <th key={h} className="table-head border-b border-line bg-panel-2/60 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {rows.map((d, i) => (
                <tr key={i} className="hover:bg-panel-2/60">
                  <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{d.month}</td>
                  <td className={cn(td, "font-semibold")}>{d.description}</td>
                  <td className={td}>{d.by}</td>
                  <td className={td}><SeverityPill severity={d.severity} /></td>
                  <td className={td}><Pill tone={d.status === "Open" ? "red" : "green"}>{d.status}</Pill></td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-faint">No defects match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log defect modal */}
      <Dialog open={open} onClose={() => setOpen(false)} title="Log New Defect" subtitle={isDemo ? "Demo mode: kept locally for this session" : "Appends to the “Defect Log” sheet"} wide>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Month"><Select value={form.month} onChange={set("month")}>{MONTHS.map((m) => <option key={m}>{m}</option>)}</Select></Field>
          <Field label="Severity"><Select value={form.severity} onChange={set("severity")}><option>High</option><option>Medium</option><option>Low</option></Select></Field>
          <Field label="Reported By"><Select value={form.by} onChange={set("by")}>{OPERATORS.map((o) => <option key={o}>{o}</option>)}</Select></Field>
          <div className="sm:col-span-2"><Field label="Description"><Textarea placeholder="What went wrong?" value={form.description} onChange={set("description")} /></Field></div>
          <div className="sm:col-span-2"><Field label="Action Taken"><Input placeholder="Immediate correction" value={form.action} onChange={set("action")} /></Field></div>
          <div className="sm:col-span-2"><Field label="Preventive Action"><Input placeholder="How will recurrence be prevented?" value={form.prevent} onChange={set("prevent")} /></Field></div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={submit} disabled={saving || !form.description}>{saving ? "Saving…" : "Log Defect"}</Button>
        </div>
      </Dialog>
    </div>
  );
}
