"use client";

import { useSequence } from "@/fx/useOnce";
import { magic } from "@/fx/magic";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SectionLabel from "@/ui/SectionLabel";
import { em } from "@/ui/em";
import type { Photo, Shot } from "@/content/photos";
import { useMotion } from "@/fx/useMotion";

export type MotionPhoto = Pick<Photo, "id" | "src" | "width" | "height" | "title" | "alt" | "focusY"> & {
  shot: Pick<Shot, "webm" | "mp4">;
};

const poster = (p: MotionPhoto) => p.src.replace(".webp", "-800.webp");

// One take: the video and its photograph can be compared once the section is in view.
// Before that, or in reduced motion, only the photograph is shown.
// fill: on a wide screen the lead take stretches to the height of the column beside it
function Take({
  photo,
  shot,
  showVideo,
  playing,
  fill = false,
}: {
  photo: MotionPhoto;
  shot: MotionPhoto["shot"];
  showVideo: boolean;
  playing: boolean;
  fill?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [wipe, setWipe] = useState(50);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    // iPhone Low Power Mode can refuse muted autoplay; offer a direct tap to play.
    if (playing) el.play().catch(() => setNeedsTap(true));
    else el.pause();
  }, [playing, showVideo]);

  // the frame keeps its 16:9 box on a phone; on a wide screen a filled frame crops to fit
  const ratio = fill ? undefined : { aspectRatio: `${photo.width} / ${photo.height}` };
  const frameClass = `relative w-full overflow-hidden rounded-xl bg-black has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-teal ${fill ? "aspect-video md:aspect-auto md:h-0 md:min-h-0 md:flex-1" : ""}`;
  const mediaClass = "absolute inset-0 h-full w-full object-cover";

  return (
    <figure className={`m-0 flex flex-col ${fill ? "md:h-full" : ""}`}>
      <div className={frameClass} style={ratio} data-compare-frame={showVideo ? "" : undefined}>
        {showVideo && (
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="none"
            poster={poster(photo)}
            width={photo.width}
            height={photo.height}
            className={mediaClass}
            aria-label={`A six-second take of “${photo.title}”`}
            onPlaying={() => setNeedsTap(false)}
            onPause={() => playing && setNeedsTap(true)}
          >
            <source src={shot.webm} type="video/webm" />
            <source src={shot.mp4} type="video/mp4" />
          </video>
        )}
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          style={{
            objectPosition: `50% ${photo.focusY ?? 50}%`,
            clipPath: showVideo ? `inset(0 ${100 - wipe}% 0 0)` : undefined,
          }}
          className={mediaClass}
        />
        {showVideo && (
          <>
            <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 rounded bg-black/65 px-2 py-1 text-label text-white">
              Photograph
            </span>
            <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 rounded bg-black/65 px-2 py-1 text-label text-white">
              Video
            </span>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-sm" style={{ left: `${wipe}%` }} />
            <div
              aria-hidden="true"
              data-compare-handle
              className="pointer-events-none absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0d0f10] shadow-lg"
              style={{ left: `clamp(22px, ${wipe}%, calc(100% - 22px))` }}
            >
              <span className="text-base leading-none">↔</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={wipe}
              onChange={(event) => setWipe(Number(event.target.value))}
              aria-label={`Compare ${photo.title} photograph and video`}
              aria-valuetext={`${wipe}% photograph`}
              className="absolute inset-0 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 touch-pan-y focus-visible:outline-none"
            />
            {playing && needsTap && wipe < 100 && (
              <button
                type="button"
                onClick={() => video.current?.play().catch(() => setNeedsTap(true))}
                aria-label={`Play ${photo.title} video`}
                className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-label text-[#0d0f10] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Play video
              </button>
            )}
          </>
        )}
      </div>
      <figcaption className="mt-2 text-label text-muted">{photo.title}</figcaption>
    </figure>
  );
}

// Photo → shot → render → clip: what the four comparisons below went through.
const PIPELINE = [
  { name: "Photo", sub: "my travel frames" },
  { name: "Shot", sub: "subject, action, camera, sound" },
  { name: "Compo", sub: "my pipeline on MLX‑Gen, Wan, LTX and PyTorch", strong: true },
  { name: "Clip", sub: "6 s, to see where it breaks" },
];

