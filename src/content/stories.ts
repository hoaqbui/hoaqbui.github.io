export type Bar = { label: string; before: string; beforeWidth: string; after: string; afterWidth: string };
export type Story = {
  id: string; num: string; numNote: string; title: string; years: string; role: string; team: string;
  context: string; call: string; tradeOff: string; result: string;
  tags: string[]; vizLabel: string; bars?: Bar[]; vizNote?: string; reach?: { from: string[]; to: string[] };
};
export const stories: Story[] = [
  { id: "greybox", tags: ["Live-service games", "Workflow automation", "Level design tooling"], num: "<1 hr", numNote: "down from weeks", title: "A League map blocked out in under an hour", years: "2024–26",
    role: "Sr. TPM, League of Legends tools", team: "4 engineers, a tech lead and an engineering lead",
    context: "Map ideas waited weeks on engineering before anyone could play them.",
    call: "I set a one-hour bar and bet on region boundaries: ground planes designers draw themselves.",
    tradeOff: "[ the greybox alternative I passed on, and why ]",
    result: "Weeks to under an hour. It became the studio default.",
    bars: [{ label: "Idea → playable map", before: "weeks", beforeWidth: "100%", after: "under 1 hour", afterWidth: "3%" }],
    vizNote: "Concept, not to scale.",
    vizLabel: "Time from map idea to playable greybox: weeks before, under one hour after." },
  { id: "cosmetics", tags: ["Internal tools platform", "Vendor management & outsourcing", "Scaling teams", "Cost reduction"], num: "−50%", numNote: "cost per asset, at 2× capacity", title: "Half the cost per asset, twice the output", years: "2019–22",
    role: "TPM, PIE Tooling (League content)", team: "tools team 2 → 12 engineers, plus Virtuos Sparx",
    context: "League's content team shipped all of its content, skins included, on a two-week release cadence.",
    call: "I embedded a tools team with the cosmetics content team and grew it from 2 to 12 engineers, and I vetted, selected and signed Virtuos Sparx as the outsourcing partner.",
    tradeOff: "[ the trade-off of embedding ]",
    result: "Cost per asset fell by half while capacity doubled. Sparx now produces almost all of League’s skins.",
    bars: [
      { label: "Cost per asset", before: "1×", beforeWidth: "100%", after: "0.5×", afterWidth: "50%" },
      { label: "Capacity", before: "1×", beforeWidth: "50%", after: "2×", afterWidth: "100%" },
      { label: "Tools team", before: "2 engineers", beforeWidth: "16.7%", after: "12 engineers", afterWidth: "100%" },
    ],
    vizNote: "Relative to the starting point.",
    vizLabel: "Cost per asset halved, capacity doubled, tools team grew from 2 to 12 engineers." },
  { id: "okr", tags: ["OKRs", "Cross-discipline leadership"], num: "50+", numNote: "artists & engineers led", title: "50+ people, one direction", years: "2022",
    role: "Lead Producer, unannounced project", team: "all of art, audio and art-domain engineering",
    context: "The organization's direction was unclear.",
    call: "I ran the team on OKRs to set direction and drive execution, and aligned leadership on data-driven decisions instead of opinions.",
    tradeOff: "[ the trade-off ]",
    result: "[ the result ]",
    reach: { from: ["One objective", "Key results"], to: ["rigging", "animation", "VFX", "rendering", "audio", "art engineering"] },
    vizLabel: "One objective and its key results, set across rigging, animation, VFX, rendering, audio and art engineering." },
];
