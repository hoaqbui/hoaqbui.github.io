export type Bar = { label: string; before: string; beforeWidth: string; after: string; afterWidth: string };
// Every story is told the same way: who was stuck, on what, what I did, how it got adopted, then the number.
export type Story = {
  id: string; num: string; numNote: string; title: string; years: string; role: string; team: string;
  who: string; stuck: string; did: string; adoption: string;
  tags: string[]; vizLabel: string; bars?: Bar[]; vizNote?: string; reach?: { from: string[]; to: string[] };
};
export const stories: Story[] = [
  { id: "greybox", tags: ["Live-service games", "Workflow automation", "Level design tooling"], who: "League level designers", numNote: "per map prototype, down from about 3 months", num: "<1 hr", title: "Designers block out League maps themselves, in under an hour", years: "2024–26",
    role: "Sr. TPM, League of Legends tools", team: "4 engineers, a tech lead and an engineering lead",
    stuck: "Terrain waited on art and handoffs. Prototyping a new map took about 3 months of work across design, art and engineering.",
    did: "I sat with designers, mapped the workflow and set a one-hour target. We shipped region boundaries, so designers draw the ground themselves, and fixed what they hit the same week.",
    adoption: "Editor use grew from about half of designers to nearly all. It’s now the studio’s default way to start a map, used by 10–25 designers.",
    bars: [{ label: "Idea → playable map", before: "about 3 months", beforeWidth: "100%", after: "under 1 hour", afterWidth: "3%" }],
    vizNote: "Concept, not to scale.",
    vizLabel: "Time from map idea to playable greybox: about 3 months before, under one hour after." },
  { id: "cosmetics", tags: ["Vendor partnerships & outsourcing", "Internal tools platform", "Scaling teams"], who: "League’s skin artists", numNote: "League skins a year from the partnership today", num: "~100", title: "An outside studio now makes most of League’s skins", years: "2019–22",
    role: "TPM, PIE Tooling (League content)", team: "tools team 2 → 12 engineers, plus Virtuos Sparx",
    stuck: "League needed more skins every year, on a two-week release cadence, without growing its own content team.",
    did: "I ran vendor selection, chose and signed Virtuos Sparx, and built the foundations: security, operations and a working agreement between the two studios. I grew the embedded tools team from 2 to 12 engineers.",
    adoption: "Within two years Sparx made about half of League’s skins. Today it delivers about 100 a year, roughly 30–40 artists’ worth of work.",
    bars: [
      { label: "Share of League skins from Sparx", before: "none", beforeWidth: "2%", after: "about half, within 2 years", afterWidth: "50%" },
      { label: "Tools team", before: "2 engineers", beforeWidth: "16.7%", after: "12 engineers", afterWidth: "100%" },
    ],
    vizNote: "Approximate.",
    vizLabel: "Sparx went from none to about half of League’s skins within two years; the tools team grew from 2 to 12 engineers." },
  { id: "okr", tags: ["OKRs", "Cross-discipline leadership", "External development"], who: "Art, audio and graphics teams, 4 partner studios", numNote: "people across 4–5 countries, on reliable milestones", num: "50+", title: "An unrealistic plan became one the team could hit", years: "2022",
    role: "Technical Product Manager · Lead Producer role, unannounced project", team: "art, audio and graphics teams, 4 partner studios",
    stuck: "A new project’s plan wasn’t realistic, and nobody could see week to week whether it was on track.",
    did: "I ran a 3-week test that built a character and scripted gameplay end to end, then tracked sprint velocity against numeric OKR targets every week.",
    adoption: "Leadership re-planned the scope, milestones became reliable, and the delivery lead adopted and extended the system.",
    reach: { from: ["One objective", "Key results"], to: ["rigging", "animation", "VFX", "rendering", "audio", "art engineering"] },
    vizLabel: "One objective and its key results, set across rigging, animation, VFX, rendering, audio and art engineering." },
];
