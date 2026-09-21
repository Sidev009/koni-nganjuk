import { useEffect, useState } from "react";
import { useInView } from "./reveal";

export function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className="soft-card p-6 text-center transition-transform duration-300 hover:-translate-y-1">
      <p className="font-display text-4xl font-extrabold text-primary">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}
