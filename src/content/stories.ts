import type { FlowRow } from "@/ui/Flow";
// Four results, told plainly: a talent as the small label, the result as the heading, a short
// paragraph on how (with the moment that decided it), one line on what it was worth, one picture.
export type Story = {
  id: string; talent: string; years: string; title: string;
  body: string; worth: string; quote?: { text: string; by: string }; role: string;
  vizLabel: string;
  flow?: FlowRow[]; grid?: { count: number; caption: string };
  // show the picture before the paragraph (when it explains faster than words)
  pictureFirst?: boolean;
};
export const stories: Story[] = [
  { id: "greybox", talent: "Fixing painful workflows", years: "2024–26",
    title: "Cut League of Legends map prototyping from about 3 months to under an hour.",
    body: "A new map used to bounce between designers, engineers and artists for months before anyone could play it. Sitting with the designers showed the real problem: they couldn’t shape the ground themselves, so everything waited on someone else. Instead of a new tool, I had the team rework the old one so designers draw the terrain directly, tried it with a few of them, and fixed what they hit the same week. It’s now how every League map starts.",
    worth: "That’s roughly 1.5 to 6 person-years a year back to the studio.",
    quote: { text: "You didn’t just make us faster, you changed everything.", by: "Principal game designer, Riot" },
    role: "Sr. TPM, League of Legends tools · 9-person engineering team",
    flow: [
      { label: "Before", steps: [{ text: "Designer" }, { text: "Engineering", sub: "waits" }, { text: "Art", sub: "waits" }, { text: "Designer" }], note: "about 3 months" },
      { label: "After", steps: [{ text: "Designer", sub: "draws the ground", strong: true }], note: "under 1 hour" },
    ],
    vizLabel: "Before: a map went designer to engineering to art and back, about 3 months. After: the designer alone, under an hour." },
  { id: "scripting", talent: "Saying no when the math says no", years: "2022–24",
    title: "Kept a multi-year engine migration off League’s designers.",
    body: "A new scripting engine promised to make designers’ lives easier, but adopting it meant converting 165 champions’ worth of content: a week each at best, so over three years of work. The team proposing it promised automation. I asked them to show it. They couldn’t. So the answer was no: the old system stayed supported, the engine team took on the conversion, and designers kept shipping.",
    worth: "Saying no cost nothing, and kept 10–20 designers on content instead of a migration.",
    role: "Manager, Technical Product Management · Creator Workflows · 8 developers, plus outsourcing",
    grid: { count: 165, caption: "165 champions. Each square is a week of conversion, best case, with automated conversion plus QA. 165 weeks is more than 3 years of team time." },
    pictureFirst: true,
    vizLabel: "A grid of 165 squares, one per champion, each a week of conversion work at best: more than 3 years in total." },
  { id: "okr", talent: "Making a plan the team can believe", years: "2022",
    title: "Got a 50-person team across 4–5 countries onto milestones that held.",
    body: "The project had a plan, but the people doing the work couldn’t see themselves in it or tell, week to week, whether it was on track. I ran a three-week prototype that built one character and its gameplay end to end, which showed what could actually land. Leadership re-planned around that, and weekly velocity against numeric targets let everyone see progress. The delivery lead kept the system after I moved on.",
    worth: "That was a $1–5M external budget on milestones people could trust.",
    role: "Technical Product Manager · Lead Producer role, unannounced project, since canceled · 4 partner studios",
    flow: [
      { label: "Before", steps: [{ text: "The plan" }, { text: "Art, audio, graphics teams" }], note: "no way to see what counted as done" },
      { label: "Prove it", steps: [{ text: "3-week prototype", sub: "character + gameplay, end to end", strong: true }, { text: "Scope re-planned", sub: "around what could land" }] },
      { label: "Track it", steps: [{ text: "Numeric OKR targets", strong: true }, { text: "Velocity vs targets", sub: "every week" }, { text: "Milestones held" }] },
    ],
    vizLabel: "Before: a plan the teams couldn’t see themselves in. Prove it: a 3-week prototype, then a re-planned scope. Track it: numeric OKR targets, weekly velocity against them, milestones that held." },
  { id: "cosmetics", talent: "Finding the right partner", years: "2019–22",
    title: "Set up the partner studio that now makes about 100 League skins a year.",
    body: "League needed more skins than its team could make. Rather than pick a vendor on a pitch, I ran a paid trial: 4–5 studios each built a real skin inside League’s pipeline and were scored on quality, speed, cost, fit, operations and how they grow talent. Virtuos Sparx won. Within two years they made about half of League’s skins.",
    worth: "That’s about 30–40 artists’ worth of work a year.",
    role: "TPM, PIE Tooling (League content) · tools team 2 → 12 engineers, plus Virtuos Sparx",
    flow: [
      { steps: [{ text: "4–5 studios", sub: "paid trial, a real skin each" }, { text: "Virtuos Sparx", sub: "chosen on a scored trial", strong: true }, { text: "Half of League’s skins", sub: "within 2 years" }, { text: "~100 skins a year", sub: "today" }] },
    ],
    vizLabel: "From a paid trial of 4 to 5 studios, to Virtuos Sparx, to half of League’s skins within two years, to about 100 skins a year today." },
];
