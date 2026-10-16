export type Bar = { label: string; before: string; beforeWidth: string; after: string; afterWidth: string };
export type Story = {
  id: string; num: string; numNote: string; title: string; years: string; role: string; team: string;
  context: string; call: string; tradeOff: string; result: string;
  tags: string[]; vizLabel: string; bars?: Bar[]; vizNote?: string; reach?: { from: string[]; to: string[] };
};
export const stories: Story[] = [
  { id: "greybox", tags: ["Live-service games", "Workflow automation", "Level design tooling"], numNote: "League map prototyping, down from about 3 months", num: "<1 hr", title: "Designers block out League maps themselves, in under an hour", years: "2024–26",
    role: "Sr. TPM, League of Legends tools", team: "4 engineers, a tech lead and an engineering lead",
    context: "Prototyping a new League map took about 3 months of work across design, art and engineering.",
    call: "I mapped the workflow with designers and found the bottleneck: terrain waited on art and handoffs. I set a one-hour target and shipped region boundaries, so designers draw the ground themselves.",
    tradeOff: "[ the greybox alternative I passed on, and why ]",
    result: "Map prototyping went from about 3 months to under an hour. It's now the studio's default way to start a map, used by 10–25 designers.",
    bars: [{ label: "Idea → playable map", before: "about 3 months", beforeWidth: "100%", after: "under 1 hour", afterWidth: "3%" }],
    vizNote: "Concept, not to scale.",
    vizLabel: "Time from map idea to playable greybox: about 3 months before, under one hour after." },
  { id: "cosmetics", tags: ["Vendor partnerships & outsourcing", "Internal tools platform", "Scaling teams"], numNote: "League skins a year from Virtuos Sparx", num: "~100", title: "Set up the partnership behind most of League's skins", years: "2019–22",
    role: "TPM, PIE Tooling (League content)", team: "tools team 2 → 12 engineers, plus Virtuos Sparx",
    context: "League's content team shipped all of its content, skins included, on a two-week release cadence.",
    call: "I vetted, selected and signed Virtuos Sparx, then built the foundations: security, operations and a working agreement between the two studios. I also grew the embedded tools team from 2 to 12 engineers.",
    tradeOff: "[ the trade-off ]",
    result: "Within two years, Sparx made about half of League's skins. Today it delivers about 100 a year, roughly 30–40 artists' worth of work, without Riot growing its own content team.",
    bars: [
      { label: "Share of League skins from Sparx", before: "none", beforeWidth: "2%", after: "about half, within 2 years", afterWidth: "50%" },
      { label: "Tools team", before: "2 engineers", beforeWidth: "16.7%", after: "12 engineers", afterWidth: "100%" },
    ],
    vizNote: "Approximate.",
    vizLabel: "Sparx went from none to about half of League's skins within two years; the tools team grew from 2 to 12 engineers." },
  { id: "okr", tags: ["OKRs", "Cross-discipline leadership", "External development"], numNote: "Team of teams I led, across 4–5 countries", num: "50+", title: "Turned an unrealistic plan into one the team could hit", years: "2022",
    role: "Technical Product Manager · Lead Producer role, unannounced project", team: "art, audio and graphics teams, 4 partner studios",
    context: "The project's plan wasn't realistic, and no one was tracking commitments week to week.",
    call: "I set numeric OKR targets, tracked sprint velocity against them every week, and ran a 3-week test that built a character and scripted gameplay end to end.",
    tradeOff: "[ the trade-off ]",
    result: "Leadership re-planned the scope, milestones became reliable, and the delivery lead adopted the system.",
    reach: { from: ["One objective", "Key results"], to: ["rigging", "animation", "VFX", "rendering", "audio", "art engineering"] },
    vizLabel: "One objective and its key results, set across rigging, animation, VFX, rendering, audio and art engineering." },
];
