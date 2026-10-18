"use client";

import { Fragment } from "react";
import { useMotion } from "@/fx/useMotion";
import HeroBackground from "@/fx/HeroBackground";
import { profile } from "@/content/profile";
import { em } from "@/ui/em";

import Parallax from "@/fx/Parallax";

// The 3-second story: who and what (the strip), the mission, where (the logos), one proof point.
// The numbers and their stories live in Work, so they appear once.
export default function Hero() {
  const { ref, running } = useMotion<HTMLElement>();

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden min-h-0 pt-16 pb-16 md:min-h-[680px] md:pt-0 md:pb-0"
    >
      <HeroBackground running={running} />
      <Parallax className="relative z-10 w-full max-w-[1120px] px-6">
        <div className="max-w-3xl">
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {profile.roleLine.split(" · ").map((part, i, all) => (
              <Fragment key={part}>
                <span className={`whitespace-nowrap ${i === 0 ? "text-teal" : ""}`}>
                  {part}
                  {i < all.length - 1 && <span aria-hidden="true"> ·</span>}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <h1 className="mt-5 text-balance text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em]">
            {em(profile.headline)}
          </h1>
          <div
            role="list"
            aria-label="Studios"
            className="mt-8 flex items-center gap-x-6 text-muted opacity-75 md:gap-x-12"
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
          <a
            href="#greybox"
            data-latest
            className="mt-7 inline-flex min-h-[44px] flex-wrap items-center justify-start gap-x-3 text-left gap-y-1 rounded-full border border-border bg-surface px-5 py-2 text-[15px] text-text"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Latest</span>
            <span>
              {profile.latest.label}: <strong className="font-semibold">{profile.latest.value}</strong>
            </span>
          </a>
          <div className="mt-6 flex flex-wrap gap-6">
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-[44px] items-center font-medium text-teal"
            >
              Résumé →
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-[44px] items-center font-medium text-teal"
            >
              LinkedIn →
            </a>
            <a href="#work" className="inline-flex min-h-[44px] items-center font-medium text-teal">
              Work →
            </a>
          </div>
        </div>
      </Parallax>
    </section>
  );
}
