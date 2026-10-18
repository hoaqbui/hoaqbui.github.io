import SectionLabel from "@/ui/SectionLabel";
import Bars from "@/ui/Bars";
import ReachChips from "@/ui/ReachChips";
import { stories } from "@/content/stories";
import Reveal from "@/fx/Reveal";

// The proof for the hero's claim. Open by default and told the same way every time:
// who was stuck, what I did, how it got adopted, and the number last, so it lands with its context.
export default function Work() {
  return (
    <section
      id="work"
      className="mx-auto max-w-[1120px] px-6 py-20 border-t border-border"
    >
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
          const fields = [
            { label: "What was slowing them down", value: story.stuck },
            { label: "The fix", value: story.did },
            { label: "What changed", value: story.adoption },
          ];
          return (
            <Reveal key={story.id}>
              <article
                id={story.id}
                className="scroll-mt-24 rounded-[20px] border border-border bg-surface p-6 md:p-8"
              >
                <p className="font-mono text-[12px] text-muted">
                  <span className="text-teal">{story.kind}</span> · {story.who} · Riot · {story.years}
                </p>
                <h3 className="mt-2 text-[22px] md:text-[26px] font-medium leading-[1.25] tracking-[-0.02em] text-text">
                  {story.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5" data-story-tags>
                  {story.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-well px-2.5 py-1 font-mono text-[11px] text-text">
                      {tag}
                    </span>
                  ))}
                </div>
                <dl className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 border-t border-border pt-6">
                  {fields.map((f) => (
                    <div key={f.label}>
                      <dt className="font-mono text-xs text-muted">{f.label}</dt>
                      <dd className="mt-2 text-base leading-relaxed text-text">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl bg-well px-5 py-4 text-[15px]">
                  <span className="font-mono text-xs text-muted">Why this fix</span>
                  <span className="text-text">{story.why}</span>
                </p>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-border pt-6">
                  <span className="text-[40px] font-medium leading-none tracking-[-0.03em] text-teal">{story.num}</span>
                  <span className="text-[15px] text-muted">{story.numNote}</span>
                </div>
                {story.bars ? (
                  <div className="mt-6">
                    <Bars bars={story.bars} note={story.vizNote} label={story.vizLabel} />
                  </div>
                ) : story.reach ? (
                  <div className="mt-6">
                    <ReachChips from={story.reach.from} to={story.reach.to} label={story.vizLabel} />
                  </div>
                ) : null}
                <p className="mt-6 font-mono text-[12px] text-muted">
                  {story.role} · {story.team}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
