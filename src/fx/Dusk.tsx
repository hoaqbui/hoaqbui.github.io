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

  const update = useCallback(() => {
    if (!band.current) return;
    const H = window.innerHeight;
    const b = band.current.getBoundingClientRect();
    // in: from the band's top 20% below the screen until it is 40% down from the top
    const into = clamp((1.2 * H - b.top) / (0.8 * H));
    // out: from the band's bottom at the screen's bottom edge until where it will sit when
    // the page can scroll no further (short pages end before the band clears the top)
    const maxScroll = document.documentElement.scrollHeight - H;
    const bottomAtEnd = b.bottom - (maxScroll - window.scrollY);
    const outEnd = Math.max(bottomAtEnd + 0.05 * H, -0.2 * H);
    const outOf = clamp((b.bottom - outEnd) / Math.max(H - outEnd, 1));
    const dusk = Math.round(Math.min(into, outOf) * 1000) / 1000;
    if (dusk === last.current) return;
    last.current = dusk;
    const root = document.documentElement.style;
    if (dusk === 0) root.removeProperty("--dusk");
    else root.setProperty("--dusk", String(dusk));
  }, []);

  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
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
