"use client";

import { magic } from "@/fx/magic";
import { Fragment } from "react";
import Link from "next/link";
import { LinkedInIcon, ResumeIcon } from "@/ui/Icons";
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
      className="relative flex flex-col items-center justify-center overflow-hidden min-h-0 pt-16 pb-4 md:min-h-[540px] md:pt-0 md:pb-0"
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
            className="mt-8 flex items-center gap-x-6 text-muted opacity-75 md:gap-x-12 [[data-theme=dark]_&]:opacity-95"
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
          {/* actions as shapes, not words (user, 2026-10-19): Résumé leads, then LinkedIn's mark */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noopener"
              className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-teal px-5 font-medium text-surface shadow-sm transition-[transform,box-shadow] motion-safe:hover:scale-[1.03] ${magic.shimmer}`}
            >
              <ResumeIcon />
              Résumé
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn"
              className="inline-flex size-12 items-center justify-center rounded-full bg-[#0a66c2] text-white shadow-sm transition-transform motion-safe:hover:scale-[1.06]"
            >
              <LinkedInIcon size={22} />
            </a>
            <a href="#work" className="ml-2 inline-flex min-h-[44px] items-center font-medium text-teal">
              Impact ↓
            </a>
          </div>
          {/* the AI work is far down the page; point at it from the first screen (Codex UX pass) */}
          <Link
            href="/building/intent-to-video/"
            className="mt-2 inline-flex min-h-[44px] items-center text-body text-muted hover:text-text"
          >
            Now building&nbsp;<span className="font-medium text-teal">Compo</span>, an AI video workflow →
          </Link>
        </div>
      </Parallax>
    </section>
  );
}
