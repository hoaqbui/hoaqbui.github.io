"use client";
import SectionLabel from "@/ui/SectionLabel";

import { useState, useEffect } from "react";
import Bars from "@/ui/Bars";
import ReachChips from "@/ui/ReachChips";
import { stories } from "@/content/stories";
import { profile } from "@/content/profile";
import Reveal from "@/fx/Reveal";

export default function Work() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (stories.some((s) => s.id === hash)) {
        setOpenId(hash);
        const el = document.getElementById(hash);
        if (el) {
          const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;
          el.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
          });
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleToggle = (id: string) => {
    if (openId === id) {
      setOpenId(null);
      window.history.replaceState(null, "", "#work");
    } else {
      setOpenId(id);
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <section
      id="work"
      className="mx-auto max-w-[1120px] px-6 py-20 border-t border-border"
    >
      <div className="flex flex-wrap items-baseline gap-x-16 gap-y-3">
        <SectionLabel as="h2" className="flex-[0_0_200px]">
          Work
        </SectionLabel>
        <p className="max-w-[620px] flex-[1_1_420px] text-2xl leading-[1.4] tracking-[-0.015em]">
          A few things I’m proud of from 13 years at Riot.
        </p>
      </div>

      <div className="mt-12 flex flex-col">
        {stories.map((story) => {
          const isOpen = openId === story.id;
          const fields = [
            { label: "Context", value: story.context },
            { label: "My call", value: story.call },
            { label: "Trade-off", value: story.tradeOff },
            { label: "Result", value: story.result },
          ].filter((f) => f.value && !f.value.startsWith("["));

          const hasTeam = story.team && !story.team.startsWith("[");
          const roleLine = hasTeam
            ? `${story.role} · ${story.team} · ${story.years}`
            : `${story.role} · ${story.years}`;

          return (
            <Reveal key={story.id}>
              <article
                id={story.id}
                style={{
                  boxShadow: isOpen
                    ? "0 1px 2px rgba(20,24,26,.05), 0 12px 24px rgba(20,24,26,.06), 0 40px 80px rgba(20,24,26,.10)"
                    : "none",
                }}
                className={`transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                  isOpen
                    ? "bg-surface rounded-[20px] border-t border-transparent -translate-y-1 px-7 my-3"
                    : "border-t border-border bg-transparent px-0 my-0 translate-y-0"
                }`}
              >
                <h3 className="m-0 font-normal">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${story.id}-panel`}
                    onClick={() => handleToggle(story.id)}
                    className="flex w-full min-h-[88px] py-6 text-left cursor-pointer flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-none bg-transparent font-inherit"
                  >
                    <div className="flex flex-col gap-1 basis-[180px]">
                      <span className="font-mono text-xs text-muted">
                        {story.numNote}
                      </span>
                      <span className="text-[34px] font-medium tracking-[-0.03em] text-teal">
                        {story.num}
                      </span>
                    </div>
                    <div className="flex flex-1 min-w-0 flex-col gap-1.5 basis-[320px]">
                      <span className="text-[22px] tracking-[-0.02em] font-medium text-text">
                        {story.title}
                      </span>
                      <span className="font-mono text-[13px] text-muted">
                        Riot · {story.years}
                      </span>
                      <span className="mt-1 flex flex-wrap gap-1.5" data-story-tags>
                        {story.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-well px-2.5 py-1 font-mono text-[11px] text-text">
                            {tag}
                          </span>
                        ))}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="font-mono text-lg text-teal"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div id={`${story.id}-panel`} className="pb-8">
                    {fields.length > 0 && (
                      <dl className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 pt-6 border-t border-border">
                        {fields.map((f, i) => (
                          <div key={i}>
                            <dt className="font-mono text-xs text-muted">
                              {f.label}
                            </dt>
                            <dd className="mt-2 text-base leading-relaxed text-text">
                              {f.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    <p className="mt-6 font-mono text-[13px] text-muted">
                      {roleLine}
                    </p>
                    {story.bars ? (
                      <div className="mt-6">
                        <Bars
                          bars={story.bars}
                          note={story.vizNote}
                          label={story.vizLabel}
                        />
                      </div>
                    ) : story.reach ? (
                      <div className="mt-6">
                        <ReachChips
                          from={story.reach.from}
                          to={story.reach.to}
                          label={story.vizLabel}
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
        <div className="border-t border-border" />
      </div>

      <Reveal>
        <blockquote className="mt-14 max-w-[720px]">
          <p className="text-2xl leading-[1.4] tracking-[-0.015em]">
            “{profile.quote.text}”
          </p>
          <footer className="mt-3 font-mono text-[13px] text-muted">
            {profile.quote.by}
          </footer>
        </blockquote>
      </Reveal>
    </section>
  );
}
