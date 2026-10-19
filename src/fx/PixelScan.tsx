"use client";

import { useEffect, useRef } from "react";

// A band of teal → amber cells sweeps down once, the way an image model resolves a frame
// (after Aceternity's Image Generation Loader; written here, the site repo is public).
// Draws only while `play` is true, then fades and clears, so it costs nothing afterwards.
const CELL = 7;
const GAP = 2;
const BAND = 70;
const COLORS = ["#3cc9b4", "#2fae9c", "#0d7a6e", "#f2b544", "#e9a12c"];

export default function PixelScan({
  play,
  duration = 2600,
  onDone,
}: {
  play: boolean;
  duration?: number;
  onDone: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!play || !el || !ctx) return;
    const { width: W, height: H } = el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    el.width = W * dpr;
    el.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    el.style.opacity = "1";
    const step = CELL + GAP;
    const t0 = performance.now();
    let raf = 0;
    const frame = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const y = -BAND + e * (H + BAND * 2);
      ctx.clearRect(0, 0, W, H);
      // the part already "rendered" sits under a light veil until the band has passed
      ctx.fillStyle = "rgba(13,15,16,.35)";
      ctx.fillRect(0, 0, W, Math.max(0, y - BAND));
      for (let gy = 0; gy < H; gy += step) {
        const d = Math.abs(gy - y);
        if (d > BAND) continue;
        const a = 1 - d / BAND;
        for (let gx = 0; gx < W; gx += step) {
          if (Math.random() > a * 0.9) continue;
          const s = CELL * (0.4 + 0.6 * a * (0.6 + 0.4 * Math.sin(gx * 0.05 + t * 0.01)));
          ctx.globalAlpha = 0.25 + 0.75 * a;
          ctx.fillStyle = COLORS[Math.floor((gx + gy) / step) % COLORS.length];
          ctx.fillRect(gx + (CELL - s) / 2, gy + (CELL - s) / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
      if (k < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, W, H);
        done.current();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [play, duration]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      data-hero-shot-scan={play ? "running" : "idle"}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
