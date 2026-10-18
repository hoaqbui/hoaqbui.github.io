"use client";
import { useEffect, useState } from "react";
import SectionLabel from "@/ui/SectionLabel";
import Flow from "@/ui/Flow";
import WeekGrid from "@/ui/WeekGrid";
import TileFigure from "@/ui/TileFigure";
import { stories } from "@/content/stories";
import { em } from "@/ui/em";
import Reveal from "@/fx/Reveal";

// Four tiles: a number, its caption, one line on how. A tile opens its story below the grid,
// told plainly: the result as the heading, a paragraph on how, what it was worth, one picture.
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
  const picture = open
    ? open.flow
      ? <Flow rows={open.flow} label={open.vizLabel} />
      : open.grid
        ? <WeekGrid count={open.grid.count} caption={open.grid.caption} label={open.vizLabel} />
        : null
    : null;

  return (
    <section id="work" className="mx-auto max-w-[1120px] px-6 py-20">
      <SectionLabel as="h2">Work</SectionLabel>

      <Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
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
                <span className="text-label text-muted">
                  <span className="text-teal">{story.talent}</span> · {story.years}
                </span>
                <span className="flex flex-col gap-2.5 md:flex-row md:items-end md:gap-4">
                  <span className="shrink-0 text-stat font-medium text-teal">{story.num}</span>
                  <span className="text-heading font-medium text-text">{story.numNote}</span>
                </span>
                <span className="mt-auto flex flex-col gap-3.5 pt-1.5 text-body">
                  <TileFigure fig={story.tile} label={story.how} />
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
            <p className="text-label text-muted">
              <span className="text-teal">{open.talent}</span> · {open.years}
            </p>
            <h3 className="mt-2 max-w-[820px] text-title font-medium text-text">
              {em(open.title)}
            </h3>
            <div className="mt-6 flex flex-col gap-6">
              {open.pictureFirst && picture}
              <div className="flex max-w-[760px] flex-col gap-4">
                <p className="m-0 text-lead text-text">{open.body}</p>
                <p className="m-0 text-lead font-medium text-text">{open.worth}</p>
                {open.quote && (
                  <blockquote className="m-0 border-l-2 border-teal pl-4">
                    <p className="m-0 text-lead text-text">“{open.quote.text}”</p>
                    <footer className="mt-1 text-label text-muted">{open.quote.by}</footer>
                  </blockquote>
                )}
              </div>
              {!open.pictureFirst && picture}
            </div>
            <p className="mt-5 text-label text-muted">{open.role}</p>
          </article>
        )}
      </div>
    </section>
  );
}
