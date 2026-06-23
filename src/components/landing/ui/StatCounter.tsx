import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type StatCounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export function StatCounter({ value, prefix = "", suffix = "%", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col">
      <span className="font-display text-4xl font-extrabold leading-none text-brand-900 sm:text-5xl">
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
    </div>
  );
}
