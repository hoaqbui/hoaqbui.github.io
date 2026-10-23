/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import SectionLabel from "@/ui/SectionLabel";
import { em } from "@/ui/em";
import Reveal from "@/fx/Reveal";
import ContactRow from "@/ui/ContactRow";
import { copy, heroImage, rows } from "@/content/prototyping";

export default function Prototyping() {
  return (
    <main className="overflow-x-clip">
      <div className="mx-auto max-w-[1120px] px-6 pt-24 pb-32">
        {/* Top: step 2 */}
        <div>
          <h1 className="text-title font-semibold text-text">{copy.title}</h1>
          <p data-thesis className="mt-2 max-w-[640px] text-body font-medium text-text">
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
            className="my-4 block h-[180px] w-auto max-w-full rounded-xl border border-border object-cover shadow-xs sm:h-[280px]"
          />
          <p data-count className="text-label font-mono text-teal">
            {copy.count}
          </p>
          <p className="mt-4 max-w-[640px] text-body text-muted">{copy.intro}</p>
          <p className="mt-2 mb-12 max-w-[640px] text-label italic text-muted/80">{copy.note}</p>
        </div>

        {/* Rows in order: step 3, 4, 5 */}
        <Reveal>
          <div className="space-y-6">
            {rows.map((row) => {
              const hasCallout = Boolean(row.callout && copy.callouts[row.callout]);
              const isAura = row.id === "aura";

              return (
                <div key={row.id}>
                  {hasCallout && (
                    <aside className="my-8 rounded-xl border border-teal/30 bg-teal/5 p-4 sm:p-5 text-body font-medium text-text">
                      <p className="flex items-start gap-3">
                        <span aria-hidden="true" className="select-none text-base font-bold text-teal">
                          ✦
                        </span>
                        <span>{copy.callouts[row.callout!]}</span>
                      </p>
                    </aside>
                  )}

                  {isAura && (
                    <div className="mt-12 mb-6">
                      <p className="max-w-[640px] text-heading font-medium text-text">
                        {copy.aura_intro}
                      </p>
                    </div>
                  )}

                  <ContactRow row={row} />
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* How this is possible: step 6 */}
        <Reveal>
          <div className="mt-16 border-t border-border pt-12">
            <SectionLabel className="mb-4">Pattern</SectionLabel>
            <h2 className="mb-6 text-title font-semibold text-text">How this is possible</h2>
            <ol className="m-0 max-w-[640px] list-none space-y-4 p-0">
              {copy.how.map((item, idx) => (
                <li key={idx} className="flex items-baseline gap-4">
                  <span className="shrink-0 font-mono text-label text-teal">0{idx + 1}</span>
                  <p className="m-0 text-body text-muted">{em(item)}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* Close: step 7 */}
        <Reveal>
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="mb-6 text-heading font-semibold text-text">
              {copy.close.heading}
            </h2>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="mailto:hoaqbui@gmail.com?subject=How%20I%20prototype"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-teal px-6 py-2.5 text-body font-medium text-surface transition-opacity hover:opacity-90"
              >
                Email me
              </a>
              <Link
                href="/#how"
                className="inline-flex min-h-[44px] items-center text-body font-medium text-muted transition-colors hover:text-text"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
