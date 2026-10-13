"use client";

import { useMotion } from "@/fx/useMotion";
import HeroBackground from "@/fx/HeroBackground";
import { profile } from "@/content/profile";
import { proof } from "@/content/proof";

import Parallax from "@/fx/Parallax";
import Reveal from "@/fx/Reveal";

export default function Hero() {
  const { ref, allowed, paused, running, toggle } = useMotion<HTMLElement>();

  return (
    <>
      <section
        id="top"
        ref={ref}
        className="relative flex flex-col items-center justify-center overflow-hidden min-h-[100svh] md:min-h-[640px]"
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
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-[44px] items-center font-medium text-teal"
            >
              Email me →
            </a>
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-[44px] items-center font-medium text-teal"
            >
              Résumé →
            </a>
          </div>
        </Parallax>
        {allowed && (
          <button
            type="button"
            aria-pressed={paused}
            onClick={toggle}
            className="absolute bottom-24 md:bottom-6 right-6 inline-flex min-h-[44px] items-center rounded-full border border-border bg-surface/80 px-4 font-mono text-xs text-muted"
          >
            {paused ? "Play motion" : "Pause motion"}
          </button>
        )}
      </section>

      <Reveal>
        <section
          aria-label="Proof"
          className="mx-auto max-w-[1120px] border-t border-border px-6 py-16 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8"
        >
          {proof.map((item, index) => (
            <div key={index}>
              <div className="text-4xl font-medium tracking-[-0.03em]">
                {item.value}
              </div>
              <div className="mt-1.5 text-sm text-muted">{item.label}</div>
            </div>
          ))}
        </section>
      </Reveal>
    </>
  );
}
