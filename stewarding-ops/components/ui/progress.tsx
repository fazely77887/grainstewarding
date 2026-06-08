import { cn } from "@/lib/utils";

export const rateColor = (v: number) => (v >= 85 ? "#34d399" : v >= 65 ? "#fbbf24" : "#fb7185");
export const rateText = (v: number) => (v >= 85 ? "text-emerald-300" : v >= 65 ? "text-amber-300" : "text-rose-300");

export function Progress({ value, color, className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/8", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color ?? rateColor(value) }}
      />
    </div>
  );
}
