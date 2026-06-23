import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PreTitleProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
  variant?: "default" | "brand" | "rose" | "dark";
}

export function PreTitle({
  children,
  className,
  variant = "default",
  ...rest
}: PreTitleProps) {
  return (
    <span
      {...rest}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all hover:scale-105",
        variant === "default" && "bg-white/70 text-brand-900 backdrop-blur hover:bg-white/90 shadow-sm",
        variant === "brand" && "bg-brand-50 text-brand-900 shadow-sm",
        variant === "rose" && "bg-rose-50 text-rose-700 shadow-sm",
        variant === "dark" && "bg-brand-900 text-white shadow-sm",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
          variant === "default" && "bg-brand-400",
          variant === "brand" && "bg-brand-400",
          variant === "rose" && "bg-rose-400",
          variant === "dark" && "bg-white/60"
        )}></span>
        <span className={cn(
          "relative inline-flex h-2 w-2 rounded-full",
          variant === "default" && "bg-brand-500",
          variant === "brand" && "bg-brand-500",
          variant === "rose" && "bg-rose-500",
          variant === "dark" && "bg-white"
        )}></span>
      </span>
      {children}
    </span>
  );
}
