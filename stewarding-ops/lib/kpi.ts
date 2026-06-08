import { TODAY, type ModuleRecord, type Status } from "./demo-data";
import type { ModuleConfig } from "./modules";

export const isToday = (ts: string) => ts.startsWith(TODAY);
export const dayOf = (ts: string) => ts.slice(0, 10);

const DONE: Status[] = ["completed", "pass", "on_time", "resolved"];

export function moduleStats(cfg: ModuleConfig, records: ModuleRecord[]) {
  const total = records.length;
  const today = records.filter((r) => isToday(r.ts)).length;
  const count = (st: Status) => records.filter((r) => r.status === st).length;
  const done = records.filter((r) => DONE.includes(r.status)).length;
  const rate = total ? Math.round((done / total) * 100) : 0;

  const pills =
    cfg.kind === "cleaning"
      ? [
          { label: "Completed", value: count("completed"), tone: "green" },
          { label: "In Progress", value: count("in_progress"), tone: "amber" },
          { label: "Pending", value: count("pending"), tone: "slate" },
          { label: "Failed", value: count("failed"), tone: "red" },
        ]
      : cfg.kind === "qc"
      ? [
          { label: "Pass", value: count("pass"), tone: "green" },
          { label: "Fail", value: count("fail"), tone: "red" },
        ]
      : cfg.kind === "disposal"
      ? [
          { label: "On Time", value: count("on_time"), tone: "green" },
          { label: "Delayed", value: count("delayed"), tone: "amber" },
          { label: "Missed", value: count("missed"), tone: "red" },
        ]
      : [
          { label: "Resolved", value: count("resolved"), tone: "green" },
          { label: "In Progress", value: count("in_progress"), tone: "amber" },
          { label: "Open", value: count("open"), tone: "red" },
        ];

  return { total, today, done, rate, pills };
}

/** 7-day record counts ending on TODAY — for the grey mini trend bars. */
export function sevenDayCounts(records: ModuleRecord[]) {
  const base = new Date(TODAY + "T00:00:00");
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      label: d.toLocaleDateString("en-GB", { weekday: "short" }),
      count: records.filter((r) => dayOf(r.ts) === key).length,
    });
  }
  return days;
}
