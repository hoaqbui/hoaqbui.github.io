"use client";

import { useOnce } from "@/fx/useOnce";

// A stat that turns from its "before" into its result the first time it's on screen
// ("3 months" blurs out, "<1 hr" blurs in; user, 2026-10-19). The server, no-JS visitors and
// reduced motion get the result alone, so search and screen readers read the stated number;
// the before is aria-hidden. Both share one grid cell, so the swap never shifts the layout.
const ease = "transition-[opacity,filter,translate] duration-900 ease-[cubic-bezier(0.2,0.8,0.2,1)]";

export default function MorphNumber({ before, value, className }: { before: string; value: string; className?: string }) {
  const { ref, phase } = useOnce<HTMLSpanElement>(0.6);

  return (
    <span ref={ref} data-morph={phase} className={`inline-grid ${className ?? ""}`}>
      {phase !== "final" && (
        <span
          aria-hidden="true"
          className={`[grid-area:1/1] whitespace-nowrap text-muted ${ease} ${phase === "play" ? "-translate-y-2.5 opacity-0 blur-md" : ""}`}
        >
          {before}
        </span>
      )}
      <span
        data-morph-value
        className={`[grid-area:1/1] whitespace-nowrap ${ease} delay-300 ${phase === "armed" ? "translate-y-2.5 opacity-0 blur-md" : ""}`}
      >
        {value}
      </span>
    </span>
  );
}
