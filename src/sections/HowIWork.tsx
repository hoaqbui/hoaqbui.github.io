import SectionLabel from "@/ui/SectionLabel";
import Reveal from "@/fx/Reveal";
import { profile } from "@/content/profile";

const steps = [
  { title: "Start with the people doing the work.", body: "Sit with artists and designers, watch how the work actually flows, and listen for what they’ve stopped asking for." },
  { title: "Name the right problem.", body: "It’s rarely the one on the ticket. A handoff. A migration nobody should take on. A plan the team can’t see itself in. A team at capacity." },
  { title: "Solve it, then see it through.", body: "Sometimes that’s a rework, sometimes a no, sometimes a prototype, sometimes a partner. Then stay until the team is actually using it." },
];

// The thread that ties film, Riot and the AI work together.
export default function HowIWork() {
  return (
    <section id="how" className="border-t border-border bg-well">
      <div className="mx-auto max-w-[1120px] px-6 py-20">
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-16 gap-y-3">
            <SectionLabel as="h2" className="flex-[0_0_200px]">
              How I work
            </SectionLabel>
            <p className="max-w-[640px] flex-[1_1_420px] text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.2] tracking-[-0.025em]">
              The same three moves, in film, games, and now AI.
            </p>
          </div>
          <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2">
                <span className="font-mono text-[13px] text-muted">0{i + 1}</span>
                <span className="text-xl font-medium tracking-[-0.015em]">{s.title}</span>
                <span className="text-base leading-relaxed text-muted">{s.body}</span>
              </li>
            ))}
          </ol>
          <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-end gap-8 border-t border-border pt-10">
            <blockquote className="m-0">
              <p className="text-2xl md:text-[28px] font-medium leading-[1.3] tracking-[-0.02em]">
                “{profile.quote.text}”
              </p>
              <footer className="mt-3 font-mono text-[13px] text-muted">{profile.quote.by}, on the map tools</footer>
            </blockquote>
            <p className="text-[15px] leading-relaxed text-muted">
              The pattern started in film: at Lucasfilm, keeping thousands of assets a season moving between 4+ studios on{" "}
              <i>Star Wars: The Clone Wars</i>; at Pixar, delivering final shots and handing lighters tools they could run
              themselves.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
