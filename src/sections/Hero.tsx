"use client";

import { Fragment } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";
import { photos } from "@/content/photos";
import { em } from "@/ui/em";
import { LinkedInIcon } from "@/ui/Icons";
import HeroShot, { type HeroTake } from "@/ui/HeroShot";

// the hero's take: the Prague weir, whose moving water shows the photo → shot change best
const weir = photos.find((p) => p.id === "cz-prague-weir")!;
const take: HeroTake = {
  id: weir.id,
  src: weir.src,
  small: `/photos/${weir.id}-800.webp`,
  width: weir.width,
  alt: weir.alt,
  webm: weir.shot!.webm,
  mp4: weir.shot!.mp4,
};

// The 3-second story: who and what (the strip), the mission, where (the logos), and the
// Still → Shot frame beside it (user, 2026-10-19; replaces the random network background).
// The proof numbers live in Work; the Latest chip left the hero (user, 2026-10-18).
// The numbers and their stories live in Work, so they appear once.
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
          <p className="text-heading font-semibold">{profile.name}</p>
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
          <h1 className="mt-5 text-balance text-display font-semibold">
            {em(profile.headline)}
          </h1>
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
          {/* the AI work is far down the page; point at it from the first screen (Codex UX pass) */}
          <Link
            href="/building/intent-to-video/"
            className="mt-7 inline-flex min-h-[44px] items-center text-body text-muted hover:text-text"
          >
            Now building&nbsp;<span className="font-medium text-teal">Compo</span>, an AI video workflow →
          </Link>
        </div>
        <HeroShot take={take} />
      </div>
    </section>
  );
}
