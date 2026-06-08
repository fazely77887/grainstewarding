"use client";

import { StatusPill, Pill, type Tone } from "@/components/ui/pill";
import { Progress, rateText } from "@/components/ui/progress";
import {
  drillTotalRecords, drillTasksCompleted, drillPending, drillCompliance,
  drillQc, drillRedTags, drillMissed, drillDeepClean,
} from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const moduleTone: Record<string, Tone> = {
  "WATER DISP.": "green", "BLACK BOX": "cyan", MACHINE: "blue", "MACHINE DC": "blue",
  "QC KITCHEN": "violet", "QC PEST": "violet", RUBBISH: "orange", "RED TAG": "red",
  "DEEP CLEAN": "blue", QC: "violet",
};

function T({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-separate border-spacing-0">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="table-head sticky top-0 border-b border-line bg-panel px-3 py-2.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[13px]">{children}</tbody>
      </table>
    </div>
  );
}
const td = "border-b border-line-soft px-3 py-2.5 align-middle";

export function TotalRecordsTable() {
  return (
    <T head={["Time", "Module", "Status", "Operator", "Area"]}>
      {drillTotalRecords.map((r, i) => (
        <tr key={i} className="hover:bg-panel-2/60">
          <td className={cn(td, "font-mono text-muted")}>{r.time}</td>
          <td className={td}><Pill tone={moduleTone[r.module] ?? "slate"}>{r.module}</Pill></td>
          <td className={td}><StatusPill status={r.status} /></td>
          <td className={td}>{r.operator}</td>
          <td className={cn(td, "text-muted")}>{r.area}</td>
        </tr>
      ))}
    </T>
  );
}

export function TasksCompletedTable() {
  return (
    <T head={["Date / Time", "Module", "Result", "Operator", "Area"]}>
      {drillTasksCompleted.map((r, i) => (
        <tr key={i} className="hover:bg-panel-2/60">
          <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.dt}</td>
          <td className={td}><Pill tone={moduleTone[r.module] ?? "slate"}>{r.module}</Pill></td>
          <td className={td}><StatusPill status={r.result} /></td>
          <td className={td}>{r.operator}</td>
          <td className={cn(td, "text-muted")}>{r.area}</td>
        </tr>
      ))}
    </T>
  );
}

export function PendingTable() {
  return (
    <T head={["Date / Time", "Module", "Status", "Item ID", "Operator"]}>
      {drillPending.map((r, i) => (
        <tr key={i} className="hover:bg-panel-2/60">
          <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.dt}</td>
          <td className={td}><Pill tone={moduleTone[r.module] ?? "slate"}>{r.module}</Pill></td>
          <td className={td}><StatusPill status={r.status} /></td>
          <td className={cn(td, "font-mono")}>{r.itemId}</td>
          <td className={td}>{r.operator}</td>
        </tr>
      ))}
    </T>
  );
}

export function ComplianceTable() {
  return (
    <T head={["Module", "Total", "Completed", "Pending", "Rate"]}>
      {drillCompliance.map((r) => (
        <tr key={r.module} className="hover:bg-panel-2/60">
          <td className={td}><Pill tone={moduleTone[r.module] ?? "slate"}>{r.module}</Pill></td>
          <td className={cn(td, "font-mono")}>{r.total}</td>
          <td className={cn(td, "font-mono text-emerald-300")}>{r.completed}</td>
          <td className={cn(td, "font-mono text-amber-300")}>{r.pending}</td>
          <td className={cn(td, "min-w-[120px]")}>
            <div className="flex items-center gap-2">
              <Progress value={r.rate} className="w-16" />
              <span className={cn("font-mono text-xs font-bold", rateText(r.rate))}>{r.rate}%</span>
            </div>
          </td>
        </tr>
      ))}
    </T>
  );
}

export function QcTable() {
  return (
    <T head={["Date / Time", "Type", "Area", "Result", "Findings"]}>
      {drillQc.map((r, i) => (
        <tr key={i} className="hover:bg-panel-2/60">
          <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.dt}</td>
          <td className={td}><Pill tone="violet">{r.type}</Pill></td>
          <td className={td}>{r.area}</td>
          <td className={td}><StatusPill status={r.result} /></td>
          <td className={cn(td, "max-w-[200px] truncate text-muted")} title={r.findings}>{r.findings}</td>
        </tr>
      ))}
    </T>
  );
}

export function RedTagTable() {
  return (
    <T head={["Reported", "Item ID", "Item", "Status", "Reported By"]}>
      {drillRedTags.map((r) => (
        <tr key={r.itemId} className="hover:bg-panel-2/60">
          <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.reported}</td>
          <td className={cn(td, "font-mono")}>{r.itemId}</td>
          <td className={td}>{r.name}</td>
          <td className={td}><StatusPill status={r.status} /></td>
          <td className={td}>{r.by}</td>
        </tr>
      ))}
    </T>
  );
}

export function MissedTable() {
  return (
    <T head={["Logged", "Area", "Scheduled", "Status", "Operator"]}>
      {drillMissed.map((r, i) => (
        <tr key={i} className="hover:bg-panel-2/60">
          <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.logged}</td>
          <td className={td}>{r.area}</td>
          <td className={cn(td, "font-mono")}>{r.scheduled}</td>
          <td className={td}><StatusPill status={r.status} /></td>
          <td className={td}>{r.operator}</td>
        </tr>
      ))}
    </T>
  );
}

export function DeepCleanTable() {
  return (
    <T head={["Date / Time", "Type", "Unit ID", "Status", "Operator"]}>
      {drillDeepClean.map((r, i) => (
        <tr key={i} className="hover:bg-panel-2/60">
          <td className={cn(td, "whitespace-nowrap font-mono text-muted")}>{r.dt}</td>
          <td className={td}><Pill tone={moduleTone[r.type] ?? "slate"}>{r.type}</Pill></td>
          <td className={cn(td, "font-mono")}>{r.unitId}</td>
          <td className={td}><StatusPill status={r.status} /></td>
          <td className={td}>{r.operator}</td>
        </tr>
      ))}
    </T>
  );
}
