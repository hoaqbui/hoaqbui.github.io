"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { useOnce } from "@/fx/useOnce";
import PixelScan from "@/fx/PixelScan";

export type HeroTake = { id: string; poster: string; alt: string; webm: string; mp4: string; prompt: string };

const noop = () => () => {};
const typingMs = 1200; // the whole prompt, however long

// The hero's 3-second demo (user, 2026-10-19: "we're selling magic UI!"; input changed
// 2026-10-26: a sentence, not a still). The take's poster is the first paint; once on
// screen the prompt types itself out above the frame, a pixel scan sweeps once, then the take
// plays once and holds its last frame. Tapping the frame replays it. Motion runs once, so there
// is no loop and no pause button (CONTEXT.md §Motion rules). The prompt is complete in the HTML
// and its untyped tail is only transparent, so the layout never moves and readers get the whole
// sentence at once.
export default function HeroShot({ take }: { take: HeroTake }) {
  const { ref, phase } = useOnce<HTMLDivElement>(0.5);
  // false while hydrating, so the reduced-motion button never differs from the server HTML
  const client = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useReducedMotion() && client;
  const video = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<"photo" | "scan" | "ready">("photo");
  const [typed, setTyped] = useState(0);
  const [needsTap, setNeedsTap] = useState(false);

  const prompt = take.prompt;
  // server and reduced motion show the whole sentence; below the fold it waits, transparent
  const shown = phase === "final" ? prompt.length : phase === "armed" ? 0 : typed;
  const typing = phase === "play" && typed < prompt.length;

  useEffect(() => {
    if (phase !== "play") return;
    const step = typingMs / prompt.length;
    let n = 0;
    const t = window.setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= prompt.length) {
        window.clearInterval(t);
        setStage("scan");
        video.current?.load(); // the clip loads while the scan runs, not before
      }
    }, step);
    return () => window.clearInterval(t);
  }, [phase, prompt.length]);

  const play = () => {
    const el = video.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => setNeedsTap(true));
  };

  const reveal = () => {
    setStage("ready");
    play();
  };

  // reduced motion: the poster alone until the visitor asks for the take
  const showShot = () => {
    video.current?.load();
    setStage("ready");
    play();
  };

  const replay = () => {
    if (video.current?.ended) play();
  };

  return (
    <div className="w-full">
      <p className="mb-3 flex items-center gap-2.5 text-body text-muted">
        <span className="shrink-0 rounded-full border border-current px-2.5 py-0.5 text-label opacity-70">prompt</span>
        <span className="text-text">
          {/* one span per character, all always present: typing only changes colour, so no node
              moves and the layout-shift score stays at zero (slicing the text re-made its nodes) */}
          {Array.from(prompt, (ch, i) => (
            <span key={i} className={i < shown ? undefined : "text-transparent"}>{ch}</span>
          ))}
          {/* the caret is always in the line (so nothing shifts when it appears), shown only while typing */}
          <span aria-hidden="true" className={`ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-teal ${typing ? "" : "opacity-0"}`} />
        </span>
      </p>
      <div
        ref={ref}
        data-hero-frame={stage}
        data-take={take.id}
        className="relative aspect-video w-full overflow-hidden rounded-[20px] bg-photo shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_60px_rgba(13,15,16,0.22)] has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-2 has-[button:focus-visible]:outline-teal"
      >
        <img
          src={take.poster}
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
          aria-label="The Compo take for this prompt"
          onPlaying={() => setNeedsTap(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${stage === "ready" ? "opacity-100" : "opacity-0"}`}
        >
          <source src={take.webm} type="video/webm" />
          <source src={take.mp4} type="video/mp4" />
        </video>
        <PixelScan play={stage === "scan"} onDone={reveal} />

        {stage === "ready" && (
          <>
            <button
              type="button"
              onClick={replay}
              aria-label="Replay the take"
              className="absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none"
            />
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-label text-[#1f2326] shadow-sm">
              <span className="font-medium text-[#0d7a6e]">Compo</span> · 6 s · made on my home lab
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
    </div>
  );
}
