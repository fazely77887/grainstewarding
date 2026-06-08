"use client";

import { KpiGrid } from "@/components/kpi-grid";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress, rateText } from "@/components/ui/progress";
import { Pill } from "@/components/ui/pill";
import { QcDonut, ModuleCompletionBar } from "@/components/charts";
import { drillCompliance, hero, TODAY_PILL } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const TARGETS = [
  { label: "Compliance Rate", actual: hero.compliance, target: 90 },
  { label: "QC Pass Rate", actual: hero.qcPassRate, target: 95 },
  { label: "Deep Clean Rate", actual: hero.deepCleanRate, target: 85 },
  { label: "Disposal On-Time", actual: 80, target: 95 },
];

export default function KpiDashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-400">Performance</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">KPI Dashboard</h1>
          <p className="mt-1 text-sm font-semibold text-muted">Click any card to drill into the underlying records</p>
        </div>
        <span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>
      </header>

      <KpiGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="KPI vs Target" subtitle="Actual against operational targets" />
          <ul className="divide-y divide-line-soft">
            {TARGETS.map((t) => {
              const hit = t.actual >= t.target;
              return (
                <li key={t.label} className="flex items-center gap-4 px-5 py-4">
                  <span className="w-40 shrink-0 text-sm font-semibold">{t.label}</span>
                  <div className="relative flex-1">
                    <Progress value={t.actual} />
                    <span
                      className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded bg-white/60"
                      style={{ left: `${t.target}%` }}
                      title={`Target ${t.target}%`}
                    />
                  </div>
                  <span className={cn("w-12 shrink-0 text-right font-mono text-sm font-bold tabular-nums", rateText(t.actual))}>{t.actual}%</span>
                  <Pill tone={hit ? "green" : "amber"} className="w-24 justify-center">
                    {hit ? "On target" : `−${t.target - t.actual} pts`}
                  </Pill>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader title="QC Split" subtitle="Pass vs fail" />
          <div className="p-4"><QcDonut /></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Module Completion Rates" subtitle="Per module · last 7 days" />
          <div className="p-4"><ModuleCompletionBar /></div>
        </Card>

        <Card>
          <CardHeader title="Compliance Detail" subtitle="Completed vs pending per module" />
          <ul className="divide-y divide-line-soft">
            {drillCompliance.map((r) => (
              <li key={r.module} className="flex items-center gap-3 px-5 py-3">
                <span className="w-28 shrink-0 text-xs font-bold">{r.module}</span>
                <Progress value={r.rate} className="flex-1" />
                <span className={cn("w-11 shrink-0 text-right font-mono text-xs font-bold", rateText(r.rate))}>{r.rate}%</span>
                <span className="w-14 shrink-0 text-right font-mono text-[11px] text-faint">{r.completed}/{r.total}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
