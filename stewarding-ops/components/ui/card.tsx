import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("card", className)}>{children}</section>;
}

export function CardHeader({
  title, subtitle, right, className,
}: { title: React.ReactNode; subtitle?: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <header className={cn("flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-4", className)}>
      <div>
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-faint">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
