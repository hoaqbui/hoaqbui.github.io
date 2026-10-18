"use client";

import { useEffect, useRef, useState } from "react";
import type { Photo, Shot } from "@/content/photos";
import { useMotion } from "@/fx/useMotion";

// A photograph with the six-second shot made from it.
export type Take = Photo & { shot: Shot };

// Drag across a photograph to see the shot the model made from it, with its prompt beside
// it. The takes come in as props, so this stays presentational. Sound is off until asked for.
export default function StillToShot({ takes }: { takes: Take[] }) {
  const { ref, allowed, running, paused, toggle } = useMotion<HTMLElement>();
  const [pick, setPick] = useState(0);
  const [wipe, setWipe] = useState(50);
  const [sound, setSound] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    // iPhone Low Power Mode can refuse muted autoplay; offer a direct tap to play.
    if (running) el.play().catch(() => setNeedsTap(true));
    else el.pause();
  }, [running, pick]);

  if (takes.length === 0) return null;
  const take = takes[pick];
  const { shot } = take;
  const chips = [
    "LTX 2.5",
    "480p → 720p",
    "6.1 s",
    shot.soundSource === "LTX 2.5" ? "Sound from the model" : "Sound scored from the frames",
  ];
  const compare = "Drag to compare the photograph with the shot";

  return (
    <section ref={ref} data-still-to-shot className="w-full text-text">
      <h2 className="text-label text-muted">From still to shot</h2>
      <h3 className="mt-3 text-title font-medium">
        My photographs, directed as six-second shots.
      </h3>
      <p className="mt-3 max-w-[680px] text-lead">
        I wrote each photograph a shot (a subject, what happens to it, the camera, the sound), and Compo rendered it on
        LTX 2.5. Drag across the photograph to see what the model added.
      </p>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="text-label text-muted">{compare}</p>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-teal">
            <video
              key={pick}
              ref={video}
              muted={!sound}
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={`A six-second take of “${take.title}”`}
              onPlaying={() => setNeedsTap(false)}
              onPause={() => running && setNeedsTap(true)}
            >
              <source src={shot.webm} type="video/webm" />
              <source src={shot.mp4} type="video/mp4" />
            </video>
            {/* the photograph, clipped from the right: 0 hides it, 100 shows all of it */}
            <img
              src={take.src}
              alt={take.alt}
              loading="lazy"
              decoding="async"
              style={{
                objectPosition: `50% ${take.focusY ?? 50}%`,
                clipPath: `inset(0 ${100 - wipe}% 0 0)`,
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0" style={{ left: `${wipe}%` }}>
              <div className="absolute inset-y-0 -left-px w-0.5 bg-white/90" />
              <div className="absolute top-1/2 -left-5 size-10 -translate-y-1/2 rounded-full bg-white/95 shadow-md" />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={wipe}
              onChange={(e) => setWipe(Number(e.target.value))}
              aria-label={compare}
              className="absolute inset-0 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:outline-none"
            />
            {running && needsTap && wipe < 100 && (
              <button
                type="button"
                onClick={() => video.current?.play().catch(() => setNeedsTap(true))}
                className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-label text-[#0d0f10] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Play video
              </button>
            )}
          </div>

          {allowed && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSound((s) => !s)}
                className="inline-flex min-h-[44px] items-center rounded-full border border-border px-4 text-label text-text hover:bg-well"
              >
                {sound ? "Turn sound off" : "Turn sound on"}
              </button>
              <button
                type="button"
                onClick={toggle}
                className="inline-flex min-h-[44px] items-center rounded-full border border-border px-4 text-label text-text hover:bg-well"
              >
                {paused ? "Play take" : "Pause take"}
              </button>
            </div>
          )}

          <div role="group" aria-label="Choose a shot" className="flex flex-wrap gap-2">
            {takes.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={i === pick}
                onClick={() => setPick(i)}
                className={`inline-flex min-h-[44px] items-center rounded-full border px-4 text-body transition-colors ${
                  i === pick ? "border-text bg-text text-surface" : "border-border bg-surface text-text hover:border-text"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <dl className="m-0 flex flex-col gap-4 rounded-3xl bg-surface p-5 shadow-sm">
            <div>
              <dt className="text-label text-teal">Subject</dt>
              <dd className="mt-1 text-body text-text">{shot.subject}</dd>
            </div>
            <div>
              <dt className="text-label text-teal">What happens</dt>
              <dd className="mt-1 text-body text-text">{shot.whatHappens}</dd>
            </div>
            <div>
              <dt className="text-label text-teal">Camera</dt>
              <dd className="mt-1 text-body text-text">{shot.camera}</dd>
            </div>
            <div>
              <dt className="text-label text-teal">Sound</dt>
              <dd className="mt-1 text-body text-text">{shot.sound}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full bg-well px-2.5 py-1 text-label text-text">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
