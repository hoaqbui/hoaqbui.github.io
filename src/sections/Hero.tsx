"use client";

import { useMotion } from "@/fx/useMotion";
import HeroBackground from "@/fx/HeroBackground";
import { profile } from "@/content/profile";

import Parallax from "@/fx/Parallax";

// The 3-second story: who, the one claim, one line of history and one proof point.
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
      <Parallax className="relative z-10 max-w-3xl px-6 text-center">
        <p className="text-lg font-semibold">{profile.name}</p>
        <p className="mt-2 font-mono text-[13px] text-muted">
          {profile.roleLine}
        </p>
        <h1 className="mt-5 text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.035em]">
          {profile.headline}
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-[15px] md:text-[17px] text-muted">
          {profile.subLine}
        </p>
        <a
          href="#greybox"
          data-latest
          className="mt-7 inline-flex min-h-[44px] flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-border bg-surface px-5 py-2 text-[15px] text-text"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Latest</span>
          <span>
            {profile.latest.label}: <strong className="font-semibold">{profile.latest.value}</strong>
          </span>
        </a>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
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
        </div>
      </Parallax>
    </section>
  );
}
