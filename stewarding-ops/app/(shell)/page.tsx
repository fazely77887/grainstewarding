"use client";

import Link from "next/link";
import { HeroBanner } from "@/components/hero-banner";
import { KpiGrid } from "@/components/kpi-grid";
import { Card, CardHeader } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Progress, rateText } from "@/components/ui/progress";
import { ModuleCompletionBar, QcDonut, Trend7d } from "@/components/charts";
import { IncidentFeed } from "@/components/incident-feed";
import { moduleCompletion, incidents, TODAY_PILL } from "@/lib/demo-data";
import { useSheetsContext } from "@/components/shell";
import { cn } from "@/lib/utils";

export default function ExecutiveDashboard() {
  const { isDemo } = useSheetsContext();

  return (
    <div className="space-y-6">
      <HeroBanner isDemo={isDemo} />

      <KpiGrid />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Module Completion Rates" subtitle="Completion % per module · last 7 days" />
          <div className="p-4"><ModuleCompletionBar /></div>
        </Card>
        <Card>
          <CardHeader title="QC Split" subtitle="Pass vs fail · all QC inspections" />
          <div className="p-4"><QcDonut /></div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="7-Day Activity Trend"
          subtitle="Records logged vs completion rate"
          right={<span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>}
        />
        <div className="p-4"><Trend7d /></div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Module Status" subtitle="Completion rate per module" />
          <ul className="divide-y divide-line-soft">
            {moduleCompletion.map((m) => (
              <li key={m.key} className="flex items-center gap-4 px-5 py-3.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.color }} />
                <span className="w-28 shrink-0 text-sm font-semibold">{m.label}</span>
                <Progress value={m.value} color={m.color} className="flex-1" />
                <span className={cn("w-12 shrink-0 text-right font-mono text-sm font-bold tabular-nums", rateText(m.value))}>{m.value}%</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Recent Incidents"
            subtitle="Fails, misses & red tags"
            right={<Pill tone="red">{incidents.length} open</Pill>}
          />
          <IncidentFeed />
          <div className="border-t border-line-soft px-5 py-3 text-right">
            <Link href="/reports" className="text-xs font-bold text-accent hover:underline">View all in Reports →</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
