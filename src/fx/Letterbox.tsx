"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

// Film framing around the photo band: black bars grow in from the top and bottom of the
// screen as the band approaches and hand over to it seamlessly; on the way out the bottom
// bar follows the band's edge, then retracts. Reduced motion gets a still gradient instead.
export default function Letterbox({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <>
        <div aria-hidden="true" data-letterbox="in" className="h-40 bg-linear-to-b from-bg to-photo" />
        {children}
        <div aria-hidden="true" data-letterbox="out" className="h-40 bg-linear-to-b from-photo to-bg" />
      </>
    );
  }
  return <FilmFrame>{children}</FilmFrame>;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function FilmFrame({ children }: { children: ReactNode }) {
  const band = useRef<HTMLDivElement>(null);
  const top = useMotionValue(0);
  const bottom = useMotionValue(0);
  const { scrollY } = useScroll();

  const update = useCallback(() => {
    if (!band.current) return;
    const H = window.innerHeight;
    const M = Math.min(0.12 * H, 120); // full bar height
    const D = 0.3 * H; // scroll distance over which the bars grow or retract
    const b = band.current.getBoundingClientRect();
    // in: 0 when the band's top is D below the screen, 1 as it reaches the bottom edge
    const pIn = clamp((H + D - b.top) / D, 0, 1);
    // out: 0 as the band's bottom passes the bar line, 1 a distance D later
    const pOut = clamp((H - M - b.bottom) / D, 0, 1);

    let t = 0;
    let btm = 0;
    if (b.bottom > M) {
      // approaching and inside: the top bar's lower edge rides the band's top edge
      t = clamp(Math.min(M * pIn, b.top), 0, M);
      // the bottom bar shows until the band covers the bottom of the screen
      btm = b.top > H - M ? M * pIn : 0;
    }
    if (b.bottom < H) {
      // leaving: the bottom bar's upper edge rides the band's bottom edge, then retracts
      btm = clamp(H - b.bottom, 0, M) * (1 - pOut);
    }
    top.set(t);
    bottom.set(btm);
  }, [top, bottom]);

  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return (
    <>
      <div ref={band}>{children}</div>
      <motion.div
        aria-hidden="true"
        data-letterbox-bar="top"
        style={{ height: top }}
        className="pointer-events-none fixed inset-x-0 top-0 z-40 bg-photo"
      />
      <motion.div
        aria-hidden="true"
        data-letterbox-bar="bottom"
        style={{ height: bottom }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-photo"
      />
    </>
  );
}
