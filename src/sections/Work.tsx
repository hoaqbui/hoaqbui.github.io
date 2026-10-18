"use client";
import { useEffect, useState } from "react";
import SectionLabel from "@/ui/SectionLabel";
import Flow from "@/ui/Flow";
import WeekGrid from "@/ui/WeekGrid";
import { stories } from "@/content/stories";
import Reveal from "@/fx/Reveal";

// The proof for the headline as four tiles: a number, its caption, one line on the fix.
// A tile opens its story below the grid: the three beats and the picture.
export default function Work() {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (stories.some((s) => s.id === hash)) setOpenId(hash);
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    window.history.replaceState(null, "", next ? `#${next}` : "#work");
  };

  const open = stories.find((s) => s.id === openId);

  return (
    <section id="work" className="mx-auto max-w-[1120px] px-6 py-20">
      <div className="flex flex-wrap items-baseline gap-x-16 gap-y-3">
        <SectionLabel as="h2" className="flex-[0_0_200px]">
          Work
        </SectionLabel>
        <p className="max-w-[640px] flex-[1_1_420px] text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.2] tracking-[-0.025em]">
          Four problems at Riot. Four numbers.
        </p>
      </div>

      <Reveal>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {stories.map((story) => {
            const isOpen = openId === story.id;
            return (
              <button
                key={story.id}
                type="button"
                id={story.id}
                aria-expanded={isOpen}
                aria-controls="work-story"
                onClick={() => toggle(story.id)}
                className={`flex min-h-[230px] cursor-pointer flex-col gap-2.5 rounded-[20px] border p-7 text-left transition-colors duration-300 motion-reduce:transition-none ${
                  isOpen ? "border-teal bg-surface" : "border-border bg-surface hover:border-teal/60"
                }`}
              >
                <span className="font-mono text-[12px] text-muted">
                  <span className="text-teal">{story.kind}</span> · {story.years}
                </span>
                <span className="text-[56px] font-medium leading-none tracking-[-0.04em] text-teal md:text-[64px]">{story.num}</span>
                <span className="text-[19px] font-medium leading-[1.25] tracking-[-0.015em] text-text">{story.numNote}</span>
                <span className="mt-auto text-[15px] leading-snug text-muted">
                  {story.how}{" "}
                  <span className="whitespace-nowrap font-medium text-teal">{isOpen ? "Close ↑" : "The story →"}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div id="work-story" aria-live="polite">
        {open && (
          <article className="mt-5 rounded-[20px] border border-teal bg-surface p-6 md:p-8">
            <p className="font-mono text-[12px] text-muted">
              <span className="text-teal">{open.kind}</span> · {open.who} · Riot · {open.years}
            </p>
            <h3 className="mt-2 text-[24px] font-medium leading-[1.2] tracking-[-0.025em] text-text md:text-[30px]">{open.title}</h3>
            <dl className="mt-6 flex flex-col gap-4">
              {[
                { label: "The problem", value: open.problem },
                { label: "The call", value: open.call },
                { label: "The result", value: open.result },
              ].map((b) => (
                <div key={b.label} className="grid grid-cols-[112px_1fr] gap-4 border-t border-border pt-4">
                  <dt className="pt-1 font-mono text-xs text-muted">{b.label}</dt>
                  <dd className="m-0 text-[17px] leading-snug text-text">{b.value}</dd>
                </div>
              ))}
            </dl>
            {open.flow ? (
              <div className="mt-8">
                <Flow rows={open.flow} label={open.vizLabel} />
              </div>
            ) : open.grid ? (
              <div className="mt-8">
                <WeekGrid count={open.grid.count} caption={open.grid.caption} label={open.vizLabel} />
              </div>
            ) : null}
            <p className="mt-5 font-mono text-[12px] text-muted">{open.role}</p>
          </article>
        )}
      </div>
    </section>
  );
}
