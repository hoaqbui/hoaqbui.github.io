export type Bar = { label: string; before: string; beforeWidth: string; after: string; afterWidth: string };
// Each story is one slide: a kicker, a title that states the result, three one-line beats
// (the problem, the call, the result), one number, one chart. Nothing longer than a line.
export type Story = {
  id: string; kind: string; who: string; years: string; title: string;
  problem: string; call: string; result: string;
  num: string; numNote: string; role: string;
  vizLabel: string; bars?: Bar[]; vizNote?: string; reach?: { from: string[]; to: string[] };
};
export const stories: Story[] = [
  { id: "greybox", kind: "Workflow", who: "League level designers", years: "2024–26",
    title: "Level designers got from idea to playable map in under an hour",
    problem: "A new map took about 3 months. Terrain waited on art.",
    call: "No new tool. Rework the old one’s workflow so designers draw the ground themselves. Pilot, then roll out.",
    result: "The studio default, used by 10–25 designers.",
    num: "<1 hr", numNote: "per map prototype, down from about 3 months",
    role: "Sr. TPM, League of Legends tools · 9-person engineering team",
    bars: [{ label: "Idea → playable map", before: "about 3 months", beforeWidth: "100%", after: "under 1 hour", afterWidth: "3%" }],
    vizNote: "Concept, not to scale.",
    vizLabel: "Time from map idea to playable greybox: about 3 months before, under one hour after." },
  { id: "scripting", kind: "Decision", who: "League gameplay and level designers", years: "2022–24",
    title: "Designers kept shipping instead of converting 165 champions",
    problem: "A new scripting engine had stalled. Converting old content meant years of work.",
    call: "Say no. Keep the old system supported; the engine team owns the conversion.",
    result: "Designers kept shipping. Tool requests went from weeks to days.",
    num: "3+ yrs", numNote: "of best-case conversion work kept off designers: ~165 champions × at least 1 week each",
    role: "Manager, Technical Product Management · Creator Workflows · 8 developers, plus outsourcing",
    bars: [{ label: "Conversion work on designers’ plates", before: "3+ years, best case", beforeWidth: "100%", after: "none: owned by the engine team", afterWidth: "2%" }],
    vizNote: "Best case: about 165 champions at 1 week each, with automated conversion plus QA.",
    vizLabel: "Conversion work on designers went from more than 3 years, best case, to none; the engine team owned it." },
  { id: "okr", kind: "Prototype", who: "Art, audio and graphics teams", years: "2022",
    title: "A 50-person team got a plan it could actually hit",
    problem: "A plan nobody believed, and no way to see if it was on track.",
    call: "Build a real slice in 3 weeks. Track velocity against OKRs every week.",
    result: "Leadership re-planned. Milestones held. The delivery lead kept the system.",
    num: "50+", numNote: "people across 4–5 countries, on reliable milestones",
    role: "Technical Product Manager · Lead Producer role, unannounced project · 4 partner studios",
    reach: { from: ["One objective", "Key results"], to: ["rigging", "animation", "VFX", "rendering", "audio", "art engineering"] },
    vizLabel: "One objective and its key results, set across rigging, animation, VFX, rendering, audio and art engineering." },
  { id: "cosmetics", kind: "Trial", who: "League skin artists", years: "2019–22",
    title: "The skins team got about 100 skins a year without hiring",
    problem: "League needed more skins than its team could make.",
    call: "Trial 4–5 studios on a real skin inside League’s pipeline. Pick the best.",
    result: "Virtuos Sparx makes about half of League’s skins. Tools team grew 2 → 12.",
    num: "~100", numNote: "League skins a year from the partnership today",
    role: "TPM, PIE Tooling (League content) · tools team 2 → 12 engineers, plus Virtuos Sparx",
    bars: [
      { label: "Share of League skins from Sparx", before: "none", beforeWidth: "2%", after: "about half, within 2 years", afterWidth: "50%" },
      { label: "Tools team", before: "2 engineers", beforeWidth: "16.7%", after: "12 engineers", afterWidth: "100%" },
    ],
    vizNote: "Approximate.",
    vizLabel: "Sparx went from none to about half of League’s skins within two years; the tools team grew from 2 to 12 engineers." },
];
