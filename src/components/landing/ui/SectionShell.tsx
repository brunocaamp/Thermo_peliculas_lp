import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  ambient?: "none" | "soft" | "rich";
};

export function SectionShell({
  children,
  className,
  ambient = "none",
  ...rest
}: SectionShellProps) {
  return (
    <section
      {...rest}
      className={cn(
        "relative isolate w-full overflow-hidden",
        ambient === "soft" && "bg-ambient-soft",
        ambient === "rich" && "bg-ambient",
        className,
      )}
    >
      <div className="section-shell relative">{children}</div>
    </section>
  );
}
