"use client";

import { useState, Fragment } from "react";
import { projects } from "@/content/projects";

export default function Building() {
  const [current, setCurrent] = useState(0);
  const n = projects.length;

  const prev = () => setCurrent((c) => (c - 1 + n) % n);
  const next = () => setCurrent((c) => (c + 1) % n);

  const getCardStyle = (d: number) => {
    switch (d) {
      case 0:
        return {
          transform: "translate(0px, 0px) rotate(0deg) scale(1)",
          zIndex: 3,
          opacity: 1,
          filter: "blur(0px)",
          boxShadow:
            "0 2px 4px rgba(20,24,26,.06), 0 40px 80px rgba(20,24,26,.20)",
        };
      case 1:
        return {
          transform:
            "translate(calc(36px * var(--offset-factor, 1)), calc(-26px * var(--offset-factor, 1))) rotate(4deg) scale(0.94)",
          zIndex: 2,
          opacity: 0.85,
          filter: "blur(1px)",
          boxShadow: "0 20px 50px rgba(20,24,26,.12)",
        };
      case 2:
        return {
          transform:
            "translate(calc(-34px * var(--offset-factor, 1)), calc(-44px * var(--offset-factor, 1))) rotate(-5deg) scale(0.88)",
          zIndex: 1,
          opacity: 0.6,
          filter: "blur(2px)",
          boxShadow: "0 14px 40px rgba(20,24,26,.10)",
        };
      default:
        return {
          transform:
            "translate(0px, calc(-60px * var(--offset-factor, 1))) rotate(0deg) scale(0.82)",
          zIndex: 0,
          opacity: 0,
          filter: "blur(3px)",
          boxShadow: "none",
        };
    }
  };

  return (
    <section
      id="building"
      className="mx-auto max-w-[1120px] px-6 py-20 flex flex-wrap gap-12 items-center overflow-hidden"
    >
      <div className="flex-[1_1_340px] max-w-[420px] min-w-0">
        <p className="font-mono text-[13px] text-muted">Building now</p>
        <h2 className="mt-3 text-[40px] leading-[1.1] tracking-[-0.035em] font-medium">
          What I’m building with my own hands.
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Each one is a bet on how people will make things with AI.
        </p>
        <div className="mt-7 flex flex-col gap-1">
          {projects.map((project, index) => {
            const isActive = index === current;
            return (
              <button
                key={project.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setCurrent(index)}
                className={`flex min-h-[48px] items-baseline gap-3.5 rounded-xl px-3.5 py-2.5 text-left text-base transition-colors duration-300 motion-reduce:transition-none ${
                  isActive
                    ? "bg-surface text-text shadow-sm"
                    : "text-muted hover:text-text bg-transparent"
                }`}
              >
                <span
                  className={`font-mono text-xs ${
                    isActive ? "text-teal" : "text-muted"
                  }`}
                >
                  0{index + 1}
                </span>
                <span>{project.title}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous project"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-surface text-base text-text cursor-pointer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border bg-surface text-base text-text cursor-pointer"
          >
            →
          </button>
          <div aria-hidden="true" className="ml-2 flex items-center gap-1.5">
            {projects.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                  index === current ? "w-[22px] bg-teal" : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-[1_1_520px] min-w-0 w-full grid grid-cols-1 items-start [--offset-factor:0.5] md:[--offset-factor:1]">
        {projects.map((project, index) => {
          const d = (index - current + n) % n;
          return (
            <article
              key={project.id}
              onClick={() => {
                if (d !== 0) setCurrent(index);
              }}
              aria-hidden={d !== 0 ? true : undefined}
              style={getCardStyle(d)}
              className={`[grid-area:1/1] w-[92%] max-w-[560px] mx-auto rounded-3xl bg-surface p-6 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                d !== 0 ? "cursor-pointer pointer-events-auto" : ""
              }`}
            >
              {!project.status.startsWith("[") && (
                <div className="flex items-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-well px-2.5 py-1 font-mono text-[11px] text-text">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        project.live ? "bg-teal" : "bg-amber"
                      }`}
                    />
                    {project.status}
                  </span>
                </div>
              )}
              <h3 className="mt-4 text-2xl font-medium tracking-tight text-text">
                {project.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {project.body}
              </p>
              {project.steps && project.steps.length > 0 && (
                <div
                  role="img"
                  aria-label={`${project.title} stages: ${project.steps.join(", ")}`}
                  className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-well p-4"
                >
                  {project.steps.map((step, idx) => (
                    <Fragment key={idx}>
                      {idx > 0 && (
                        <span
                          aria-hidden="true"
                          className="font-medium text-teal"
                        >
                          →
                        </span>
                      )}
                      <span className="rounded-full bg-surface px-3 py-1.5 font-mono text-[11px] text-text">
                        {step}
                      </span>
                    </Fragment>
                  ))}
                </div>
              )}
              {project.why && !project.why.startsWith("[") && (
                <p className="mt-3 text-sm text-muted">Why: {project.why}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.chips
                  .filter((chip) => !chip.startsWith("["))
                  .map((chip, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#eef1ee] px-2.5 py-1 font-mono text-[11px] text-[#1f2326]"
                    >
                      {chip}
                    </span>
                  ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
