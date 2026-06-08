"use client";
import { cn } from "@/lib/utils";

export function Tabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (t: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-panel p-1.5">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition",
            value === t ? "bg-accent text-white shadow-[0_6px_18px_-6px_rgba(47,107,255,0.7)]" : "text-muted hover:bg-panel-2 hover:text-ink"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
