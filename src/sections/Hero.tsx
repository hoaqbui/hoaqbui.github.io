"use client";

import { useMotion } from "@/fx/useMotion";
import HeroBackground from "@/fx/HeroBackground";
import { profile } from "@/content/profile";
import { proof, proofLabel } from "@/content/proof";

import Parallax from "@/fx/Parallax";
import Reveal from "@/fx/Reveal";

export default function Hero() {
  const { ref, allowed, paused, running, toggle } = useMotion<HTMLElement>();

  return (
    <>
      <section
        id="top"
        ref={ref}
        className="relative flex flex-col items-center justify-center overflow-hidden min-h-0 pt-16 pb-6 md:min-h-[640px] md:pt-0 md:pb-0"
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
          <p className="mt-4 max-w-xl mx-auto text-[15px] md:text-base text-muted">
            {profile.subLine}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
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
        {allowed && (
          <button
            type="button"
            aria-pressed={paused}
            onClick={toggle}
            className="absolute left-3 top-[calc(12px+env(safe-area-inset-top))] md:left-auto md:top-auto md:bottom-6 md:right-6 z-20 inline-flex min-h-[44px] items-center rounded-full border border-border bg-surface/80 px-4 font-mono text-xs text-muted"
          >
            {paused ? "Play motion" : "Pause motion"}
          </button>
        )}
      </section>

      <Reveal>
        <section
          aria-label="Proof"
          className="mx-auto max-w-[1120px] border-t border-border px-6 pt-8 pb-16 md:py-16"
        >
          <p className="font-mono text-[12px] text-muted mb-4 md:mb-6">{proofLabel}</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
            {proof.map((item, index) => (
              <div key={index}>
                <div className="text-sm text-muted">{item.label}</div>
                <div className="mt-1.5 text-4xl font-medium tracking-[-0.03em]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <p data-industries className="mt-8 md:mt-10 font-mono text-[12px] text-muted">
            {profile.industries.join(" · ")}
          </p>
        </section>
      </Reveal>
    </>
  );
}
