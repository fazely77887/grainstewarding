"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type KpiGradient =
  | "blue" | "green" | "orange" | "purple" | "cyan" | "red" | "pink" | "slate";

const gradients: Record<KpiGradient, string> = {
  blue:   "from-[#4669f5] to-[#7b5cf0]",
  green:  "from-[#0ea877] to-[#0d9488]",
  orange: "from-[#f59e0b] to-[#f97316]",
  purple: "from-[#8b5cf6] to-[#a855f7]",
  cyan:   "from-[#38bdf8] to-[#2563eb]",
  red:    "from-[#ef4444] to-[#e11d48]",
  pink:   "from-[#ec4899] to-[#f43f5e]",
  slate:  "from-[#64748b] to-[#475569]",
};

export function KpiCard({
  gradient, emoji, label, value, suffix, note, progress, onClick, delay = 0,
}: {
  gradient: KpiGradient;
  emoji: string;
  label: string;
  value: string | number;
  suffix?: string;
  note?: string;
  progress?: number;
  onClick?: () => void;
  delay?: number;
}) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "group relative animate-fadeUp overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-left text-white shadow-card transition",
        "hover:-translate-y-0.5 hover:shadow-pop focus:outline-none focus:ring-2 focus:ring-white/40",
        gradients[gradient]
      )}
    >
      {/* texture */}
      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-black/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/80">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 text-lg backdrop-blur-sm">{emoji}</span>
      </div>

      <p className="relative mt-3 font-mono text-4xl font-bold tabular-nums tracking-tight">
        {value}
        {suffix && <span className="text-2xl font-semibold text-white/85">{suffix}</span>}
      </p>

      {typeof progress === "number" && (
        <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/20">
          <div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="relative mt-3 flex items-center justify-between">
        {note ? <p className="text-[11px] font-semibold text-white/75">{note}</p> : <span />}
        <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase tracking-widest text-white/0 transition group-hover:text-white/90">
          Details <ChevronRight size={12} />
        </span>
      </div>
    </button>
  );
}
