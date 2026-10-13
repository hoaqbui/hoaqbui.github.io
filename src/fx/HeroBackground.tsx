"use client";

import { useEffect, useRef, useState } from "react";
import RippleBackground from "@/fx/RippleBackground";
import {
  constellation,
  reactiveWeb,
  growingGraph,
  type NetworkEffect,
} from "@/fx/networks";

type BgChoice = "ripple" | "constellation" | "reactive" | "growing";

const POOL: readonly BgChoice[] = [
  "ripple",
  "constellation",
  "reactive",
  "growing",
];

export default function HeroBackground({ running }: { running: boolean }) {
  const [choice, setChoice] = useState<BgChoice>("ripple");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const effectRef = useRef<NetworkEffect | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const runningRef = useRef(running);
  runningRef.current = running;

  // Hydration-safe initial render matches SSR ("ripple"), then picks randomly after mount.
  useEffect(() => {
    const picked = POOL[Math.floor(Math.random() * POOL.length)];
    setChoice(picked);
  }, []);

  // Setup canvas, resize observer, and pointer tracking for active network background.
  useEffect(() => {
    if (choice === "ripple") {
      effectRef.current = null;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initOrResize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;

      const bufferW = Math.round(w * dpr);
      const bufferH = Math.round(h * dpr);
      if (canvas.width !== bufferW || canvas.height !== bufferH) {
        canvas.width = bufferW;
        canvas.height = bufferH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!effectRef.current) {
        if (choice === "constellation") {
          effectRef.current = constellation(ctx, w, h);
        } else if (choice === "reactive") {
          effectRef.current = reactiveWeb(ctx, w, h);
        } else if (choice === "growing") {
          effectRef.current = growingGraph(ctx, w, h);
        }
      } else {
        effectRef.current.resize(w, h);
      }
    };

    initOrResize();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        initOrResize();
        if (!runningRef.current && effectRef.current) {
          effectRef.current.draw();
        }
      });
      observer.observe(canvas);
    }

    let cleanupPointer: (() => void) | null = null;
    if (choice === "reactive") {
      const handlePointerMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        if (x < 0 || x > 1 || y < 0 || y > 1) {
          pointerRef.current = null;
        } else {
          pointerRef.current = { x, y };
        }
      };

      const handlePointerLeave = () => {
        pointerRef.current = null;
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerleave", handlePointerLeave);
      cleanupPointer = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
      };
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (cleanupPointer) {
        cleanupPointer();
      }
      effectRef.current = null;
    };
  }, [choice]);

  // Animation loop: runs RAF while running; draws exactly one still frame when not running.
  useEffect(() => {
    if (choice === "ripple") return;

    if (!running) {
      if (effectRef.current) {
        effectRef.current.draw();
      }
      return;
    }

    let rafId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (effectRef.current) {
        effectRef.current.step(dt, pointerRef.current);
        effectRef.current.draw();
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [choice, running]);

  return (
    <div aria-hidden="true" data-hero-bg={choice} className="absolute inset-0">
      {choice === "ripple" ? (
        <RippleBackground running={running} />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full pointer-events-none"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 44% 40% at 50% 50%, var(--color-bg) 35%, transparent 100%)",
            }}
          />
        </>
      )}
    </div>
  );
}
