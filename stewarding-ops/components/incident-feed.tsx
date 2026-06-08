import { incidents } from "@/lib/demo-data";
import { Pill, SeverityPill, type Tone } from "@/components/ui/pill";

const tagTone: Record<string, Tone> = {
  DISPOSAL: "orange", QC: "violet", "RED TAG": "red", "DEEP CLEAN": "blue",
};

export function IncidentFeed({ limit }: { limit?: number }) {
  const list = limit ? incidents.slice(0, limit) : incidents;
  return (
    <ul className="divide-y divide-line-soft">
      {list.map((inc, i) => (
        <li key={i} className="flex items-start gap-3 px-5 py-3.5">
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            style={{ background: inc.severity === "High" ? "#fb7185" : "#fbbf24" }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={tagTone[inc.tag] ?? "slate"}>{inc.tag}</Pill>
              <SeverityPill severity={inc.severity} />
            </div>
            <p className="mt-1 truncate text-sm font-semibold">{inc.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-faint">{inc.by} · {inc.at}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
