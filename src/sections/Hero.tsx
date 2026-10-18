"use client";

import { Fragment } from "react";
import { useMotion } from "@/fx/useMotion";
import HeroBackground from "@/fx/HeroBackground";
import { profile } from "@/content/profile";
import { em } from "@/ui/em";

import Parallax from "@/fx/Parallax";

// The 3-second story: who and what (the strip), the mission, where (the logos).
// The proof numbers live in Work; the Latest chip left the hero (user, 2026-10-18).
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
          <div className="mt-8 flex flex-wrap gap-6">
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
