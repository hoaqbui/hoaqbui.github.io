import Link from "next/link";
import { projects } from "@/content/projects";
import { diagrams } from "@/ui/diagrams";

export default function Project({ id }: { id: string }) {
  const currentIndex = projects.findIndex((p) => p.id === id);
  if (currentIndex === -1) {
    return null;
  }

  const project = projects[currentIndex];
  const n = projects.length;
  const prevProject = projects[(currentIndex - 1 + n) % n];
  const nextProject = projects[(currentIndex + 1) % n];

  const Diagram = diagrams[project.id];
  const showStatus = project.status && !project.status.startsWith("[");
  const showWhy = Boolean(project.why && !project.why.startsWith("["));
  const validSteps = (project.steps ?? []).filter((s) => !s.startsWith("["));
  const validChips = (project.chips ?? []).filter((c) => !c.startsWith("["));

  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-28 pb-32">
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        <Link
          href="/#building"
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-text transition-colors"
        >
          ← Building
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/building/${prevProject.id}/`}
            aria-label={`Previous project: ${prevProject.title}`}
            className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-surface px-4 text-sm text-text hover:border-text transition-colors"
          >
            ← {prevProject.title}
          </Link>
          <Link
            href={`/building/${nextProject.id}/`}
            aria-label={`Next project: ${nextProject.title}`}
            className="inline-flex min-h-[44px] items-center rounded-full bg-text px-4 text-sm text-surface hover:opacity-90 transition-opacity"
          >
            {nextProject.title} →
          </Link>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {showStatus && (
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
          <h1 className="text-[40px] leading-[1.1] tracking-tight font-medium text-text">
            {project.title}
          </h1>
          {Diagram && (
            <div className="rounded-3xl bg-surface p-6">
              <Diagram />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-mono text-sm text-muted">What it is</h2>
            <p className="mt-2.5 text-[17px] leading-relaxed text-text">
              {project.body}
            </p>
          </div>

          {validSteps.length > 0 && (
            <div>
              <h2 className="font-mono text-sm text-muted">How it works</h2>
              <ol className="mt-3 flex flex-col gap-2 list-none p-0">
                {validSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 rounded-xl bg-surface px-3.5 py-3 text-[15px] shadow-sm text-text"
                  >
                    <span className="font-mono text-[11px] text-teal">
                      0{idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {showWhy && (
            <div>
              <h2 className="font-mono text-sm text-muted">Why build it</h2>
              <p className="mt-2.5 text-[17px] leading-relaxed text-text">
                {project.why}
              </p>
            </div>
          )}

          {validChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {validChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-well px-2.5 py-1 font-mono text-[11px] text-text"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
