"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/fx/useMotion";

function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function dot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  col: string
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = col;
  ctx.fill();
}

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.trim();
  if (h.startsWith("#")) {
    const raw = h.slice(1);
    if (raw.length === 3) {
      const r = parseInt(raw[0] + raw[0], 16);
      const g = parseInt(raw[1] + raw[1], 16);
      const b = parseInt(raw[2] + raw[2], 16);
      return [r, g, b];
    }
    if (raw.length === 6) {
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      return [r, g, b];
    }
  }
  const rgbMatch = h.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10),
      parseInt(rgbMatch[2], 10),
      parseInt(rgbMatch[3], 10),
    ];
  }
  return null;
}

export default function RippleMesh() {
  const { ref, allowed, paused, running, toggle } = useMotion<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef<{ jit?: [number, number][] }>({});
  const runningRef = useRef(running);
  runningRef.current = running;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    const render = (t: number) => {
      const w = width;
      const h = height;
      if (w === 0 || h === 0) return;

      const styles = getComputedStyle(canvas);
      const tealVal = styles.getPropertyValue("--color-teal").trim() || "#0d7a6e";
      const amberVal =
        styles.getPropertyValue("--color-amber").trim() || "#f2b544";

      const tealRgb = hexToRgb(tealVal) || [13, 122, 110];
      const tealRGBStr = `${tealRgb[0]},${tealRgb[1]},${tealRgb[2]}`;

      // Line color rgb: subtle dark lines on light ground, lighter on dark ground
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const lineRGBStr = isDark ? "160,190,200" : "31,35,38";

      ctx.clearRect(0, 0, w, h);

      // Port of N10 from NeuralFX.dc.html
      const cols = 26;
      const rows = 15;
      const cx = w * 0.5;
      const cy = h * 0.5;

      const sim = simRef.current;
      if (!sim.jit) {
        const R = createRng(5);
        sim.jit = Array.from({ length: cols * rows }, () => [
          (R() - 0.5) * 0.5,
          (R() - 0.5) * 0.5,
        ]);
      }

      const pts: [number, number, number][] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const j = sim.jit[r * cols + c];
          let x = ((c + 0.5 + j[0]) / cols) * w;
          let y = ((r + 0.5 + j[1]) / rows) * h;
          const dx = x - cx;
          const dy = y - cy;
          const d = Math.hypot(dx, dy) || 1;
          const wave =
            Math.sin(d / 38 - t * 2.4) *
            Math.max(0, 1 - d / (Math.max(w, h) * 0.75));
          x += (dx / d) * wave * 7;
          y += (dy / d) * wave * 7;
          pts.push([x, y, wave]);
        }
      }

      const at = (r: number, c: number) => pts[r * cols + c];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = at(r, c);
          const neighbors: [number, number][] = [
            [0, 1],
            [1, 0],
          ];
          for (const [dr, dc] of neighbors) {
            if (r + dr >= rows || c + dc >= cols) continue;
            const q = at(r + dr, c + dc);
            const lit = Math.max(0, (p[2] + q[2]) / 2);
            ctx.strokeStyle = `rgba(${lit > 0.4 ? tealRGBStr : lineRGBStr},${(
              0.1 +
              0.4 * lit
            ).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(q[0], q[1]);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        dot(
          ctx,
          p[0],
          p[1],
          1.4 + Math.max(0, p[2]) * 2.2,
          p[2] > 0.75 ? amberVal : tealVal
        );
      }
    };

    const updateSize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      width = w;
      height = h;

      const bufferW = Math.round(w * dpr);
      const bufferH = Math.round(h * dpr);
      if (canvas.width !== bufferW || canvas.height !== bufferH) {
        canvas.width = bufferW;
        canvas.height = bufferH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
        if (!runningRef.current) {
          render(2.5);
        }
      });
      resizeObserver.observe(canvas);
    }

    if (!running) {
      render(2.5);
      return () => {
        if (resizeObserver) resizeObserver.disconnect();
      };
    }

    let rafId: number;
    const t0 = performance.now();

    const loop = (ts: number) => {
      const elapsed = (ts - t0) / 1000;
      render(elapsed);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [running]);

  return (
    <figure
      ref={ref}
      data-ripple-mesh
      className="relative w-full h-[220px] md:h-[280px] rounded-3xl overflow-hidden bg-surface border border-border"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full pointer-events-none"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
        <span className="rounded-full bg-surface/90 px-4 py-1.5 font-serif italic text-muted text-sm md:text-base shadow-[0_0_24px_12px_var(--color-surface)]">
          every frame ripples from one intent
        </span>
      </figcaption>
      {allowed && (
        <button
          type="button"
          aria-pressed={paused}
          onClick={toggle}
          className="absolute bottom-3 right-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-surface/80 px-3 font-mono text-[11px] text-muted transition-colors hover:text-text cursor-pointer"
        >
          {paused ? "Play motion" : "Pause motion"}
        </button>
      )}
    </figure>
  );
}
