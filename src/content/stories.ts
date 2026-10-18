export type Bar = { label: string; before: string; beforeWidth: string; after: string; afterWidth: string };
// Every story proves the headline: find what is slowing a creative team down, then fix it (a tool, a decision, a prototype).
// Each is told the same way: who was stuck, on what, what I did, how it got adopted, then the number.
export type Story = {
  id: string; num: string; numNote: string; title: string; years: string; role: string; team: string;
  kind: string; who: string; stuck: string; did: string; adoption: string;
  tags: string[]; vizLabel: string; bars?: Bar[]; vizNote?: string; reach?: { from: string[]; to: string[] };
};
export const stories: Story[] = [
  { id: "greybox", tags: ["Live-service games", "Workflow automation", "Level design tooling"], kind: "New tool", who: "League level designers", numNote: "per map prototype, down from about 3 months", num: "<1 hr", title: "Designers block out League maps themselves, in under an hour", years: "2024–26",
    role: "Sr. TPM, League of Legends tools", team: "9-person engineering team",
    stuck: "Terrain waited on art and handoffs. Prototyping a new map took about 3 months of work across design, art and engineering.",
    did: "I sat with designers, mapped the workflow and set a one-hour target. We shipped region boundaries, so designers draw the ground themselves, and fixed what they hit the same week.",
    adoption: "Editor use grew from about half of designers to nearly all. It’s now the studio’s default way to start a map, used by 10–25 designers.",
    bars: [{ label: "Idea → playable map", before: "about 3 months", beforeWidth: "100%", after: "under 1 hour", afterWidth: "3%" }],
    vizNote: "Concept, not to scale.",
    vizLabel: "Time from map idea to playable greybox: about 3 months before, under one hour after." },
  { id: "scripting", tags: ["Live-service games", "Prioritization", "Cross-team planning"], kind: "Judgment call", who: "League gameplay and level designers", numNote: "of best-case conversion work kept off designers: ~165 champions × at least 1 week each", num: "3+ yrs", title: "Kept a costly engine migration from landing on League’s designers", years: "2022–24",
    role: "Manager, Technical Product Management · Creator Workflows", team: "4 internal and 4 external developers, plus outsourcing",
    stuck: "Designers scripted in a mix of text scripts and engineer-written code: slow to test, hard to debug, and often blocked on an engineer. A new scripting engine was meant to fix that, but adoption had stalled on missing features, low trust, no owner and the cost of converting existing content.",
    did: "Short pulse surveys showed which features were missing and why designers didn’t trust the new engine. I did the capacity math for converting every champion, asked to see the promised automation (it couldn’t be shown), and brought gameplay and engineering leadership to the same view.",
    adoption: "The core engine team took on the conversion itself. Designers kept shipping, my team’s roadmap stayed on what designers asked for, a release stayed on schedule, and tool requests went from weeks to days.",
    bars: [{ label: "Conversion work on designers’ plates", before: "3+ years, best case", beforeWidth: "100%", after: "none: owned by the engine team", afterWidth: "2%" }],
    vizNote: "Best case: about 165 champions at 1 week each, with automated conversion plus QA.",
    vizLabel: "Conversion work on designers went from more than 3 years, best case, to none; the engine team owned it." },
  { id: "okr", tags: ["OKRs", "Cross-discipline leadership", "External development"], kind: "Prototype", who: "Art, audio and graphics teams, 4 partner studios", numNote: "people across 4–5 countries, on reliable milestones", num: "50+", title: "A 3-week prototype turned an unrealistic plan into one the team could hit", years: "2022",
    role: "Technical Product Manager · Lead Producer role, unannounced project", team: "art, audio and graphics teams, 4 partner studios",
    stuck: "A new project’s plan wasn’t realistic, and nobody could see week to week whether it was on track.",
    did: "I ran a 3-week timeboxed prototype that built a character and scripted gameplay end to end, to show what could land and what it would take. Then I tied weekly sprint velocity to numeric OKR targets so the team could see if it was on track.",
    adoption: "Leadership re-planned the scope, milestones became reliable, and the delivery lead adopted and extended the system.",
    reach: { from: ["One objective", "Key results"], to: ["rigging", "animation", "VFX", "rendering", "audio", "art engineering"] },
    vizLabel: "One objective and its key results, set across rigging, animation, VFX, rendering, audio and art engineering." },
];
