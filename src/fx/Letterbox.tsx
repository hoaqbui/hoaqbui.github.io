"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type Edge = "in" | "out";

// Black bars close in above the photo band and open again below it, tied to scroll.
// Reduced motion gets a still gradient instead.
export default function Letterbox({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const Seam = reduce ? StillSeam : MovingSeam;
  return (
    <>
      <Seam edge="in" />
      {children}
      <Seam edge="out" />
    </>
  );
}

function MovingSeam({ edge }: { edge: Edge }) {
  const ref = useRef<HTMLDivElement>(null);
  // in: closes while the seam rises through the bottom of the screen, shut as the band arrives.
  // out: opens while the seam leaves through the top, after the band has gone.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: edge === "in" ? ["start end", "end end"] : ["start start", "end start"],
  });
  // 50.5% so the two bars overlap when shut, with no hairline between them.
  const height = useTransform(
    scrollYProgress,
    [0, 1],
    edge === "in" ? ["0%", "50.5%"] : ["50.5%", "0%"]
  );
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-letterbox={edge}
      className="relative h-[28vh] min-h-40 overflow-hidden"
    >
      <motion.div style={{ height }} className="absolute inset-x-0 top-0 bg-photo" />
      <motion.div style={{ height }} className="absolute inset-x-0 bottom-0 bg-photo" />
    </div>
  );
}

function StillSeam({ edge }: { edge: Edge }) {
  return (
    <div
      aria-hidden="true"
      data-letterbox={edge}
      className={`h-40 bg-linear-to-b ${
        edge === "in" ? "from-bg to-photo" : "from-photo to-bg"
      }`}
    />
  );
}
