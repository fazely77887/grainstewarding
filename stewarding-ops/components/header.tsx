"use client";

import { Menu, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Pill } from "@/components/ui/pill";
import { moduleBySlug } from "@/lib/modules";
import { cn } from "@/lib/utils";

const PAGE_NAMES: Record<string, string> = {
  "/": "Executive Dashboard",
  "/kpi": "KPI Dashboard",
  "/live": "Live Operations",
  "/audit": "Audit Dashboard",
  "/defect-board": "Defect Tracking",
  "/rework": "Rework Management",
  "/reports": "Reports & Analytics",
  "/settings": "Settings",
};

function shiftOf(h: number) {
  if (h >= 6 && h < 14) return { label: "MORNING SHIFT", tone: "amber" as const };
  if (h >= 14 && h < 22) return { label: "AFTERNOON SHIFT", tone: "blue" as const };
  return { label: "NIGHT SHIFT", tone: "violet" as const };
}

export function Header({
  onMenu, updatedAt, onRefresh, loading,
}: { onMenu: () => void; updatedAt: Date | null; onRefresh: () => void; loading: boolean }) {
  const pathname = usePathname();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  let page = PAGE_NAMES[pathname];
  if (!page && pathname.startsWith("/modules/")) {
    page = moduleBySlug(pathname.split("/")[2])?.nav ?? "Module";
  }

  const shift = now ? shiftOf(now.getHours()) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button onClick={onMenu} className="rounded-lg p-2 text-muted hover:bg-panel-2 hover:text-ink lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <nav className="min-w-0 text-sm">
          <span className="hidden text-faint sm:inline">Operations</span>
          <span className="hidden px-2 text-faint sm:inline">/</span>
          <span className="truncate font-bold">{page ?? "Dashboard"}</span>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {shift && <Pill tone={shift.tone} className="hidden md:inline-flex">{shift.label}</Pill>}
          {now && (
            <span className="hidden font-mono text-sm font-semibold tabular-nums text-muted lg:inline" suppressHydrationWarning>
              {now.toLocaleTimeString("en-GB")}
            </span>
          )}
          {updatedAt && (
            <span className="hidden text-[11px] text-faint sm:inline" suppressHydrationWarning>
              Updated {updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#2459db] active:scale-95"
          >
            <RefreshCw size={14} className={cn(loading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
