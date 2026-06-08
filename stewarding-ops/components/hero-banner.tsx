"use client";

import { hero, TODAY_LABEL } from "@/lib/demo-data";
import { Pill } from "@/components/ui/pill";

function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-36 w-36 shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="font-mono text-3xl font-bold tabular-nums">{value}%</p>
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/60">Compliance</p>
      </div>
    </div>
  );
}

export function HeroBanner({ isDemo }: { isDemo: boolean }) {
  const stats = [
    { label: "records today", value: hero.recordsToday, cls: "text-white" },
    { label: "clean rate", value: `${hero.cleanRate}%`, cls: "text-emerald-300" },
    { label: "QC pass", value: `${hero.qcPassRate}%`, cls: "text-sky-300" },
    { label: "open red tags", value: hero.openRedTags, cls: "text-rose-300" },
  ];

  return (
    <section className="card relative overflow-hidden bg-gradient-to-br from-[#0b1330] via-[#0a1124] to-[#101a3f] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <Ring value={hero.compliance} />

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-400">Operations Control Center</p>
          <h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">Stewarding Operations</h1>
          <p className="mt-1 text-sm font-semibold text-muted">{TODAY_LABEL}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {stats.map((s) => (
              <p key={s.label} className="text-sm font-semibold text-muted">
                <span className={`font-mono text-lg font-bold tabular-nums ${s.cls}`}>{s.value}</span> {s.label}
              </p>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-row gap-2 md:flex-col md:items-end">
          {isDemo && <Pill tone="amber">● Demo data</Pill>}
          <Pill tone="green">● Live</Pill>
        </div>
      </div>
    </section>
  );
}
