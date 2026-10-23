/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import SectionLabel from "@/ui/SectionLabel";
import { em } from "@/ui/em";
import Reveal from "@/fx/Reveal";
import Decision from "@/ui/Decision";
import ContactRow from "@/ui/ContactRow";
import { copy, heroImage, decisions, rows } from "@/content/prototyping";
import { profile } from "@/content/profile";

export default function Prototyping() {
  const auraRow = rows.find((r) => r.id === "aura");
  const codaFrames = auraRow?.frames.filter((f) => f.id === "aura-1" || f.id === "aura-4") ?? [];

  return (
    <main className="overflow-x-clip">
      <div className="mx-auto max-w-[1120px] px-6 pt-20 pb-32 sm:pt-24">
        {/* Top: 1. h1, opening, thesis, hero, count, intro, note */}
        <div>
          <h1 className="text-title text-text">{copy.title}</h1>
          <p data-opening className="mt-2 text-lead text-text">
            {copy.opening}
          </p>
          <p data-thesis className="mt-2 max-w-[640px] text-body text-text">
            {copy.thesis}
          </p>
          <img
            data-hero
            src={heroImage.src}
            width={heroImage.width}
            height={heroImage.height}
            loading="eager"
            fetchPriority="high"
            alt={heroImage.alt}
            className="my-3 block h-[150px] w-auto max-w-full rounded-xl border border-border object-cover shadow-xs sm:h-[260px]"
          />
          <p data-count className="text-label text-muted tabular-nums">
            {copy.count}
          </p>
          <p className="mt-4 max-w-[640px] text-body text-muted">{copy.intro}</p>
          <p className="mt-2 mb-12 max-w-[640px] text-label text-muted">{copy.note}</p>
        </div>

        {/* 2. Three decisions */}
        <Reveal>
          <div className="space-y-6">
            {decisions.map((decision) => (
              <Decision key={decision.id} decision={decision} />
            ))}
          </div>
        </Reveal>

        {/* 3. Rows intro and rows (compact mode; aura excluded) */}
        <Reveal>
          <div className="mt-12 mb-6">
            <h2 className="text-heading text-text">{copy.rows_intro}</h2>
          </div>
          <div className="space-y-6">
            {rows
              .filter((row) => row.id !== "aura")
              .map((row) => (
                <ContactRow key={row.id} row={row} />
              ))}
          </div>
        </Reveal>

        {/* 4. Aura coda */}
        <Reveal>
          <section data-coda className="mt-12 border-t border-border pt-8 pb-10">
            <p className="mb-6 max-w-[640px] text-heading text-text">
              {copy.aura_intro}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {codaFrames.map((frame) => (
                <figure
                  key={frame.id}
                  data-frame={frame.id}
                  className="flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
                    <img
                      src={frame.src}
                      width={frame.width}
                      height={frame.height}
                      loading="lazy"
                      alt={frame.caption}
                      className="block h-auto w-full object-cover object-top max-h-[300px]"
                    />
                  </div>
                  <figcaption className="mt-2 text-label text-text">
                    {frame.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </Reveal>

        {/* 5. How this is possible */}
        <Reveal>
          <div className="mt-16 border-t border-border pt-12">
            <SectionLabel className="mb-4">Pattern</SectionLabel>
            <h2 className="mb-6 text-title text-text">How this is possible</h2>
            <ol className="m-0 max-w-[640px] list-none space-y-4 p-0">
              {copy.how.map((item, idx) => (
                <li key={idx} className="flex items-baseline gap-4">
                  <span className="shrink-0 text-label text-muted tabular-nums">0{idx + 1}</span>
                  <p className="m-0 text-body text-muted">{em(item)}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* 6. Close */}
        <Reveal>
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="mb-6 text-title text-text">
              {copy.close.heading}
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(copy.close.email_subject)}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-teal px-6 py-2.5 text-body font-medium text-surface transition-opacity hover:opacity-90"
              >
                Email me
              </a>
              <Link
                href="/#how"
                className="inline-flex min-h-[44px] items-center text-body font-medium text-muted transition-colors hover:text-text"
              >
                {copy.close.back}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
