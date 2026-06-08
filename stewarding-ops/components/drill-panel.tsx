"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { TODAY_PILL } from "@/lib/demo-data";
import type { KpiGradient } from "@/components/kpi-card";

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

export type DrillChip = { label: string; value: string | number; dir?: "up" | "down" };

export function DrillPanel({
  open, onClose, gradient, emoji, title, subtitle, chips, count, children,
}: {
  open: boolean;
  onClose: () => void;
  gradient: KpiGradient;
  emoji: string;
  title: string;
  subtitle: string;
  chips: DrillChip[];
  count: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl animate-slideIn flex-col border-l border-line bg-panel shadow-pop">
        {/* gradient header */}
        <div className={cn("relative overflow-hidden bg-gradient-to-br p-6 text-white", gradients[gradient])}>
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-xl backdrop-blur-sm">{emoji}</span>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
                <p className="text-xs font-semibold text-white/75">{subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg bg-white/10 p-1.5 transition hover:bg-white/25" aria-label="Close panel">
              <X size={18} />
            </button>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c.label} className="rounded-xl bg-black/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                <span className="font-mono tabular-nums">{c.value}</span>{" "}
                <span className="text-white/70">{c.label}</span>
                {c.dir && <span className="ml-1">{c.dir === "up" ? "↗" : "↘"}</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-line-soft px-6 py-3">
          <p className="text-xs font-bold text-muted">
            <span className="font-mono tabular-nums text-ink">{count}</span> records
          </p>
          <span className="rounded-full border border-line bg-panel-2 px-3 py-1 font-mono text-[11px] font-semibold text-muted">{TODAY_PILL}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-5">{children}</div>
      </aside>
    </div>
  );
}
