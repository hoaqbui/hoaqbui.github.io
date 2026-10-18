import SectionLabel from "@/ui/SectionLabel";
import { em } from "@/ui/em";
import { profile } from "@/content/profile";
import Reveal from "@/fx/Reveal";

// One line each: the moves as a picture, not a list (card 89; the longer bullets were cut).
const steps = [
  { title: "Start with the people.", line: "Talk to them. Watch them work.",
    icon: <><circle cx="9" cy="8" r="3.2" /><circle cx="16.5" cy="9" r="2.6" /><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5M14.5 14.2c2.6-.3 5 1 5.5 4.8" /></> },
  { title: "Identify the right problem.", line: "The real problem is rarely the one on the ticket.",
    icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" fill="currentColor" /></> },
  { title: "See it through.", line: "Ship it, then leave a process that runs without me.",
    icon: <path d="M5 21V4M5 4h11l-2 4 2 4H5" /> },
];

// The same moves at every stop: the studio logos, then the AI work.
const stops = [
  { logo: "Lucasfilm", caption: "Clone Wars assets across 4+ studios" },
  { logo: "Pixar", caption: "final shots, lighting tools" },
  { logo: "Riot Games", caption: "League tools, 12+ years" },
  { logo: null, caption: "video and agents, now" },
];

// The thread that ties film, Riot and the AI work together.
export default function HowIWork() {
  return (
    <section id="how" className="scroll-mt-[155px] border-t border-border bg-well">
      <div className="mx-auto max-w-[1120px] px-6 py-20">
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-16 gap-y-3">
            <SectionLabel as="h2" className="flex-[0_0_200px]">
              How I work
            </SectionLabel>
            <p className="max-w-[640px] flex-[1_1_420px] text-title font-semibold">
              {em("The same **three moves**, in film, games, and now AI.")}
            </p>
          </div>
          <ol className="m-0 mt-12 grid list-none gap-0 p-0 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4 md:flex-col">
                <span className="flex flex-col items-center md:items-start">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-teal">
                    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {s.icon}
                    </svg>
                  </span>
                  {i < steps.length - 1 && <span aria-hidden="true" className="min-h-5 w-px flex-1 bg-border md:hidden" />}
                </span>
                <span className="flex flex-col gap-1 pb-6 pt-2.5 md:p-0">
                  <span className="text-heading font-medium">{s.title}</span>
                  <span className="text-body text-muted">{s.line}</span>
                </span>
              </li>
            ))}
          </ol>
          <div data-career-timeline className="mt-12 border-t border-border pt-8">
            <p className="text-label text-muted">Same moves, every stop</p>
            <ol className="m-0 mt-5 grid list-none grid-cols-2 gap-x-6 gap-y-6 p-0 md:grid-cols-4">
              {stops.map((stop) => {
                const logo = profile.logos.find((l) => l.name === stop.logo);
                return (
                  <li key={stop.caption} className="flex flex-col gap-2">
                    <span className="flex h-8 items-center text-muted opacity-85">
                      {logo ? (
                        <span
                          role="img"
                          aria-label={logo.name}
                          className="block max-w-full bg-current"
                          style={{
                            width: Math.round(logo.height * 0.8 * logo.ratio),
                            aspectRatio: logo.ratio,
                            mask: `url(${logo.src}) left center / contain no-repeat`,
                            WebkitMask: `url(${logo.src}) left center / contain no-repeat`,
                          }}
                        />
                      ) : (
                        <span className="text-heading font-medium text-teal">AI</span>
                      )}
                    </span>
                    <span className="text-label text-muted">{stop.caption}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
