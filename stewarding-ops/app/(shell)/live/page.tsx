"use client";

import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { StatBox } from "@/components/stat-box";
import { Pill, StatusPill, type Tone } from "@/components/ui/pill";
import { Progress, rateText } from "@/components/ui/progress";
import { IncidentFeed } from "@/components/incident-feed";
import { drillTotalRecords, hero, moduleCompletion, shiftSummary, TODAY_PILL } from "@/lib/demo-data";
import { MODULES } from "@/lib/modules";
import { useSheetsContext } from "@/components/shell";
import { moduleStats } from "@/lib/kpi";
import { cn } from "@/lib/utils";

const moduleTone: Record<string, Tone> = {
  "WATER DISP.": "green", "BLACK BOX": "cyan", MACHINE: "blue",
  "QC KITCHEN": "violet", "QC PEST": "violet", RUBBISH: "orange", "RED TAG": "red",
};

export default function LiveOperations() {
  const { live, isDemo } = useSheetsContext();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-400">
            <span className="mr-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 align-middle" />
            Live Operations
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Today on the Floor</h1>
          <p className="mt-1 text-sm font-semibold text-muted">
            Auto-refreshes every 60 seconds{isDemo && <span className="text-amber-400"> · Demo data</span>}
          </p>
        </div>
        <span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>
      </header>

      {/* Today stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Records Today" value={hero.recordsToday} tone="blue" />
        <StatBox label="Completed" value={26} tone="green" />
        <StatBox label="Incidents Today" value={6} tone="red" />
        <StatBox label="Today's Rate" value="65%" tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Activity feed */}
        <Card className="xl:col-span-2">
          <CardHeader title="Live Activity Feed" subtitle="Latest records across all modules · today" right={<Pill tone="green">● Streaming</Pill>} />
          <ul className="divide-y divide-line-soft">
            {drillTotalRecords.map((r, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-12 shrink-0 font-mono text-sm font-bold tabular-nums text-muted">{r.time}</span>
                <Pill tone={moduleTone[r.module] ?? "slate"} className="w-28 justify-center">{r.module}</Pill>
                <StatusPill status={r.status} />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{r.operator !== "—" ? r.operator : r.area}</span>
                <span className="hidden text-xs text-faint sm:inline">{r.area !== "—" ? r.area : ""}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Shift + module status */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Shift Activity" subtitle="Records per shift · today" />
            <ul className="divide-y divide-line-soft">
              {shiftSummary.map((s) => (
                <li key={s.key} className="flex items-center justify-between px-5 py-3.5">
                  <Pill tone={s.badge as Tone}>{s.label}</Pill>
                  <p className="text-sm font-semibold text-muted">
                    <span className="font-mono text-base font-bold tabular-nums text-ink">{s.records}</span> records ·{" "}
                    <span className={cn("font-mono font-bold", rateText(s.rate))}>{s.rate}%</span>
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Module Status" subtitle="Live completion rates" />
            <ul className="divide-y divide-line-soft">
              {moduleCompletion.map((m) => (
                <li key={m.key} className="flex items-center gap-3 px-5 py-3">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: m.color }} />
                  <span className="w-24 shrink-0 text-xs font-bold">{m.label}</span>
                  <Progress value={m.value} color={m.color} className="flex-1" />
                  <span className={cn("w-11 shrink-0 text-right font-mono text-xs font-bold", rateText(m.value))}>{m.value}%</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Module quick-launch */}
      <Card>
        <CardHeader title="Modules" subtitle="Jump into a module to log or review records" />
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-7">
          {MODULES.map((m) => {
            const stats = moduleStats(m, live?.[m.sheetTab]?.length ? live[m.sheetTab] : m.demo);
            return (
              <Link
                key={m.slug}
                href={`/modules/${m.slug}`}
                className="group rounded-2xl border border-line bg-panel-2 p-4 text-center transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-pop"
              >
                <span className="text-2xl">{m.emoji}</span>
                <p className="mt-2 text-xs font-bold leading-tight">{m.nav}</p>
                <p className="mt-1 font-mono text-[11px] font-semibold text-faint">
                  {stats.today} today · <span className={rateText(stats.rate)}>{stats.rate}%</span>
                </p>
              </Link>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Open Incidents" subtitle="Requires attention" right={<Pill tone="red">8 open</Pill>} />
        <IncidentFeed limit={6} />
      </Card>
    </div>
  );
}
