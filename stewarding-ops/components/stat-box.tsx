import { cn } from "@/lib/utils";
import type { Tone } from "@/components/ui/pill";

const tones: Record<Tone | "plain", string> = {
  plain:  "text-ink",
  green:  "text-emerald-300",
  amber:  "text-amber-300",
  red:    "text-rose-300",
  blue:   "text-sky-300",
  slate:  "text-slate-300",
  violet: "text-violet-300",
  orange: "text-orange-300",
  cyan:   "text-cyan-300",
};

export function StatBox({ label, value, tone = "plain", className }: { label: string; value: string | number; tone?: Tone | "plain"; className?: string }) {
  return (
    <div className={cn("card px-4 py-3.5", className)}>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-faint">{label}</p>
      <p className={cn("mt-1 font-mono text-2xl font-bold tabular-nums", tones[tone])}>{value}</p>
    </div>
  );
}
