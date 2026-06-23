import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "strong" | "strong2" | "tinted";

type GlassCardProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  variant?: Variant;
  interactive?: boolean;
};

const VARIANTS: Record<Variant, string> = {
  default: "glass",
  strong: "glass-strong",
  strong2: "glass-strong-2",
  tinted: "glass-tinted",
};

export function GlassCard({
  children,
  className,
  variant = "default",
  interactive = false,
  ...rest
}: GlassCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        VARIANTS[variant],
        "rounded-3xl",
        interactive &&
        "transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-20px_rgba(34,67,102,0.35)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
