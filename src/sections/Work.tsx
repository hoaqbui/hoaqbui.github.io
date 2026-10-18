import SectionLabel from "@/ui/SectionLabel";
import Flow from "@/ui/Flow";
import WeekGrid from "@/ui/WeekGrid";
import { stories } from "@/content/stories";
import Reveal from "@/fx/Reveal";

// Four results, each told plainly: the talent as a small label, the result as the heading,
// a short paragraph on how, one line on what it was worth, and one picture.
export default function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1120px] px-6 py-20">
      <SectionLabel as="h2">Work</SectionLabel>

      <div className="mt-10 flex flex-col gap-6">
        {stories.map((story) => {
          const picture = story.flow ? (
            <Flow rows={story.flow} label={story.vizLabel} />
          ) : story.grid ? (
            <WeekGrid count={story.grid.count} caption={story.grid.caption} label={story.vizLabel} />
          ) : null;
          return (
            <Reveal key={story.id}>
              <article id={story.id} className="scroll-mt-24 rounded-[20px] border border-border bg-surface p-6 md:p-8">
                <p className="font-mono text-[12px] text-muted">
                  <span className="text-teal">{story.talent}</span> · {story.years}
                </p>
                <h3 className="mt-2 max-w-[820px] text-[26px] font-medium leading-[1.2] tracking-[-0.025em] text-text md:text-[32px]">
                  {story.title}
                </h3>
                <div className="mt-6 flex flex-col gap-6">
                  {story.pictureFirst && picture}
                  <div className="flex max-w-[760px] flex-col gap-4">
                    <p className="m-0 text-[17px] leading-[1.55] text-text">{story.body}</p>
                    <p className="m-0 text-[17px] font-medium leading-[1.4] text-text">{story.worth}</p>
                    {story.quote && (
                      <blockquote className="m-0 border-l-2 border-teal pl-4">
                        <p className="m-0 text-[17px] leading-[1.4] text-text">“{story.quote.text}”</p>
                        <footer className="mt-1 font-mono text-[12px] text-muted">{story.quote.by}</footer>
                      </blockquote>
                    )}
                  </div>
                  {!story.pictureFirst && picture}
                </div>
                <p className="mt-5 font-mono text-[12px] text-muted">{story.role}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
