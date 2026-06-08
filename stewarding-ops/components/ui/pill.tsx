import { cn } from "@/lib/utils";
import type { Status } from "@/lib/demo-data";

export type Tone = "green" | "amber" | "red" | "blue" | "slate" | "violet" | "orange" | "cyan";

export const toneClass: Record<Tone, string> = {
  green:  "bg-emerald-500/12 text-emerald-300 ring-emerald-400/25",
  amber:  "bg-amber-500/12 text-amber-300 ring-amber-400/25",
  red:    "bg-rose-500/12 text-rose-300 ring-rose-400/30",
  blue:   "bg-sky-500/12 text-sky-300 ring-sky-400/25",
  slate:  "bg-slate-500/15 text-slate-300 ring-slate-400/25",
  violet: "bg-violet-500/12 text-violet-300 ring-violet-400/25",
  orange: "bg-orange-500/12 text-orange-300 ring-orange-400/25",
  cyan:   "bg-cyan-500/12 text-cyan-300 ring-cyan-400/25",
};

export function Pill({ tone = "slate", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1", toneClass[tone], className)}>
      {children}
    </span>
  );
}

const statusTone: Record<string, Tone> = {
  completed: "green", pass: "green", on_time: "green", resolved: "green",
  in_progress: "amber", delayed: "amber",
  pending: "slate",
  failed: "red", fail: "red", missed: "red", open: "red",
};

const statusLabel: Record<string, string> = {
  completed: "Completed", in_progress: "In Progress", pending: "Pending", failed: "Failed",
  pass: "Pass", fail: "Fail", on_time: "On Time", delayed: "Delayed", missed: "Missed",
  open: "Open", resolved: "Resolved",
};

export function StatusPill({ status }: { status: Status | string }) {
  return <Pill tone={statusTone[status] ?? "slate"}>{statusLabel[status] ?? status}</Pill>;
}

export function SeverityPill({ severity }: { severity: string }) {
  const t: Tone = severity === "High" ? "red" : severity === "Medium" ? "amber" : "blue";
  return <Pill tone={t}>{severity}</Pill>;
}
