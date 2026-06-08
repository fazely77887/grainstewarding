"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Item = { href: string; label: string; emoji: string };
type Group = { heading: string | null; items: Item[] };

const NAV: Group[] = [
  {
    heading: "OVERVIEW",
    items: [
      { href: "/", label: "Executive Dashboard", emoji: "📊" },
      { href: "/kpi", label: "KPI Dashboard", emoji: "🎯" },
      { href: "/live", label: "Live Operations", emoji: "📡" },
    ],
  },
  {
    heading: "DEEP CLEANING",
    items: [
      { href: "/modules/water-dispenser", label: "Water Dispenser", emoji: "💧" },
      { href: "/modules/black-box", label: "Black Box", emoji: "📦" },
      { href: "/modules/machine-clean", label: "Machine Clean", emoji: "⚙️" },
    ],
  },
  {
    heading: "QC INSPECTIONS",
    items: [
      { href: "/modules/kitchen-utensils", label: "Kitchen Utensils", emoji: "🔍" },
      { href: "/modules/pest-control", label: "Pest Control", emoji: "🛡️" },
      { href: "/audit", label: "Audit Dashboard", emoji: "📋" },
    ],
  },
  {
    heading: "OPERATIONS",
    items: [
      { href: "/modules/rubbish-disposal", label: "Rubbish Disposal", emoji: "🗑️" },
      { href: "/modules/red-tag-items", label: "Red Tag Items", emoji: "🔴" },
    ],
  },
  {
    heading: "QUALITY",
    items: [
      { href: "/defect-board", label: "Defect Tracking", emoji: "🛠️" },
      { href: "/rework", label: "Rework Management", emoji: "♻️" },
    ],
  },
  {
    heading: "INSIGHT",
    items: [
      { href: "/reports", label: "Reports & Analytics", emoji: "📈" },
      { href: "/settings", label: "Settings", emoji: "🔧" },
    ],
  },
];

export function Sidebar({ open, onClose, isDemo }: { open: boolean; onClose: () => void; isDemo: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-sidebar transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-line px-5 py-5">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent to-violet-600 text-xl shadow-[0_10px_30px_-8px_rgba(47,107,255,0.8)]">
            🧽
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black uppercase tracking-[0.18em]">Stewarding Ops</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-faint">Control Center</p>
          </div>
          <button onClick={onClose} className="ml-auto rounded-lg p-1.5 text-muted hover:bg-panel-2 hover:text-ink lg:hidden" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((group) => (
            <div key={group.heading ?? "root"} className="mb-5">
              {group.heading && (
                <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-faint">{group.heading}</p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition",
                          active
                            ? "bg-accent text-white shadow-[0_8px_24px_-8px_rgba(47,107,255,0.8)]"
                            : "text-muted hover:bg-panel-2 hover:text-ink"
                        )}
                      >
                        <span className="text-base leading-none">{item.emoji}</span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-line px-5 py-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live · Auto-refresh 60s
          </div>
          <p className={cn("mt-1.5 text-[10px] font-bold uppercase tracking-wider", isDemo ? "text-amber-400" : "text-emerald-400")}>
            {isDemo ? "Demo data — connect Google Sheets" : "Connected to Google Sheets"}
          </p>
        </div>
      </aside>
    </>
  );
}
