"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

// The whole page fades to the photo band's black as the band arrives and back to the
// theme as it leaves, by setting --dusk (0–1) on <html>; globals.css blends every
// color token on it. Tied to scroll position, nothing moves on its own.
export default function Dusk({ children }: { children: ReactNode }) {
  const band = useRef<HTMLDivElement>(null);
  const last = useRef(-1);
  const { scrollY } = useScroll();

  // During a nav jump that isn't to Photos, the page doesn't fade as it flies past the band.
  const jumping = useRef(false);
  const jumpTimer = useRef<number | undefined>(undefined);
  const updateRef = useRef<() => void>(() => {});

  const update = useCallback(() => {
    if (!band.current) return;
    if (jumping.current) {
      // the jump is over once scrolling has been still for 150 ms
      window.clearTimeout(jumpTimer.current);
      jumpTimer.current = window.setTimeout(() => {
        jumping.current = false;
        updateRef.current();
      }, 150);
      return;
    }
    const H = window.innerHeight;
    const b = band.current.getBoundingClientRect();
    // Dark while the band covers the middle of the screen, fading over 15% of a screen on
    // either side of each edge: how far the middle line sits inside the band, in fades.
    const mid = 0.5 * H;
    const fade = 0.15 * H;
    const inside = Math.min(mid - b.top, b.bottom - mid);
    const level = clamp(0.5 + inside / (2 * fade));
    const dusk = Math.round(level * 1000) / 1000;
    if (dusk === last.current) return;
    last.current = dusk;
    const root = document.documentElement.style;
    if (dusk === 0) root.removeProperty("--dusk");
    else root.setProperty("--dusk", String(dusk));
  }, []);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    const onJump = (e: Event) => {
      if ((e as CustomEvent<string>).detail === "now") return;
      jumping.current = true;
      last.current = 0;
      document.documentElement.style.removeProperty("--dusk");
    };
    window.addEventListener("nav-jump", onJump);
    return () => window.removeEventListener("nav-jump", onJump);
  }, []);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    // the page grows when the band's carousel mounts; recompute without waiting for a scroll
    const grow = new ResizeObserver(update);
    grow.observe(document.body);
    return () => {
      window.removeEventListener("resize", update);
      grow.disconnect();
      document.documentElement.style.removeProperty("--dusk");
    };
  }, [update]);

  return (
    <div ref={band} data-dusk>
      {children}
    </div>
  );
}

// The /photos page sits at full dusk; the inline script sets it before first paint on a
// fresh load, the effect covers client-side navigation and clears it on the way out.
export function DuskFull() {
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--dusk", "1");
    return () => {
      root.removeProperty("--dusk");
    };
  }, []);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.style.setProperty("--dusk","1")`,
      }}
    />
  );
}
