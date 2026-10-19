import Link from "next/link";
import { projects } from "@/content/projects";
import { photos } from "@/content/photos";
import { diagrams, portraits, Portrait } from "@/ui/diagrams";
import TryIt from "@/ui/TryIt";
import Shot from "@/ui/Shot";
import StillToShot, { type Take } from "@/ui/StillToShot";

// The photographs that have a six-second shot, for the From still to shot panel.
const takes = photos.filter((p): p is Take => Boolean(p.shot));

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
  const portrait = portraits[project.id];
  const showStatus = project.status && !project.status.startsWith("[");
  const showWhy = Boolean(project.why && !project.why.startsWith("["));
  const validSteps = (project.steps ?? []).filter((s) => !s.startsWith("["));
  const validChips = (project.chips ?? []).filter((c) => !c.startsWith("["));

  return (
    <section className="mx-auto max-w-[1120px] px-6 pt-28 pb-32">
      {/* Top row: back to the list; previous / next wait at the bottom, after the project */}
      <div className="mb-12">
        <Link
          href="/building/"
          className="inline-flex min-h-[44px] items-center text-body font-medium text-muted hover:text-text transition-colors"
        >
          ← All projects
        </Link>
      </div>

      {project.shots ? (
        <ShotsLayout project={project} showStatus={Boolean(showStatus)} showWhy={showWhy} chips={validChips}>
          {Diagram && (
            <div className="rounded-3xl bg-surface p-4 sm:p-6" data-diagram-card>
              <div className={portrait ? "hidden sm:block" : undefined}>
                <Diagram />
              </div>
              {portrait && (
                <div className="sm:hidden" data-diagram-portrait>
                  <Portrait spec={portrait} />
                </div>
              )}
            </div>
          )}
        </ShotsLayout>
      ) : (
        <>
      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {showStatus && (
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-well px-2.5 py-1 text-label text-text">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    project.live ? "bg-teal" : "bg-amber"
                  }`}
                />
                {project.status}
              </span>
            </div>
          )}
          <h1 className="text-title font-semibold text-text">
            {project.title}
          </h1>
          {/* what it is, right under the name, before the diagram explains how */}
          <p className="text-lead text-text">{project.body}</p>
          {Diagram && (
            <div
              style={{ viewTransitionName: `card-${project.id}` }}
              className="rounded-3xl bg-surface p-4 sm:p-6 card-morph"
              data-diagram-card
            >
              {/* phones get the top-to-bottom drawing; the wide one shrinks its labels to ~6px there */}
              <div className={portrait ? "hidden sm:block" : undefined}>
                <Diagram />
              </div>
              {portrait && (
                <div className="sm:hidden" data-diagram-portrait>
                  <Portrait spec={portrait} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8">
          {validSteps.length > 0 && (
            <div>
              <h2 className="text-label text-muted">How it works</h2>
              <ol className="mt-3 flex flex-col gap-2 list-none p-0">
                {validSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 rounded-xl bg-surface px-3.5 py-3 text-body shadow-sm text-text"
                  >
                    <span className="text-label text-teal">
                      0{idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {project.tryUrl && <TryIt href={project.tryUrl} />}

          {showWhy && (
            <div>
              <h2 className="text-label text-muted">Why build it</h2>
              <p className="mt-2.5 text-lead text-text">
                {project.why}
              </p>
            </div>
          )}

          {validChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {validChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-well px-2.5 py-1 text-label text-text"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
        </>
      )}

      <nav aria-label="More projects" className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-8">
        <Link
          href={`/building/${prevProject.id}/`}
          aria-label={`Previous project: ${prevProject.title}`}
          className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-surface px-4 text-body text-text hover:border-text transition-colors"
        >
          ← {prevProject.title}
        </Link>
        <Link
          href={`/building/${nextProject.id}/`}
          aria-label={`Next project: ${nextProject.title}`}
          className="inline-flex min-h-[44px] items-center rounded-full bg-text px-4 text-body text-surface hover:opacity-90 transition-opacity"
        >
          {nextProject.title} →
        </Link>
      </nav>
    </section>
  );
}

// A project with screenshots of the running app: the workspace first, then one task
// start to finish, then the machines it runs on.
function ShotsLayout({
  project,
  showStatus,
  showWhy,
  chips,
  children,
}: {
  project: (typeof projects)[number];
  showStatus: boolean;
  showWhy: boolean;
  chips: string[];
  children: React.ReactNode;
}) {
  const shots = project.shots!;
  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-5">
        {showStatus && (
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-well px-2.5 py-1 text-label text-text">
              <span className={`h-1.5 w-1.5 rounded-full ${project.live ? "bg-teal" : "bg-amber"}`} />
              {project.status}
            </span>
          </div>
        )}
        <h1 className="text-title font-semibold text-text">{project.title}</h1>
        <p className="max-w-[720px] text-lead text-text">{project.body}</p>
        {project.tryUrl && <TryIt href={project.tryUrl} />}
        {shots.hero && (
          <div style={{ viewTransitionName: `card-${project.id}` }} className="card-morph" data-hero-shot>
            <Shot shot={shots.hero} sizes="(min-width: 1168px) 1072px, calc(100vw - 48px)" link />
          </div>
        )}
        {shots.clips && (
          <div style={{ viewTransitionName: `card-${project.id}` }} className="card-morph grid grid-cols-1 gap-4 sm:grid-cols-2" data-clips>
            {shots.clips.map((clip) => (
              <figure key={clip.src} className="m-0">
                {/* muted, looping, inline: plays on its own like a still would, never with sound */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={clip.poster}
                  width={clip.width}
                  height={clip.height}
                  className="block h-auto w-full rounded-xl bg-black"
                  aria-label={`A take made by the pipeline: ${clip.caption}`}
                >
                  <source src={`${clip.src}.webm`} type="video/webm" />
                  <source src={`${clip.src}.mp4`} type="video/mp4" />
                </video>
                <figcaption className="mt-2 text-label text-muted">{clip.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-label text-muted">{shots.stepsTitle ?? "One task, start to finish"}</h2>
        <ol className="mt-6 flex list-none flex-col gap-12 p-0" data-shot-steps>
          {shots.steps.map((step, i) => (
            <li
              key={step.shot.src}
              // phone captures sit beside their caption on wide screens instead of filling the row
              className={`flex flex-col gap-4 ${(step.shot.scale ?? 2) >= 3 ? "md:flex-row md:items-start md:gap-10" : ""}`}
            >
              <p className={`flex gap-3 text-lead text-text ${(step.shot.scale ?? 2) >= 3 ? "md:w-[320px] md:shrink-0 md:pt-4" : ""}`}>
                <span className="text-label text-teal">0{i + 1}</span>
                <span>{step.caption}</span>
              </p>
              <Shot shot={step.shot} sizes="(min-width: 1168px) 1072px, calc(100vw - 48px)" link />
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-label text-muted">How it runs</h2>
          <div className="mt-3">{children}</div>
        </div>
        <div className="flex flex-col gap-8">
          {showWhy && (
            <div>
              <h2 className="text-label text-muted">Why build it</h2>
              <p className="mt-2.5 text-lead text-text">{project.why}</p>
            </div>
          )}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span key={chip} className="rounded-full bg-well px-2.5 py-1 text-label text-text">
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {project.photoShots && <StillToShot takes={takes} />}
    </div>
  );
}
