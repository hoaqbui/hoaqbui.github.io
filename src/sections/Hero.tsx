"use client";

import { Fragment } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { em } from "@/ui/em";
import { LinkedInIcon } from "@/ui/Icons";
import HeroShot, { type HeroTake } from "@/ui/HeroShot";

// the hero's take: Compo's lantern clip from the Intent-to-video page, played from its prompt
// (user, 2026-10-26; replaces the Prague weir photograph and its shot)
const lantern = projects.find((p) => p.id === "intent-to-video")!.shots!.clips![0];
const prompt = lantern.caption.replace(/[“”]/g, "");
const take: HeroTake = {
  id: "lantern",
  poster: lantern.poster,
  alt: prompt,
  webm: `${lantern.src}.webm`,
  mp4: `${lantern.src}.mp4`,
  prompt,
};

// The 3-second story: who and what (the strip), what Hoa builds (the headline and the sentence
// under it), where (the logos), and a sentence becoming a shot beside it (user, 2026-10-26).
// The proof numbers live in Work; the Latest chip left the hero (user, 2026-10-18).
// The landing owns the whole first screen, content centered, nothing of the next section
// peeking in (user, 2026-10-20: more white space; reverses the Codex "tighter hero" fix).
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center pt-20 pb-24 md:pt-28 md:pb-20"
    >
      {/* LinkedIn at the landing's top right (user, 2026-10-20); on phones it sits left of the
          theme toggle, which owns the corner. It scrolls away with the landing. */}
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener"
        aria-label="LinkedIn"
        className="absolute right-[68px] top-[calc(12px+env(safe-area-inset-top))] z-20 inline-flex size-11 items-center justify-center rounded-full bg-[#0a66c2] text-white shadow-sm transition-transform motion-safe:hover:scale-[1.06] md:right-6 md:top-5"
      >
        <LinkedInIcon size={20} />
      </a>
      <div className="grid w-full max-w-[1120px] items-center gap-7 px-6 md:grid-cols-[1fr_1.05fr] md:gap-10">
        <div className="max-w-3xl">
          <p className="text-heading">{profile.name}</p>
          <p className="mt-2 text-body text-muted">
            {profile.roleLine.split(" · ").map((part, i, all) => (
              <Fragment key={part}>
                <span className={`whitespace-nowrap ${i === 0 ? "font-medium text-text" : ""}`}>
                  {part}
                  {i < all.length - 1 && <span aria-hidden="true" className="opacity-40"> ·</span>}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <h1 className="mt-5 text-balance text-display">
            {em(profile.headline)}
          </h1>
          {/* the AI work is far down the page; the hero's second sentence points at it */}
          <p className="mt-5 max-w-[36ch] text-body text-text">
            <Link href="/building/intent-to-video/" className="hover:text-teal">
              18 years of film and game pipelines. Now building <span className="font-medium text-teal">Compo</span>, my AI video pipeline on Wan and LTX&nbsp;→
            </Link>
          </p>
          <div
            role="list"
            aria-label="Studios"
            className="mt-9 flex items-center gap-x-6 text-muted opacity-55 md:gap-x-12 [[data-theme=dark]_&]:opacity-80"
          >
            {profile.logos.map((logo) => (
              <span
                key={logo.name}
                role="listitem"
                aria-label={logo.name}
                // one row at any width: each mark shrinks with its aspect ratio kept
                className="block min-w-0 shrink bg-current"
                style={{
                  width: Math.round(logo.height * logo.ratio),
                  aspectRatio: logo.ratio,
                  mask: `url(${logo.src}) center / contain no-repeat`,
                  WebkitMask: `url(${logo.src}) center / contain no-repeat`,
                }}
              />
            ))}
          </div>
        </div>
        <HeroShot take={take} />
      </div>
    </section>
  );
}