export default function InMotion({ takes }: { takes: MotionPhoto[] }) {
  // fx owns reduced motion and the pause state. Its onScreen starts true until its observer
  // reports, so this section keeps its own in-view state: nothing loads before it is seen.
  const { allowed, paused, toggle } = useMotion<HTMLElement>();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      setLoaded(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      // latches: the clips load the first time the section is on screen, then stay loaded
      if (entry.isIntersecting) setLoaded(true);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { ref: beamRef, active: beamAt } = useSequence<HTMLOListElement>(PIPELINE.length);

  if (takes.length === 0) return null;

  const [lead, ...rest] = takes;
  const playing = allowed && !paused && inView;
  const showVideos = allowed && loaded;


  return (
    <section id="now" ref={ref} className="w-full border-t border-border py-20 md:py-24 text-text">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[720px]">
            <SectionLabel as="h2">Now, with AI</SectionLabel>
            <p className="mt-4 text-title font-semibold">
              {em("The latest problem: **consistent video** out of generative models, tested on my own photographs.")}
            </p>
            {/* how each shot is made, as four steps instead of a paragraph (card 93) */}
            <ol
              ref={beamRef}
              data-shot-pipeline
              className="m-0 mt-6 grid list-none grid-cols-2 gap-2 p-0 md:flex md:items-stretch md:gap-0"
            >
              {PIPELINE.map((step, i) => (
                <li key={step.name} className="flex md:flex-1">
                  {/* the beam reaches each step in turn: dim → lit, with a halo on arrival */}
                  <span
                    className={`flex w-full flex-col gap-1 rounded-2xl border px-4 py-3 transition-[opacity,transform,box-shadow] duration-500 ${
                      step.strong ? "border-teal" : "border-border"
                    } ${beamAt < i ? "translate-y-1 opacity-35" : ""} ${beamAt === i ? magic.glow : ""}`}
                  >
                    <span className={`text-heading font-medium ${step.strong ? "text-teal" : ""}`}>
                      <span className="mr-2 text-label text-muted">{i + 1}</span>
                      {step.name}
                    </span>
                    <span className="text-label text-muted">{step.sub}</span>
                  </span>
                  {i < PIPELINE.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`hidden self-center px-2 text-teal transition-[opacity,transform] duration-300 md:block ${
                        beamAt <= i ? "-translate-x-1 opacity-0" : ""
                      }`}
                    >
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
            {allowed && <p className="mt-3 text-label text-muted">Drag each frame to compare the photograph with its shot.</p>}
          </div>
          {allowed && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-pressed={paused}
                className="inline-flex min-h-[44px] items-center rounded-full border border-border px-4 text-label text-text hover:bg-well"
              >
                {paused ? "Play clips" : "Pause clips"}
              </button>
            </div>
          )}
        </header>

        {/* lead take large, the rest beside it; stacked under it on a phone */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
          <Take photo={lead} shot={lead.shot} showVideo={showVideos} playing={playing} fill />
          <div className="grid gap-4">
            {rest.map((t) => (
              <Take key={t.id} photo={t} shot={t.shot} showVideo={showVideos} playing={playing} />
            ))}
          </div>
        </div>

        <footer className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="text-label text-muted">
            LTX 2.5 · 480p → 720p · 6.1 s each · sound from the model, or scored from the frames
          </p>
          <div className="flex flex-wrap gap-x-6">
            <Link
              href="/building/intent-to-video/"
              className="inline-flex min-h-[44px] items-center text-body font-medium text-teal hover:underline"
            >
              How each shot is made →
            </Link>
            <Link
              href="/photos/"
              className="inline-flex min-h-[44px] items-center text-body font-medium text-teal hover:underline"
            >
              All photographs →
            </Link>
          </div>
        </footer>

        <div data-also-building className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded-2xl border border-border bg-surface px-6 py-5 text-body">
          <span className="font-medium">Also building</span>
          <span className="min-w-0 flex-[1_1_420px] text-muted">
            <Link href="/building/parti/" className="font-medium text-teal hover:underline">Parti</Link>, a multi-agent
            system on my own hardware, and{" "}
            <Link href="/building/himmelcam/" className="font-medium text-teal hover:underline">HimmelCam</Link>, a dog-cam
            that keeps Himmel in view.
          </span>
          <Link href="/building/" className="inline-flex min-h-[44px] items-center font-medium text-teal hover:underline">
            All projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
