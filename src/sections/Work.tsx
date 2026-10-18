import SectionLabel from "@/ui/SectionLabel";
import Bars from "@/ui/Bars";
import ReachChips from "@/ui/ReachChips";
import { stories } from "@/content/stories";
import Reveal from "@/fx/Reveal";

// The proof for the headline, one slide per story: a kicker, a title that states the result,
// three one-line beats, one number, one chart. Nothing longer than a line.
export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1120px] px-6 py-20 border-t border-border">
      <div className="flex flex-wrap items-baseline gap-x-16 gap-y-3">
        <SectionLabel as="h2" className="flex-[0_0_200px]">
          Work
        </SectionLabel>
        <p className="max-w-[640px] flex-[1_1_420px] text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.2] tracking-[-0.025em]">
          Four problems at Riot, four different fixes. Each one was the fix with the most impact, not the obvious one.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-6">
        {stories.map((story) => {
          const beats = [
            { label: "The problem", value: story.problem },
            { label: "The call", value: story.call },
            { label: "The result", value: story.result },
          ];
          return (
            <Reveal key={story.id}>
              <article id={story.id} className="scroll-mt-24 rounded-[20px] border border-border bg-surface p-6 md:p-8">
                <p className="font-mono text-[12px] text-muted">
                  <span className="text-teal">{story.kind}</span> · {story.who} · Riot · {story.years}
                </p>
                <h3 className="mt-2 text-[24px] md:text-[30px] font-medium leading-[1.2] tracking-[-0.025em] text-text">
                  {story.title}
                </h3>

                <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
                  <dl className="m-0 flex flex-col gap-4">
                    {beats.map((b) => (
                      <div key={b.label} className="grid grid-cols-[112px_1fr] gap-4 border-t border-border pt-4">
                        <dt className="font-mono text-xs text-muted pt-1">{b.label}</dt>
                        <dd className="m-0 text-[17px] leading-snug text-text">{b.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="md:w-[260px] md:pl-8 md:border-l md:border-border">
                    <div className="text-[48px] font-medium leading-none tracking-[-0.03em] text-teal">{story.num}</div>
                    <div className="mt-2 text-[14px] leading-snug text-muted">{story.numNote}</div>
                  </div>
                </div>

                {story.bars ? (
                  <div className="mt-8">
                    <Bars bars={story.bars} note={story.vizNote} label={story.vizLabel} />
                  </div>
                ) : story.reach ? (
                  <div className="mt-8">
                    <ReachChips from={story.reach.from} to={story.reach.to} label={story.vizLabel} />
                  </div>
                ) : null}
                <p className="mt-5 font-mono text-[12px] text-muted">{story.role}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
