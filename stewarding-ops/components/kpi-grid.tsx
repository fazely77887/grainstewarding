"use client";

import { useState } from "react";
import { KpiCard, type KpiGradient } from "@/components/kpi-card";
import { DrillPanel, type DrillChip } from "@/components/drill-panel";
import {
  TotalRecordsTable, TasksCompletedTable, PendingTable, ComplianceTable,
  QcTable, RedTagTable, MissedTable, DeepCleanTable,
} from "@/components/drill-tables";
import { hero } from "@/lib/demo-data";

type PanelKey =
  | "records" | "completed" | "pending" | "compliance"
  | "qc" | "redtags" | "missed" | "deepclean";

const PANELS: Record<PanelKey, {
  gradient: KpiGradient; emoji: string; title: string; subtitle: string;
  chips: DrillChip[]; count: number; body: React.ReactNode;
}> = {
  records:    { gradient: "blue",   emoji: "🗂️", title: "Total Records Today",  subtitle: "All modules · today",            chips: [{ label: "records", value: hero.recordsToday }, { label: "modules active", value: 7 }], count: 12, body: <TotalRecordsTable /> },
  completed:  { gradient: "green",  emoji: "✅", title: "Tasks Completed",       subtitle: "Completed across all modules",   chips: [{ label: "deep clean", value: 36 }, { label: "QC passed", value: 28 }, { label: "on-time disposal", value: 16 }, { label: "tags resolved", value: 6 }], count: 12, body: <TasksCompletedTable /> },
  pending:    { gradient: "orange", emoji: "⏳", title: "Pending Tasks",         subtitle: "Awaiting action",                chips: [{ label: "clean pending", value: 12 }, { label: "open tags", value: 6 }], count: 9, body: <PendingTable /> },
  compliance: { gradient: "purple", emoji: "🎯", title: "Compliance Rate",       subtitle: "Completion across modules",      chips: [{ label: "overall", value: `${hero.compliance}%`, dir: "up" }, { label: "total records", value: 105 }], count: 6, body: <ComplianceTable /> },
  qc:         { gradient: "cyan",   emoji: "🔍", title: "QC Pass Rate",          subtitle: "Kitchen utensils + pest control", chips: [{ label: "pass", value: 28, dir: "up" }, { label: "fail", value: 6 }, { label: "pass rate", value: `${hero.qcPassRate}%` }], count: 9, body: <QcTable /> },
  redtags:    { gradient: "red",    emoji: "🔴", title: "Open Red Tags",         subtitle: "Quarantined items",              chips: [{ label: "open", value: 4 }, { label: "total", value: 12 }, { label: "resolved", value: 6, dir: "up" }], count: 6, body: <RedTagTable /> },
  missed:     { gradient: "pink",   emoji: "🗑️", title: "Missed Disposals",      subtitle: "Rubbish disposal timing",        chips: [{ label: "missed", value: 2 }, { label: "total", value: 20 }, { label: "on time", value: 16, dir: "up" }], count: 2, body: <MissedTable /> },
  deepclean:  { gradient: "slate",  emoji: "🧽", title: "Deep Clean Rate",       subtitle: "Water · black box · machine",    chips: [{ label: "completed", value: 36 }, { label: "total", value: 51 }, { label: "rate", value: `${hero.deepCleanRate}%` }], count: 9, body: <DeepCleanTable /> },
};

export function KpiGrid() {
  const [panel, setPanel] = useState<PanelKey | null>(null);
  const active = panel ? PANELS[panel] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard gradient="blue"   emoji="🗂️" label="Total Records Today" value={hero.recordsToday} note="Across 7 modules"            onClick={() => setPanel("records")}    delay={0} />
        <KpiCard gradient="green"  emoji="✅" label="Tasks Completed"     value={hero.tasksCompleted} note="On track"                   onClick={() => setPanel("completed")}  delay={40} />
        <KpiCard gradient="orange" emoji="⏳" label="Pending Tasks"       value={hero.pendingTasks} note="Needs attention"              onClick={() => setPanel("pending")}    delay={80} />
        <KpiCard gradient="purple" emoji="🎯" label="Compliance Rate"     value={hero.compliance} suffix="%" progress={hero.compliance} note="Target 90%" onClick={() => setPanel("compliance")} delay={120} />
        <KpiCard gradient="cyan"   emoji="🔍" label="QC Pass Rate"        value={hero.qcPassRate} suffix="%" progress={hero.qcPassRate} note="28 pass · 6 fail" onClick={() => setPanel("qc")} delay={160} />
        <KpiCard gradient="red"    emoji="🔴" label="Open Red Tags"       value={hero.openRedTags} note="2 in progress"                 onClick={() => setPanel("redtags")}    delay={200} />
        <KpiCard gradient="pink"   emoji="🗑️" label="Missed Disposals"    value={hero.missedDisposals} note="Of 20 scheduled"           onClick={() => setPanel("missed")}     delay={240} />
        <KpiCard gradient="slate"  emoji="🧽" label="Deep Clean Rate"     value={hero.deepCleanRate} suffix="%" progress={hero.deepCleanRate} note="36 of 51 units" onClick={() => setPanel("deepclean")} delay={280} />
      </div>

      {active && (
        <DrillPanel
          open
          onClose={() => setPanel(null)}
          gradient={active.gradient}
          emoji={active.emoji}
          title={active.title}
          subtitle={active.subtitle}
          chips={active.chips}
          count={active.count}
        >
          {active.body}
        </DrillPanel>
      )}
    </>
  );
}
