"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Pill, SeverityPill, type Tone } from "@/components/ui/pill";
import { Progress, rateColor, rateText } from "@/components/ui/progress";
import { StatBox } from "@/components/stat-box";
import {
  RecordsByModuleBar, ModuleCompletionBar, Trend7d, OperatorChart,
  AreaBars, AreaRadar, ShiftBars, WeeklyCombo,
} from "@/components/charts";
import {
  moduleSummary, statusBreakdown, operators, areaPerformance,
  incidentSummary, incidentLog, shiftSummary, moduleShiftMatrix, detailedShift,
  weeklySummary, dailyBreakdown, heatmap, weekDays, TODAY_PILL,
} from "@/lib/demo-data";
import { exportCsv, cn } from "@/lib/utils";

const td = "border-b border-line-soft px-4 py-3 align-middle";
const th = "table-head border-b border-line bg-panel-2/60 px-4 py-3";
const TABS = ["Overview", "Operator", "Area", "Incidents", "Shift", "Weekly"];

function HeatCell({ v }: { v: number | null }) {
  if (v === null) return <span className="text-faint">—</span>;
  const tone = v >= 85 ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25" : v >= 65 ? "bg-amber-500/15 text-amber-300 ring-amber-400/25" : "bg-rose-500/15 text-rose-300 ring-rose-400/30";
  return <span className={cn("inline-block min-w-[46px] rounded-lg px-2 py-1 text-center font-mono text-xs font-bold tabular-nums ring-1", tone)}>{v}%</span>;
}

