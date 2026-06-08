"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download, Plus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select, Textarea, Field } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { StatBox } from "@/components/stat-box";
import { ReworkLine } from "@/components/charts";
import { reworkLog, reworkTrend, triggerAreas, TODAY_PILL } from "@/lib/demo-data";
import { appendRow } from "@/lib/sheets";
import { exportCsv, cn } from "@/lib/utils";
import { useSheetsContext } from "@/components/shell";

const td = "border-b border-line-soft px-4 py-3 align-middle";
type Rework = (typeof reworkLog)[number];

const MONTHS = ["Jan 2025","Feb 2025","Mar 2025","Apr 2025","May 2025","Jun 2025","Jul 2025","Aug 2025","Sep 2025","Oct 2025","Nov 2025","Dec 2025","Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026"];

export default function ReworkBoard() {
  const { isDemo, raw } = useSheetsContext();
  const [local, setLocal] = useState<Rework[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Live rows from the "Rework Tracker" tab (newest first); fall back to demo data.
  const liveRework = useMemo<Rework[]>(() => {
    const src = raw?.["Rework Tracker"];
    if (!src?.length) return [];
    return src
      .map((r) => {
        const total = Number(r["Total Items"]) || 0;
        const items = Number(r["Rework Items"]) || 0;
        const rate = total > 0 ? ((items / total) * 100).toFixed(1) : "0.0";
        return {
          month: String(r["Month"] ?? ""),
          rate: `${rate}%`,
          volume: `${items} / ${total} items`,
          area: String(r["Trigger Area"] ?? ""),
          reworkCase: String(r["Rework Case"] ?? ""),
          action: String(r["Action Taken"] ?? ""),
          prevent: String(r["Prevent Action"] ?? ""),
        };
      })
      .reverse();
  }, [raw]);

  const rows = useMemo(
    () => [...local, ...(liveRework.length ? liveRework : reworkLog)],
    [local, liveRework]
  );

  const latest = rows[0];
  const avg = reworkTrend.reduce((s, r) => s + r.rate, 0) / reworkTrend.length;
  const best = Math.min(...reworkTrend.map((r) => r.rate));
  const totalItems = reworkTrend.reduce((s, r) => s + r.items, 0);

  const [form, setForm] = useState({ month: "Jun 2026", total: "", items: "", area: triggerAreas[0], reworkCase: "", action: "", prevent: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const computedRate = useMemo(() => {
    const t = parseInt(form.total, 10);
    const i = parseInt(form.items, 10);
    if (!t || isNaN(i) || t <= 0 || i < 0) return null;
    return ((i / t) * 100).toFixed(1);
  }, [form.total, form.items]);

  async function submit() {
    setSaving(true);
    if (!isDemo) {
      await appendRow("Rework Tracker", {
        Month: form.month, "Total Items": form.total, "Rework Items": form.items,
        "Trigger Area": form.area, "Rework Case": form.reworkCase, "Action Taken": form.action, "Prevent Action": form.prevent,
      });
    }
    setLocal((l) => [
      { month: form.month, rate: `${computedRate ?? "0.0"}%`, volume: `${form.items || 0} / ${form.total || 0} items`, area: form.area, reworkCase: form.reworkCase, action: form.action, prevent: form.prevent },
      ...l,
    ]);
    setSaving(false);
    setOpen(false);
    setForm({ month: "Jun 2026", total: "", items: "", area: triggerAreas[0], reworkCase: "", action: "", prevent: "" });
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="card relative overflow-hidden bg-gradient-to-br from-[#0d2b22] via-[#0a1c1c] to-[#0a1124] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-400">Quality Control</p>
            <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">Rework Management Board</h1>
            <p className="mt-1 text-sm font-semibold text-muted">Monthly rework rate, trigger areas and CAPA{isDemo && <span className="text-amber-400"> · Demo data</span>}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>
            <Button variant="success" onClick={() => setOpen(true)}><Plus size={15} /> Log Rework</Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox label="Latest Rate" value={latest?.rate ?? "—"} tone={parseFloat(latest?.rate ?? "0") < 5 ? "green" : "amber"} />
        <StatBox label="5-Month Average" value={`${avg.toFixed(1)}%`} tone={avg < 5 ? "green" : "amber"} />
        <StatBox label="Best Month" value={`${best.toFixed(1)}%`} tone="green" />
        <StatBox label="Rework Items YTD" value={totalItems} tone="blue" />
      </div>

      {/* Trend */}
      <Card>
        <CardHeader title="Rework Rate Trend" subtitle="Monthly rework % with item volume" />
        <div className="p-4"><ReworkLine /></div>
      </Card>

      {/* Table */}
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line-soft px-5 py-4">
          <h3 className="card-title">Rework Tracker</h3>
          <p className="text-xs text-faint">Click a row to view actions</p>
          <Button
            variant="outline" size="sm" className="ml-auto"
            onClick={() => exportCsv("rework-tracker", ["Month","Rework Rate","Volume","Trigger Area","Rework Case","Action Taken","Prevent Action"], rows.map((r) => [r.month, r.rate, r.volume, r.area, r.reworkCase, r.action, r.prevent]))}
          >
            <Download size={14} /> CSV
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr>
                {["Month","Rework Rate","Volume","Trigger Area","Rework Case",""].map((h, i) => (
                  <th key={i} className="table-head border-b border-line bg-panel-2/60 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {rows.map((r, i) => {
                const isOpen = expanded === i;
                const rateNum = parseFloat(r.rate);
                return (
                  <FragmentRow key={i}>
                    <tr className="cursor-pointer hover:bg-panel-2/60" onClick={() => setExpanded(isOpen ? null : i)}>
                      <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.month}</td>
                      <td className={td}>
                        <span className={cn("font-mono text-base font-bold tabular-nums", rateNum < 5 ? "text-emerald-300" : "text-amber-300")}>{r.rate}</span>
                      </td>
                      <td className={cn(td, "font-mono text-muted")}>{r.volume}</td>
                      <td className={td}><Pill tone="cyan">{r.area}</Pill></td>
                      <td className={cn(td, "max-w-[280px] truncate font-semibold")} title={r.reworkCase}>{r.reworkCase}</td>
                      <td className={cn(td, "w-10 text-muted")}>
                        <ChevronDown size={16} className={cn("transition", isOpen && "rotate-180")} />
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={6} className="border-b border-line-soft bg-panel-2/40 px-6 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Action Taken</p>
                              <p className="mt-1 text-sm">{r.action || "—"}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Prevent Action</p>
                              <p className="mt-1 text-sm">{r.prevent || "—"}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log rework modal */}
      <Dialog open={open} onClose={() => setOpen(false)} title="Log Rework Record" subtitle={isDemo ? "Demo mode: kept locally for this session" : "Appends to the “Rework Tracker” sheet"} wide>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Month"><Select value={form.month} onChange={set("month")}>{MONTHS.map((m) => <option key={m}>{m}</option>)}</Select></Field>
          <Field label="Trigger Area"><Select value={form.area} onChange={set("area")}>{triggerAreas.map((a) => <option key={a}>{a}</option>)}</Select></Field>
          <Field label="Total Items"><Input type="number" min={0} placeholder="138" value={form.total} onChange={set("total")} /></Field>
          <Field label="Rework Items"><Input type="number" min={0} placeholder="4" value={form.items} onChange={set("items")} /></Field>
          <div className="sm:col-span-2 rounded-xl border border-line bg-panel-2 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-faint">Computed Rework Rate</p>
            <p className={cn("mt-0.5 font-mono text-2xl font-bold tabular-nums", computedRate === null ? "text-faint" : parseFloat(computedRate) < 5 ? "text-emerald-300" : "text-amber-300")}>
              {computedRate === null ? "—" : `${computedRate}%`}
            </p>
          </div>
          <div className="sm:col-span-2"><Field label="Rework Case"><Textarea placeholder="What was found?" value={form.reworkCase} onChange={set("reworkCase")} /></Field></div>
          <div className="sm:col-span-2"><Field label="Action Taken"><Input placeholder="Immediate correction" value={form.action} onChange={set("action")} /></Field></div>
          <div className="sm:col-span-2"><Field label="Prevent Action"><Input placeholder="How will recurrence be prevented?" value={form.prevent} onChange={set("prevent")} /></Field></div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="success" onClick={submit} disabled={saving || computedRate === null}>{saving ? "Saving…" : "Log Rework"}</Button>
        </div>
      </Dialog>
    </div>
  );
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
