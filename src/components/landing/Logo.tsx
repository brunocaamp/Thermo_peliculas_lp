import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "dark" | "light";
};

export function Logo({ className, variant = "dark" }: LogoProps) {
  const isDark = variant === "dark";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className={cn(
          "h-9 w-9 shrink-0",
          isDark ? "text-brand-900" : "text-white",
        )}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="34" height="34" rx="10" fill="url(#logoGrad)" />
        <path
          d="M12 14h16M20 14v14M14 22c2-4 10-4 12 0"
          stroke={isDark ? "#ffffff" : "#224366"}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-base font-extrabold tracking-tight",
            isDark ? "text-brand-900" : "text-white",
          )}
        >
          Thermo
        </span>
        <span
          className={cn(
            "text-[0.7rem] font-medium uppercase tracking-[0.22em]",
            isDark ? "text-ink-soft" : "text-white/70",
          )}
        >
          Películas
        </span>
      </div>
    </div>
  );
}
