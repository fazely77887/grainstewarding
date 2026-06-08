"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, PieChart, Pie, LineChart, Line, Legend, ComposedChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import {
  moduleCompletion, qcSplit, dailyBreakdown, recordsByModule,
  operators, areaPerformance, shiftSummary, defectsPerMonth, reworkTrend,
} from "@/lib/demo-data";

const AXIS = { fontSize: 11, fill: "#5b6880", fontFamily: "var(--font-mono)" };
const GRID = "rgba(148,163,184,0.07)";
const TOOLTIP = {
  contentStyle: {
    background: "#0d1530", border: "1px solid rgba(148,163,184,0.15)",
    borderRadius: 12, fontSize: 12, color: "#e8edf7",
    boxShadow: "0 20px 50px -20px rgba(0,0,0,0.9)",
  },
  labelStyle: { color: "#8b97ad", fontWeight: 700 },
  cursor: { fill: "rgba(148,163,184,0.05)" },
};

/* ── Executive: module completion rates ─────────────────────────── */
export function ModuleCompletionBar() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={moduleCompletion} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval={0} angle={-14} height={44} textAnchor="end" />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...TOOLTIP} formatter={(v: number) => [`${v}%`, "Completion"]} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={42}>
          {moduleCompletion.map((m) => <Cell key={m.key} fill={m.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Executive: QC pass/fail donut ───────────────────────────────── */
export function QcDonut({ pass = qcSplit.pass, fail = qcSplit.fail }: { pass?: number; fail?: number }) {
  const data = [
    { name: "Pass", value: pass, color: "#34d399" },
    { name: "Fail", value: fail, color: "#fb7185" },
  ];
  const rate = pass + fail ? Math.round((pass / (pass + fail)) * 100) : 0;
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={70} outerRadius={98} paddingAngle={3} strokeWidth={0}>
            {data.map((d) => <Cell key={d.name} fill={d.color} />)}
          </Pie>
          <Tooltip {...TOOLTIP} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#8b97ad" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-7">
        <span className="font-mono text-3xl font-bold text-emerald-300">{rate}%</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-faint">Pass rate</span>
      </div>
    </div>
  );
}

/* ── Executive + Reports: 7-day activity trend ──────────────────── */
export function Trend7d() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={dailyBreakdown} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="recFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis yAxisId="l" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis yAxisId="r" orientation="right" tick={AXIS} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...TOOLTIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#8b97ad" }} />
        <Area yAxisId="l" type="monotone" dataKey="total" name="Records" stroke="#3b82f6" strokeWidth={2} fill="url(#recFill)" />
        <Line yAxisId="r" type="monotone" dataKey="rate" name="Completion %" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, fill: "#34d399" }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ── Module page: grey 7-day mini bars ──────────────────────────── */
export function MiniBars({ data, accent }: { data: { label: string; count: number }[]; accent: string }) {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ ...AXIS, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} formatter={(v: number) => [v, "Records"]} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={34}>
          {data.map((d, i) => (
            <Cell key={d.label} fill={i === data.length - 1 ? accent : "rgba(148,163,184,0.25)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Reports: records by module ─────────────────────────────────── */
export function RecordsByModuleBar() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={recordsByModule} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 9 }} axisLine={false} tickLine={false} interval={0} angle={-18} height={56} textAnchor="end" />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} />
        <Bar dataKey="value" name="Records" radius={[6, 6, 0, 0]} maxBarSize={38}>
          {recordsByModule.map((m) => <Cell key={m.name} fill={m.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Reports: operator performance ──────────────────────────────── */
export function OperatorChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={operators} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="short" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis yAxisId="l" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis yAxisId="r" orientation="right" tick={AXIS} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...TOOLTIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#8b97ad" }} />
        <Bar yAxisId="l" dataKey="tasks" name="Tasks" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={30} />
        <Bar yAxisId="l" dataKey="done" name="Completed" fill="#34d399" radius={[5, 5, 0, 0]} maxBarSize={30} />
        <Line yAxisId="r" type="monotone" dataKey="rate" name="Rate %" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3, fill: "#fbbf24" }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ── Reports: area pass/fail/missed ─────────────────────────────── */
export function AreaBars() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={areaPerformance} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="area" tick={{ ...AXIS, fontSize: 9 }} axisLine={false} tickLine={false} interval={0} angle={-18} height={58} textAnchor="end" />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#8b97ad" }} />
        <Bar dataKey="pass" name="Pass" stackId="a" fill="#34d399" maxBarSize={30} />
        <Bar dataKey="fail" name="Fail" stackId="a" fill="#fb7185" maxBarSize={30} />
        <Bar dataKey="missed" name="Missed" stackId="a" fill="#fbbf24" radius={[5, 5, 0, 0]} maxBarSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Reports: area compliance radar ─────────────────────────────── */
export function AreaRadar() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={areaPerformance} outerRadius="72%">
        <PolarGrid stroke={GRID} />
        <PolarAngleAxis dataKey="area" tick={{ ...AXIS, fontSize: 9 }} />
        <Radar dataKey="rate" name="Pass rate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.28} strokeWidth={2} />
        <Tooltip {...TOOLTIP} formatter={(v: number) => [`${v}%`, "Pass rate"]} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ── Reports: shift bars ────────────────────────────────────────── */
export function ShiftBars() {
  const data = shiftSummary.map((s) => ({ name: s.label.split(" ")[0], records: s.records }));
  const colors = ["#fbbf24", "#3b82f6", "#a78bfa"];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} />
        <Bar dataKey="records" name="Records" radius={[6, 6, 0, 0]} maxBarSize={64}>
          {data.map((d, i) => <Cell key={d.name} fill={colors[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Reports: weekly records vs completion ──────────────────────── */
export function WeeklyCombo() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={dailyBreakdown} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="day" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis yAxisId="l" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis yAxisId="r" orientation="right" tick={AXIS} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
        <Tooltip {...TOOLTIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#8b97ad" }} />
        <Bar yAxisId="l" dataKey="total" name="Records" fill="#3b82f6" radius={[5, 5, 0, 0]} maxBarSize={36} />
        <Bar yAxisId="l" dataKey="completed" name="Completed" fill="#34d399" radius={[5, 5, 0, 0]} maxBarSize={36} />
        <Line yAxisId="r" type="monotone" dataKey="rate" name="Rate %" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 3, fill: "#fbbf24" }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* ── Defects: stacked monthly severity ──────────────────────────── */
export function DefectsStacked() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={defectsPerMonth} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip {...TOOLTIP} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#8b97ad" }} />
        <Bar dataKey="high" name="High" stackId="a" fill="#fb7185" maxBarSize={36} />
        <Bar dataKey="medium" name="Medium" stackId="a" fill="#fbbf24" maxBarSize={36} />
        <Bar dataKey="low" name="Low" stackId="a" fill="#38bdf8" radius={[5, 5, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Rework: monthly rate line ──────────────────────────────────── */
export function ReworkLine() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ComposedChart data={reworkTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="rwFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#fb7185" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="month" tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} unit="%" />
        <Tooltip {...TOOLTIP} formatter={(v: number, n: string) => (n === "Rework rate" ? [`${v}%`, n] : [v, n])} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "#8b97ad" }} />
        <Area type="monotone" dataKey="rate" name="Rework rate" stroke="#fb7185" strokeWidth={2.5} fill="url(#rwFill)" dot={{ r: 3.5, fill: "#fb7185" }} />
        <Bar dataKey="items" name="Rework items" fill="rgba(148,163,184,0.25)" radius={[4, 4, 0, 0]} maxBarSize={26} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
