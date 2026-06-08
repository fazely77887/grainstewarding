"use client";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "outline" | "danger" | "success";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-[#2459db] shadow-[0_8px_24px_-8px_rgba(47,107,255,0.6)]",
  ghost: "bg-transparent text-muted hover:bg-panel-2 hover:text-ink",
  outline: "border border-line bg-panel-2 text-ink hover:border-accent/50 hover:bg-panel-3",
  danger: "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_8px_24px_-8px_rgba(225,29,72,0.55)]",
  success: "bg-emerald-600 text-white hover:bg-emerald-500",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        styles[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
