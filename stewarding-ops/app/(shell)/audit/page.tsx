"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { StatBox } from "@/components/stat-box";
import { Pill, StatusPill } from "@/components/ui/pill";
import { Progress, rateText } from "@/components/ui/progress";
import { QcDonut, AreaBars, AreaRadar } from "@/components/charts";
import { kitchenQcRecords, pestQcRecords, areaPerformance, TODAY_PILL } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const td = "border-b border-line-soft px-4 py-3 align-middle";

export default function AuditDashboard() {
  const all = [...kitchenQcRecords, ...pestQcRecords].sort((a, b) => b.ts.localeCompare(a.ts));
  const pass = all.filter((r) => r.status === "pass").length;
  const fail = all.filter((r) => r.status === "fail").length;
  const rate = Math.round((pass / (pass + fail)) * 100);
  const kitchenPass = kitchenQcRecords.filter((r) => r.status === "pass").length;
  const pestPass = pestQcRecords.filter((r) => r.status === "pass").length;
  const fails = all.filter((r) => r.status === "fail");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-violet-400">Quality Assurance</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Audit Dashboard</h1>
          <p className="mt-1 text-sm font-semibold text-muted">5-minute QC inspections — kitchen utensils & pest control</p>
        </div>
        <span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatBox label="Inspections" value={all.length} />
        <StatBox label="Pass" value={pass} tone="green" />
        <StatBox label="Fail" value={fail} tone="red" />
        <StatBox label="Pass Rate" value={`${rate}%`} tone={rate >= 85 ? "green" : "amber"} />
        <StatBox label="Kitchen Rate" value={`${Math.round((kitchenPass / kitchenQcRecords.length) * 100)}%`} tone="violet" />
        <StatBox label="Pest Rate" value={`${Math.round((pestPass / pestQcRecords.length) * 100)}%`} tone="violet" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="QC Split" subtitle="All inspections" />
          <div className="p-4"><QcDonut pass={pass} fail={fail} /></div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="Pass / Fail / Missed by Area" subtitle="Inspection outcomes per area" />
          <div className="p-4"><AreaBars /></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Area Compliance Radar" subtitle="Pass rate per area" />
          <div className="p-4"><AreaRadar /></div>
        </Card>

        <Card>
          <CardHeader title="Fail Findings" subtitle="Open audit observations" right={<Pill tone="red">{fails.length} fails</Pill>} />
          <ul className="divide-y divide-line-soft">
            {fails.map((f, i) => (
              <li key={i} className="px-5 py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="violet">{f.area}</Pill>
                  <StatusPill status="fail" />
                  <span className="ml-auto font-mono text-[11px] text-faint">{f.ts}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold">{f.findings}</p>
                {f.corrective && <p className="mt-0.5 text-xs text-muted">↳ {f.corrective}</p>}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Area Performance Table" subtitle="All QC + disposal outcomes per area" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-separate border-spacing-0">
            <thead>
              <tr>
                {["Area", "Total", "Pass", "Fail", "Missed", "Pass Rate"].map((h) => (
                  <th key={h} className="table-head border-b border-line bg-panel-2/60 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
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
  );
}
