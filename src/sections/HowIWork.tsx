import SectionLabel from "@/ui/SectionLabel";
import { em } from "@/ui/em";
import Reveal from "@/fx/Reveal";

const steps = [
  { title: "Start with the people.", lines: [
    "Talk to them. Check the data.",
    "Watch them work. Use their tools.",
    "Talk to the people who support those tools.",
  ] },
  { title: "Identify the right problem.", lines: [
    "Rarely the one on the ticket.",
    "A handoff. A migration nobody should take on. A plan the team can’t see itself in. A team at capacity.",
  ] },
  { title: "See it through.", lines: [
    "A rework, a no, a prototype, a partner.",
    "Leave a process the team runs itself.",
    "Short surveys. Regular show-and-tells of what the tools can do.",
  ] },
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
              {em("The same **three moves**, in film, games, and now AI.")}
            </p>
          </div>
          <ol className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2">
                <span className="font-mono text-[13px] text-muted">0{i + 1}</span>
                <span className="text-xl font-medium tracking-[-0.015em]">{s.title}</span>
                <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] leading-snug text-muted">
                  {s.lines.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-teal" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-14 max-w-[720px] border-t border-border pt-10 text-[15px] leading-relaxed text-muted">
            It started in film: at Lucasfilm, moving thousands of assets a season between 4+ studios on{" "}
            <i>Star Wars: The Clone Wars</i>; at Pixar, final shots, and tools that lighters ran themselves.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
