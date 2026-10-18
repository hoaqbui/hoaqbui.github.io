import Link from "next/link";
import SectionLabel from "@/ui/SectionLabel";
import Shot from "@/ui/Shot";
import TryIt from "@/ui/TryIt";
import { projects } from "@/content/projects";

// Every project in one place, linked from the home page's Now section and from each project page.
export default function ProjectsIndex() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-28 pb-32">
      <Link
        href="/#now"
        className="inline-flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-text transition-colors"
      >
        ← Home
      </Link>
      <div className="mt-8 max-w-[720px]">
        <SectionLabel as="h1">Projects</SectionLabel>
        <p className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.03em]">
          What I’m building with AI.
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Each one is a tool I use myself, built hands-on with Claude Code and ComfyUI, to learn where AI helps the
          people making things and where it still breaks.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
        {projects.map((project) => (
          <li key={project.id} className="flex">
            <article id={project.id} className="flex w-full flex-col rounded-3xl border border-border bg-surface p-6">
              {project.shots && (
                <div className="mb-5">
                  <Shot shot={project.shots.card} sizes="(min-width: 768px) 540px, 90vw" />
                </div>
              )}
              {!project.status.startsWith("[") && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-well px-2.5 py-1 font-mono text-[11px] text-text">
                  <span className={`h-1.5 w-1.5 rounded-full ${project.live ? "bg-teal" : "bg-amber"}`} />
                  {project.status}
                </span>
              )}
              <h2 className="mt-4 text-2xl font-medium tracking-tight text-text">{project.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{project.body}</p>
              {project.why && !project.why.startsWith("[") && (
                <p className="mt-3 text-sm text-muted">Why: {project.why}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.chips
                  .filter((chip) => !chip.startsWith("["))
                  .map((chip) => (
                    <span key={chip} className="rounded-full bg-well px-2.5 py-1 font-mono text-[11px] text-text">
                      {chip}
                    </span>
                  ))}
              </div>
              <div className="mt-auto pt-4">
                <Link
                  href={`/building/${project.id}/`}
                  className="inline-flex min-h-[44px] items-center font-medium text-teal"
                >
                  Read the project →
                </Link>
                {project.tryUrl && <TryIt href={project.tryUrl} className="-mt-1" />}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
