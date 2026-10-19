"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView, useReducedMotion } from "motion/react";

// "One-shot in front" (user, 2026-10-19): foreground effects run once, the first time their
// element is on screen. Phases: "final" — server, no JS, or reduced motion: the end state;
// "armed" — on the client, waiting below the fold in the start state; "play" — running.
const noop = () => () => {};
export function useOnce<T extends Element>(amount = 0.4) {
  const ref = useRef<T | null>(null);
  const reduce = useReducedMotion();
  const client = useSyncExternalStore(noop, () => true, () => false);
  const inView = useInView(ref, { once: true, amount });
  const phase: "final" | "armed" | "play" = !client || reduce ? "final" : inView ? "play" : "armed";
  return { ref, phase };
}

// Steps light up one after another once the element plays; `active` is the step now lit
// (-1 before the first, `steps` when done and in the final state).
export function useSequence<T extends Element>(steps: number, stepMs = 380) {
  const { ref, phase } = useOnce<T>(0.5);
  const [i, setI] = useState(-1);
  useEffect(() => {
    if (phase !== "play") return;
    let k = 0;
    const t = window.setInterval(() => {
      setI(k);
      k += 1;
      if (k > steps) window.clearInterval(t);
    }, stepMs);
    return () => window.clearInterval(t);
  }, [phase, steps, stepMs]);
  const active = phase === "final" ? steps : phase === "armed" ? -1 : i;
  return { ref, phase, active };
}
