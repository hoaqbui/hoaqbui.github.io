"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, useReducedMotion } from "motion/react";
import { useOnce } from "@/fx/useOnce";
import PixelScan from "@/fx/PixelScan";

export type HeroTake = { id: string; src: string; small: string; width: number; alt: string; webm: string; mp4: string };

const compare = "Drag to compare the photograph with the Compo shot";
const noop = () => () => {};

// The hero's 3-second demo (user, 2026-10-19: "we're selling magic UI!"): a photograph Compo
// has a shot for; a pixel scan sweeps it once, the shot wipes in to half and plays once, then
// holds its last frame. Dragging replays it. Motion runs once, so there is no loop and no
// pause button (CONTEXT.md §Motion rules). One fixed take, not a random one: the server sends
// its <img>, so the preload scanner finds it at once (mobile LCP 1.7 s vs 2.7 s for a pick in
// an inline script, which waits on the stylesheet).
export default function HeroShot({ take }: { take: HeroTake }) {
  const { ref, phase } = useOnce<HTMLDivElement>(0.5);
  // false while hydrating, so the reduced-motion button never differs from the server HTML
  const client = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useReducedMotion() && client;
  const video = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<"photo" | "scan" | "ready">("photo");
  const [wipe, setWipe] = useState(100); // percent of the frame the photograph covers, from the left
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    if (phase !== "play") return;
    setStage("scan");
    video.current?.load(); // the clip loads while the scan runs, not before
  }, [phase]);

  const play = () => {
    const el = video.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => setNeedsTap(true));
  };

  const reveal = () => {
    play();
    animate(100, 50, { duration: 0.9, ease: [0.16, 1, 0.3, 1], onUpdate: setWipe, onComplete: () => setStage("ready") });
  };

  // reduced motion: the photograph alone until the visitor asks for the shot
  const showShot = () => {
    video.current?.load();
    setWipe(50);
    setStage("ready");
    play();
  };

  const replay = () => {
    if (video.current?.ended) play();
  };

  return (
    <div
      ref={ref}
      data-hero-frame={stage}
      data-take={take.id}
      className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-photo shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_60px_rgba(13,15,16,0.22)] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-teal"
    >
      <img
        src={take.src}
        srcSet={`${take.small} 800w, ${take.src} ${take.width}w`}
        sizes="(min-width: 768px) 540px, 92vw"
        alt={take.alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={video}
        muted
        playsInline
        preload="none"
        aria-label="The Compo shot made from this photograph"
        onPlaying={() => setNeedsTap(false)}
        style={{ clipPath: `inset(0 0 0 ${wipe}%)` }}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={take.webm} type="video/webm" />
        <source src={take.mp4} type="video/mp4" />
      </video>
      <PixelScan play={stage === "scan"} onDone={reveal} />

      {stage === "ready" && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0" style={{ left: `${wipe}%` }}>
            <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_18px_rgba(60,201,180,0.9)]" />
            <div className="absolute top-1/2 -left-5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-teal shadow-md">
              ⇆
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(wipe)}
            onChange={(e) => setWipe(Number(e.target.value))}
            onPointerUp={replay}
            onKeyUp={replay}
            aria-label={compare}
            className="absolute inset-0 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:outline-none"
          />
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-label text-[#1f2326] shadow-sm">
            Photograph
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-label text-[#1f2326] shadow-sm">
            Compo shot
          </span>
        </>
      )}
      {stage === "scan" && (
        <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-label text-[#1f2326] shadow-sm">
          <span className="size-2 animate-pulse rounded-full bg-[#3cc9b4]" />
          Compo is rendering the shot…
        </span>
      )}
      {((reduce && stage === "photo") || (needsTap && stage === "ready")) && (
        <button
          type="button"
          onClick={stage === "photo" ? showShot : play}
          className="absolute top-3 right-3 z-10 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-label text-[#0d0f10] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          {stage === "photo" ? "Play the shot" : "Play video"}
        </button>
      )}
    </div>
  );
}