export default function ReportsPage() {
  const [tab, setTab] = useState("Overview");
  const [range, setRange] = useState("7d");

  function exportAll() {
    exportCsv("module-summary", ["Module","Records","Today","Completion %"], moduleSummary.map((m) => [m.name, m.records, m.today, m.rate]));
    exportCsv("operator-rankings", ["Rank","Operator","Tasks","Completed","Fails","Rate %"], operators.map((o) => [o.rank, o.name, o.tasks, o.done, o.fail, o.rate]));
    exportCsv("area-performance", ["Area","Total","Pass","Fail","Missed","Rate %"], areaPerformance.map((a) => [a.area, a.total, a.pass, a.fail, a.missed, a.rate]));
    exportCsv("incident-log", ["Date","Module","Detail","Operator","Severity"], incidentLog.map((i) => [i.dt, i.module, i.detail, i.operator, i.severity]));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-400">Insight</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Reports &amp; Analytics</h1>
          <p className="mt-1 text-sm font-semibold text-muted">Operational performance across modules, operators, areas, shifts and weeks</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-40">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="month">This Month</option>
          </Select>
          <Button variant="outline" onClick={exportAll}><Download size={15} /> Export All</Button>
        </div>
      </header>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {/* ════════ OVERVIEW ════════ */}
      {tab === "Overview" && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Module Summary" subtitle="Records and completion per module" right={<span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0">
                <thead><tr>{["Module","Records","Today","Completion","Rate","Trend",""].map((h, i) => <th key={i} className={th}>{h}</th>)}</tr></thead>
                <tbody className="text-[13px]">
                  {moduleSummary.map((m) => (
                    <tr key={m.slug} className="hover:bg-panel-2/60">
                      <td className={cn(td, "font-semibold")}>
                        <Link href={`/modules/${m.slug}`} className="flex items-center gap-2 hover:text-accent">
                          <span className="text-base">{m.emoji}</span>{m.name}
                        </Link>
                      </td>
                      <td className={cn(td, "font-mono")}>{m.records}</td>
                      <td className={cn(td, "font-mono text-sky-300")}>{m.today}</td>
                      <td className={cn(td, "min-w-[140px]")}><Progress value={m.rate} color={rateColor(m.rate)} /></td>
                      <td className={cn(td, "font-mono font-bold", rateText(m.rate))}>{m.rate}%</td>
                      <td className={td}>
                        <span className={cn("font-mono text-sm font-bold", m.trend === "up" ? "text-emerald-300" : m.trend === "down" ? "text-rose-300" : "text-amber-300")}>
                          {m.trend === "up" ? "↗" : m.trend === "down" ? "↘" : "→"}
                        </span>
                      </td>
                      <td className={cn(td, "w-12 text-right")}>
                        <button
                          className="text-muted transition hover:text-accent"
                          title="Export module CSV"
                          onClick={() => exportCsv(m.slug, ["Module","Records","Today","Rate %"], [[m.name, m.records, m.today, m.rate]])}
                        >
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card><CardHeader title="Records by Module" subtitle="Total records · last 7 days" /><div className="p-4"><RecordsByModuleBar /></div></Card>
            <Card><CardHeader title="Completion Rates" subtitle="Per module" /><div className="p-4"><ModuleCompletionBar /></div></Card>
          </div>

          <Card><CardHeader title="Daily Activity Trend" subtitle="Records vs completion rate" /><div className="p-4"><Trend7d /></div></Card>

          <div>
            <h3 className="card-title mb-3">Status Breakdown by Module</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statusBreakdown.map((m) => (
                <Card key={m.name} className="p-4">
                  <p className="flex items-center gap-2 text-sm font-bold"><span className="text-base">{m.emoji}</span>{m.name}</p>
                  <ul className="mt-3 space-y-1.5">
                    {m.rows.map(([label, n]) => (
                      <li key={label} className="flex items-center justify-between text-xs">
                        <span className="text-muted">{label}</span>
                        <span className="font-mono font-bold tabular-nums">{n}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════ OPERATOR ════════ */}
      {tab === "Operator" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {operators.slice(0, 3).map((o, i) => (
              <Card key={o.name} className={cn("relative overflow-hidden p-5", i === 0 && "border-amber-400/30")}>
                <span className="absolute right-4 top-4 text-3xl">{["🥇","🥈","🥉"][i]}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-faint">Rank #{o.rank}</p>
                <p className="mt-1 text-lg font-extrabold">{o.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-faint" title={o.modules}>{o.modules}</p>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-sm text-muted"><span className="font-mono text-xl font-bold tabular-nums text-ink">{o.done}</span>/{o.tasks} tasks</p>
                  <p className={cn("font-mono text-2xl font-bold tabular-nums", rateText(o.rate))}>{o.rate}%</p>
                </div>
                <Progress value={o.rate} className="mt-2.5" />
              </Card>
            ))}
          </div>

          <Card><CardHeader title="Operator Performance" subtitle="Tasks vs completed with rate overlay" /><div className="p-4"><OperatorChart /></div></Card>

          <Card>
            <CardHeader
              title="Full Operator Rankings"
              right={<Button variant="outline" size="sm" onClick={() => exportCsv("operator-rankings", ["Rank","Operator","Modules","Tasks","Completed","Fails","Rate %"], operators.map((o) => [o.rank, o.name, o.modules, o.tasks, o.done, o.fail, o.rate]))}><Download size={14} /> CSV</Button>}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0">
                <thead><tr>{["Rank","Operator","Modules","Tasks","Completed","Fails","Rate"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody className="text-[13px]">
                  {operators.map((o) => (
                    <tr key={o.name} className="hover:bg-panel-2/60">
                      <td className={cn(td, "font-mono font-bold")}>#{o.rank}</td>
                      <td className={cn(td, "font-semibold")}>{o.name}</td>
                      <td className={cn(td, "max-w-[260px] truncate text-xs text-muted")} title={o.modules}>{o.modules}</td>
                      <td className={cn(td, "font-mono")}>{o.tasks}</td>
                      <td className={cn(td, "font-mono text-emerald-300")}>{o.done}</td>
                      <td className={cn(td, "font-mono text-rose-300")}>{o.fail}</td>
                      <td className={cn(td, "min-w-[150px]")}>
                        <div className="flex items-center gap-2">
                          <Progress value={o.rate} className="w-20" />
                          <span className={cn("font-mono text-xs font-bold", rateText(o.rate))}>{o.rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ════════ AREA ════════ */}
      {tab === "Area" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card><CardHeader title="Pass / Fail / Missed by Area" /><div className="p-4"><AreaBars /></div></Card>
            <Card><CardHeader title="Area Compliance Radar" subtitle="Pass rate per area" /><div className="p-4"><AreaRadar /></div></Card>
          </div>

          <Card>
            <CardHeader
              title="Area Performance Table"
              right={<Button variant="outline" size="sm" onClick={() => exportCsv("area-performance", ["Area","Total","Pass","Fail","Missed","Rate %"], areaPerformance.map((a) => [a.area, a.total, a.pass, a.fail, a.missed, a.rate]))}><Download size={14} /> CSV</Button>}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-separate border-spacing-0">
                <thead><tr>{["Area","Total","Pass","Fail","Missed","Pass Rate"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody className="text-[13px]">
                  {areaPerformance.map((a) => (
                    <tr key={a.area} className="hover:bg-panel-2/60">
                      <td className={cn(td, "font-semibold")}>{a.area}</td>
                      <td className={cn(td, "font-mono")}>{a.total}</td>
                      <td className={cn(td, "font-mono text-emerald-300")}>{a.pass}</td>
                      <td className={cn(td, "font-mono text-rose-300")}>{a.fail}</td>
                      <td className={cn(td, "font-mono text-amber-300")}>{a.missed}</td>
                      <td className={cn(td, "min-w-[150px]")}>
                        <div className="flex items-center gap-2">
                          <Progress value={a.rate} className="w-20" />
                          <span className={cn("font-mono text-xs font-bold", rateText(a.rate))}>{a.rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ════════ INCIDENTS ════════ */}
      {tab === "Incidents" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatBox label="Total Incidents" value={incidentSummary.total} />
            <StatBox label="High Severity" value={incidentSummary.high} tone="red" />
            <StatBox label="Medium Severity" value={incidentSummary.medium} tone="amber" />
            <StatBox label="Open Red Tags" value={incidentSummary.openRedTags} tone="red" />
          </div>

          <Card>
            <CardHeader
              title="Incident Log"
              subtitle="All fails, misses and red tags · last 7 days"
              right={<Button variant="outline" size="sm" onClick={() => exportCsv("incident-log", ["Date","Module","Detail","Operator","Severity"], incidentLog.map((i) => [i.dt, i.module, i.detail, i.operator, i.severity]))}><Download size={14} /> CSV</Button>}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-separate border-spacing-0">
                <thead><tr>{["Date / Time","Module","Detail","Operator","Severity"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody className="text-[13px]">
                  {incidentLog.map((i, idx) => (
                    <tr key={idx} className="hover:bg-panel-2/60">
                      <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{i.dt}</td>
                      <td className={td}><span className="mr-1.5">{i.emoji}</span><span className="text-xs font-bold">{i.module}</span></td>
                      <td className={cn(td, "max-w-[360px] truncate font-semibold")} title={i.detail}>{i.detail}</td>
                      <td className={td}>{i.operator}</td>
                      <td className={td}><SeverityPill severity={i.severity} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ════════ SHIFT ════════ */}
      {tab === "Shift" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {shiftSummary.map((s) => (
              <Card key={s.key} className="p-5">
                <Pill tone={s.badge as Tone}>{s.label}</Pill>
                <p className="mt-3 font-mono text-3xl font-bold tabular-nums">{s.records}</p>
                <p className="text-xs font-semibold text-faint">records</p>
                <div className="mt-3 flex items-center gap-2">
                  <Progress value={s.rate} className="flex-1" />
                  <span className={cn("font-mono text-sm font-bold", rateText(s.rate))}>{s.rate}%</span>
                </div>
              </Card>
            ))}
          </div>

          <Card><CardHeader title="Total Records by Shift" /><div className="p-4"><ShiftBars /></div></Card>

          <Card>
            <CardHeader title="Completion Rate by Module × Shift" subtitle="— means no records in that shift" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-separate border-spacing-0">
                <thead><tr>{["Module","Morning","Afternoon","Night"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody className="text-[13px]">
                  {moduleShiftMatrix.map((m) => (
                    <tr key={m.module} className="hover:bg-panel-2/60">
                      <td className={cn(td, "font-semibold")}>{m.module}</td>
                      <td className={td}><HeatCell v={m.morning} /></td>
                      <td className={td}><HeatCell v={m.afternoon} /></td>
                      <td className={td}><HeatCell v={m.night} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Detailed Shift Breakdown"
              right={<Button variant="outline" size="sm" onClick={() => exportCsv("shift-breakdown", ["Module","Shift","Records","Completed","Rate %"], detailedShift.map((d) => [d.module, d.shift, d.records, d.completed, d.rate]))}><Download size={14} /> CSV</Button>}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-separate border-spacing-0">
                <thead><tr>{["Module","Shift","Records","Completed","Rate"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody className="text-[13px]">
                  {detailedShift.map((d, i) => (
                    <tr key={i} className="hover:bg-panel-2/60">
                      <td className={cn(td, "font-semibold")}>{d.module}</td>
                      <td className={td}><Pill tone={d.shift === "Morning" ? "amber" : d.shift === "Afternoon" ? "blue" : "violet"}>{d.shift}</Pill></td>
                      <td className={cn(td, "font-mono")}>{d.records}</td>
                      <td className={cn(td, "font-mono text-emerald-300")}>{d.completed}</td>
                      <td className={cn(td, "font-mono font-bold", rateText(d.rate))}>{d.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ════════ WEEKLY ════════ */}
      {tab === "Weekly" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatBox label="Weekly Records" value={weeklySummary.records} tone="blue" />
            <StatBox label="Completed" value={weeklySummary.completed} tone="green" />
            <StatBox label="Incidents" value={weeklySummary.incidents} tone="red" />
            <StatBox label="Avg Completion" value={`${weeklySummary.avgRate}%`} tone="amber" />
          </div>

          <Card><CardHeader title="Daily Records vs Completion Rate" /><div className="p-4"><WeeklyCombo /></div></Card>

          <Card>
            <CardHeader title="Daily Breakdown" subtitle="Mon 1 – Sun 7 June 2026" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-0">
                <thead><tr>{["Day","Records","Completed","Incidents","Rate"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
                <tbody className="text-[13px]">
                  {dailyBreakdown.map((d, i) => (
                    <tr key={d.day} className="hover:bg-panel-2/60">
                      <td className={cn(td, "font-semibold")}>
                        {d.day}
                        {i === dailyBreakdown.length - 1 && <Pill tone="blue" className="ml-2">Today</Pill>}
                      </td>
                      <td className={cn(td, "font-mono")}>{d.total}</td>
                      <td className={cn(td, "font-mono text-emerald-300")}>{d.completed}</td>
                      <td className={cn(td, "font-mono", d.incidents ? "text-rose-300" : "text-faint")}>{d.incidents}</td>
                      <td className={cn(td, "font-mono font-bold", rateText(d.rate))}>{d.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="Module × Day Heatmap" subtitle="Completion % · — means no records" />
            <div className="overflow-x-auto p-4">
              <table className="w-full min-w-[760px] border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="table-head px-2 py-2 text-left">Module</th>
                    {weekDays.map((d) => <th key={d} className="table-head px-2 py-2 text-center">{d}</th>)}
                    <th className="table-head px-2 py-2 text-center">7-Day</th>
                  </tr>
                </thead>
                <tbody>
                  {heatmap.map((row) => (
                    <tr key={row.module}>
                      <td className="px-2 py-1.5 text-[13px] font-semibold">{row.module}</td>
                      {row.cells.map((v, i) => <td key={i} className="px-1 py-1.5 text-center"><HeatCell v={v} /></td>)}
                      <td className="px-1 py-1.5 text-center"><HeatCell v={row.week} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
