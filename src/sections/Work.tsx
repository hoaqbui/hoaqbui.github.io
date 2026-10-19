"use client";
import { useEffect, useState } from "react";
import SectionLabel from "@/ui/SectionLabel";
import Flow from "@/ui/Flow";
import WeekGrid from "@/ui/WeekGrid";
import TileFigure from "@/ui/TileFigure";
import { stories } from "@/content/stories";
import { em } from "@/ui/em";
import Reveal from "@/fx/Reveal";

// Four tiles: a number, its caption, a small picture. A tile opens its story beneath it,
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

  const openIndex = stories.findIndex((s) => s.id === openId);
  const open = stories[openIndex];
  const picture = open
    ? open.flow
      ? <Flow rows={open.flow} label={open.vizLabel} />
      : open.grid
        ? <WeekGrid count={open.grid.count} caption={open.grid.caption} label={open.vizLabel} />
        : null
    : null;

  return (
    <section id="work" className="mx-auto max-w-[1120px] px-6 py-20">
      <SectionLabel as="h2">Impact</SectionLabel>

      <Reveal>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {stories.map((story, i) => {
            const isOpen = openId === story.id;
            return (
              <button
                key={story.id}
                style={{ order: i * 2 }}
                type="button"
                id={story.id}
                aria-expanded={isOpen}
                aria-controls="work-story"
                onClick={() => toggle(story.id)}
                className={`flex min-h-[230px] cursor-pointer flex-col gap-2.5 rounded-[20px] border p-7 text-left transition-colors duration-300 motion-reduce:transition-none ${
                  isOpen ? "border-teal bg-surface" : "border-border bg-surface hover:border-teal/60"
                }`}
              >
                <span className="flex items-baseline justify-between gap-4 text-label text-muted">
                  <span>{story.impact}</span>
                  <span>{story.years}</span>
                </span>
                <span className="flex flex-col gap-2.5 md:flex-row md:items-end md:gap-4">
                  <span className="shrink-0 text-stat font-semibold text-teal">{story.num}</span>
                  <span className="text-heading font-medium text-text">{story.numNote}</span>
                </span>
                <span className="mt-auto flex flex-col gap-3.5 pt-1.5 text-body">
                  <TileFigure fig={story.tile} label={story.how} />
                  <span className="whitespace-nowrap font-medium text-teal">{isOpen ? "Close ↑" : "The story →"}</span>
                </span>
              </button>
            );
          })}
          {/* The story opens right under its tile on a phone, under the tile's row on desktop
              (user bug report, 2026-10-18: it used to open below all four tiles). */}
          <div
            id="work-story"
            aria-live="polite"
            className="col-span-full order-(--story-at) empty:hidden md:order-(--story-at-md)"
            style={{ "--story-at": openIndex * 2 + 1, "--story-at-md": (openIndex | 1) * 2 + 1 } as React.CSSProperties}
          >
            {open && (
              <article className="rounded-[20px] border border-teal bg-surface p-6 md:p-8">
                <p className="text-label text-muted">
                  <span>{open.talent}</span> <span className="ml-2 opacity-70">{open.years}</span>
                </p>
                <h3 className="mt-2 max-w-[820px] text-title font-semibold text-text">
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
        </div>
      </Reveal>
    </section>
  );
}
