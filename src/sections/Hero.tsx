"use client";

import { Fragment } from "react";
import Link from "next/link";
import { LinkedInIcon } from "@/ui/Icons";
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
          {/* the name, with LinkedIn's mark beside it; Résumé lives in the nav Contact sheet (user, 2026-10-19) */}
          <div className="flex items-center justify-between gap-3 md:justify-start md:gap-6">
            <p className="text-heading font-semibold">{profile.name}</p>
            <div className="flex items-center gap-2">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="inline-flex size-11 items-center justify-center rounded-full bg-[#0a66c2] text-white shadow-sm transition-transform motion-safe:hover:scale-[1.06]"
              >
                <LinkedInIcon size={20} />
              </a>
            </div>
          </div>
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
          {/* the AI work is far down the page; point at it from the first screen (Codex UX pass) */}
          <Link
            href="/building/intent-to-video/"
            className="mt-6 inline-flex min-h-[44px] items-center text-body text-muted hover:text-text"
          >
            Now building&nbsp;<span className="font-medium text-teal">Compo</span>, an AI video workflow →
          </Link>
        </div>
      </Parallax>
    </section>
  );
}
