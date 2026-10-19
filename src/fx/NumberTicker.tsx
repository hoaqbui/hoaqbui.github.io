"use client";

import { useLayoutEffect, useRef } from "react";
import { animate } from "motion/react";
import { useOnce } from "@/fx/useOnce";

// A stat that counts up the first time it's on screen ("50+" runs 0 → 50). Numbers under 10
// stay put: a count from 0 to 3 reads as a glitch, not a reveal. The server renders the
// final value, so the number is right without scripts and for search engines.
export default function NumberTicker({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const target = m ? Number(m[2]) : 0;
  const ticks = Boolean(m) && target >= 10;
  const { ref, phase } = useOnce<HTMLSpanElement>(0.6);
  const num = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!ticks || !num.current) return;
    if (phase === "armed") num.current.textContent = "0";
    if (phase !== "play") return;
    num.current.textContent = "0";
    const run = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (num.current) num.current.textContent = String(Math.round(v));
      },
    });
    return () => run.stop();
  }, [phase, ticks, target]);

  if (!m) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {m[1]}
      <span ref={num} className="tabular-nums">{m[2]}</span>
      {m[3]}
    </span>
  );
}
