import type { FlowRow } from "@/ui/Flow";
// Each story is one slide: a kicker, a title that states the result, three one-line beats
// (the problem, the call, the result), one number, one chart. Nothing longer than a line.
export type Story = {
  id: string; kind: string; who: string; years: string; title: string;
  problem: string; call: string; result: string;
  num: string; numNote: string; role: string;
  vizLabel: string;
  // one of: a flow of steps (one row, or before/after rows), or a grid of work units
  flow?: FlowRow[]; grid?: { count: number; caption: string };
};
export const stories: Story[] = [
  { id: "greybox", kind: "Workflow", who: "League level designers", years: "2024–26",
    title: "Level designers got from idea to playable map in under an hour",
    problem: "A new map took about 3 months. Terrain waited on art.",
    call: "No new tool. Rework the old one’s workflow so designers draw the ground themselves. Pilot, then roll out.",
    result: "The studio default, used by 10–25 designers.",
    num: "<1 hr", numNote: "per map prototype, down from about 3 months",
    role: "Sr. TPM, League of Legends tools · 9-person engineering team",
    flow: [
      { label: "Before", steps: [{ text: "Designer" }, { text: "Art", sub: "waits" }, { text: "Engineering", sub: "waits" }, { text: "Designer" }], note: "about 3 months" },
      { label: "After", steps: [{ text: "Designer", sub: "draws the ground", strong: true }], note: "under 1 hour" },
    ],
    vizLabel: "Before: a map went designer to art to engineering and back, about 3 months. After: the designer alone, under an hour." },
  { id: "scripting", kind: "Decision", who: "League gameplay and level designers", years: "2022–24",
    title: "Designers kept shipping instead of converting 165 champions",
    problem: "A new scripting engine had stalled. Converting old content meant years of work.",
    call: "Say no. Keep the old system supported; the engine team owns the conversion.",
    result: "Designers kept shipping. Tool requests went from weeks to days.",
    num: "3+ yrs", numNote: "of best-case conversion work kept off designers: ~165 champions × at least 1 week each",
    role: "Manager, Technical Product Management · Creator Workflows · 8 developers, plus outsourcing",
    grid: { count: 165, caption: "165 champions. Each square is a week of conversion, best case, with automated conversion plus QA. 165 weeks is more than 3 years of team time." },
    vizLabel: "A grid of 165 squares, one per champion, each a week of conversion work at best: more than 3 years in total." },
  { id: "okr", kind: "Prototype", who: "Art, audio and graphics teams", years: "2022",
    title: "A 50-person team got a plan it could see, track, and hit",
    problem: "A plan the team couldn’t see itself in, or track week to week.",
    call: "Build a real slice in 3 weeks so the plan means something. Track velocity against OKRs every week.",
    result: "Leadership re-planned. Milestones held. The delivery lead kept the system.",
    num: "50+", numNote: "people across 4–5 countries, on reliable milestones",
    role: "Technical Product Manager · Lead Producer role, unannounced project, since canceled · 4 partner studios",
    flow: [
      { steps: [{ text: "Plan the team couldn’t see", sub: "no way to track completion" }, { text: "3-week prototype", sub: "character + gameplay", strong: true }, { text: "Scope re-planned" }, { text: "Velocity vs OKRs", sub: "every week" }, { text: "Milestones held" }] },
    ],
    vizLabel: "From a plan the team couldn’t see itself in, through a 3-week prototype, to a re-planned scope, weekly velocity against OKR targets, and milestones that held." },
  { id: "cosmetics", kind: "Trial", who: "League skin artists", years: "2019–22",
    title: "The skins team got about 100 skins a year without hiring",
    problem: "League needed more skins than its team could make.",
    call: "Trial 4–5 studios on a real skin inside League’s pipeline. Pick the best.",
    result: "Virtuos Sparx makes about half of League’s skins. Tools team grew 2 → 12.",
    num: "~100", numNote: "League skins a year from the partnership today",
    role: "TPM, PIE Tooling (League content) · tools team 2 → 12 engineers, plus Virtuos Sparx",
    flow: [
      { steps: [{ text: "4–5 studios", sub: "paid trial, a real skin each" }, { text: "Virtuos Sparx", sub: "chosen on a scored trial", strong: true }, { text: "Half of League’s skins", sub: "within 2 years" }, { text: "~100 skins a year", sub: "today, without hiring" }] },
    ],
    vizLabel: "From a paid trial of 4 to 5 studios, to Virtuos Sparx, to half of League’s skins within two years, to about 100 skins a year today." },
];
