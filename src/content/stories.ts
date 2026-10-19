import type { FlowRow } from "@/ui/Flow";
import type { TileFig } from "@/ui/TileFigure";
// Four results, told plainly: a talent as the small label, the result as the heading, a short
// paragraph on how (with the moment that decided it), one line on what it was worth, one picture.
export type Story = {
  id: string; talent: string; years: string; title: string;
  // the tile: the kind of impact as its label, a number, its caption, and a small picture;
  // `how` is the picture's spoken label. The open story keeps `talent` as its label.
  impact: string; num: string; numNote: string; how: string; tile: TileFig;
  body: string; worth: string; quote?: { text: string; by: string }; role: string;
  vizLabel: string;
  flow?: FlowRow[]; grid?: { count: number; caption: string };
  // show the picture before the paragraph (when it explains faster than words)
  pictureFirst?: boolean;
};
export const stories: Story[] = [
  { id: "greybox", talent: "Fixing painful workflows", years: "2024–26",
    impact: "Faster iteration",
    num: "<1 hr", numNote: "to prototype a League map, down from 3 months", how: "Reworked an old tool so designers draw the ground themselves.",
    tile: { kind: "bars", before: "3 mo", after: "<1 hr" },
    title: "League map prototyping went from **3 months to under an hour**.",
    body: "A new map bounced between designers, engineers, and artists for months before anyone could play it. The real problem: designers couldn’t shape the ground themselves. Instead of a new tool, the team reworked the old one so they could, tried it with a few designers, and fixed what they hit the same week. It’s now how every League map starts.",
    worth: "Roughly 1.5 to 6 person-years a year back to the studio.",
    quote: { text: "You didn’t just make us faster, you changed everything.", by: "Principal game designer, Riot" },
    role: "Sr. TPM, League of Legends tools · 9-person engineering team",
    flow: [
      { label: "Before", steps: [{ text: "Designer" }, { text: "Engineering", sub: "waits" }, { text: "Art", sub: "waits" }, { text: "Designer" }], note: "about 3 months" },
      { label: "After", steps: [{ text: "Designer", sub: "draws the ground", strong: true }], note: "under 1 hour" },
    ],
    vizLabel: "Before: a map went designer to engineering to art and back, about 3 months. After: the designer alone, under an hour." },
  { id: "scripting", talent: "Saying no when the math says no", years: "2022–24",
    impact: "Effort avoided",
    num: "3+ yrs", numNote: "of estimated migration effort kept off League’s designers", how: "Did the math on 165 champions and said no. The engine team owned it.",
    tile: { kind: "squares", count: 165, caption: "165 champions × a week each" },
    title: "**Three years of migration work**, kept off League’s designers.",
    body: "Adopting a new scripting engine meant converting 165 champions’ worth of content: a week each at best, over three years of work. The team proposing it promised automation. I asked to see it. They couldn’t show it. So: no. The old system stayed supported, the engine team took the conversion, and designers kept shipping.",
    worth: "Cost nothing. Kept 10–20 designers on content.",
    role: "Manager, Technical Product Management · Creator Workflows · 8 developers, plus outsourcing",
    grid: { count: 165, caption: "165 champions. Each square is a week of conversion, best case, with automated conversion plus QA. That’s 165 weeks: more than 3 years of team time." },
    pictureFirst: true,
    vizLabel: "A grid of 165 squares, one per champion, each a week of conversion work at best: more than 3 years in total." },
  { id: "okr", talent: "Making a plan the team can believe", years: "2022",
    impact: "Predictable delivery",
    num: "50+", numNote: "people in 4–5 countries, delivering on milestones that held", how: "A 3-week slice proved the plan; weekly velocity vs OKRs kept it honest.",
    tile: { kind: "dots", count: 50, caption: "each dot a person, one plan" },
    title: "A 50-person team got a plan it could **see, track, and hit**.",
    body: "The plan existed, but the people doing the work couldn’t see themselves in it or tell if it was on track. A three-week prototype built one character and its gameplay end to end and showed what could land. Leadership re-planned around it; weekly velocity against numeric targets showed progress. The delivery lead kept the system after I moved on.",
    worth: "A $1–5M external budget on milestones people could trust.",
    role: "Technical Product Manager · Lead Producer role, unannounced project, since canceled · 4 partner studios",
    flow: [
      { label: "Before", steps: [{ text: "The plan" }, { text: "Art, audio, graphics teams" }], note: "no way to see what counted as done" },
      { label: "Prove it", steps: [{ text: "3-week prototype", sub: "character + gameplay, end to end", strong: true }, { text: "Scope re-planned", sub: "around what could land" }] },
      { label: "Track it", steps: [{ text: "Numeric OKR targets", strong: true }, { text: "Velocity vs targets", sub: "every week" }, { text: "Milestones held" }] },
    ],
    vizLabel: "Before: a plan the teams couldn’t see themselves in. Prove it: a 3-week prototype, then a re-planned scope. Track it: numeric OKR targets, weekly velocity against them, milestones that held." },
  { id: "cosmetics", talent: "Finding the right partner", years: "2019–22",
    impact: "Capacity at scale",
    num: "~100", numNote: "League skins a year from one partner studio", how: "Trialed 4–5 studios on a real skin; Virtuos Sparx won.",
    tile: { kind: "pick", tried: 5, caption: "4–5 studios trialed → 1 partner → half the skins" },
    title: "The partner studio behind **about 100 League skins a year**.",
    body: "League needed more skins than its team could make. Instead of picking a vendor on a pitch, 4–5 studios each built a real skin inside League’s pipeline, scored on quality, speed, cost, fit, operations, and talent. Virtuos Sparx won. Within two years they made about half of League’s skins.",
    worth: "About 30–40 artists’ worth of work a year.",
    role: "TPM, PIE Tooling (League content) · tools team 2 → 12 engineers, plus Virtuos Sparx",
    flow: [
      { steps: [{ text: "4–5 studios", sub: "paid trial, a real skin each" }, { text: "Virtuos Sparx", sub: "chosen on a scored trial", strong: true }, { text: "Half of League’s skins", sub: "within 2 years" }, { text: "~100 skins a year", sub: "today" }] },
    ],
    vizLabel: "From a paid trial of 4 to 5 studios, to Virtuos Sparx, to half of League’s skins within two years, to about 100 skins a year today." },
];
