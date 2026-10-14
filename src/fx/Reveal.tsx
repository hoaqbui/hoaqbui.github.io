"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

const hidden = { opacity: 0, y: 24, filter: "blur(8px)" };
const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

// Sections below the fold fade up the first time they scroll into view. The same element
// renders on the server and the client, visible, so nothing is re-created after load and
// the page reads without scripts. A nav jump ("nav-jump", from PillNav) shows any section
// still waiting at once, so a long jump doesn't flash blank or blurred frames.
export default function Reveal({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "waiting" | "revealing" | "instant">("static");

  useEffect(() => {
    if (reduce || !ref.current) return;
    const el = ref.current;
    // next frame, before paint: hide only what is still below the fold
    const raf = requestAnimationFrame(() => {
      if (el.getBoundingClientRect().top > window.innerHeight) setState("waiting");
    });
    const jump = () => setState((s) => (s === "waiting" ? "instant" : s));
    window.addEventListener("nav-jump", jump);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("nav-jump", jump);
    };
  }, [reduce]);

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      initial={false}
      animate={state === "waiting" ? hidden : shown}
      transition={state === "revealing" ? { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } : { duration: 0 }}
      onViewportEnter={() => setState((s) => (s === "waiting" ? "revealing" : s))}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
