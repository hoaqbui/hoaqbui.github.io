export type Bar = { label: string; before: string; beforeWidth: string; after: string; afterWidth: string };
export type Story = {
  id: string; num: string; numNote: string; title: string; years: string; role: string; team: string;
  context: string; call: string; tradeOff: string; result: string;
  vizLabel: string; bars?: Bar[]; vizNote?: string; reach?: { from: string[]; to: string[] };
};
export const stories: Story[] = [
  { id: "greybox", num: "<1 hr", numNote: "down from weeks", title: "Greybox League in under an hour", years: "2024–26",
    role: "Sr. TPM, League of Legends tools", team: "[ team size ]",
    context: "Map ideas waited weeks on engineering before anyone could play them.",
    call: "I set a one-hour bar and bet on region boundaries: ground planes designers draw themselves.",
    tradeOff: "[ the greybox alternative I passed on, and why ]",
    result: "Weeks to under an hour. It became the studio default.",
    bars: [{ label: "Idea → playable map", before: "weeks", beforeWidth: "100%", after: "under 1 hour", afterWidth: "3%" }],
    vizNote: "Concept, not to scale.",
    vizLabel: "Time from map idea to playable greybox: weeks before, under one hour after." },
  { id: "cosmetics", num: "−50%", numNote: "cost per asset, at 2× capacity", title: "Half the cost per asset, twice the output", years: "2019–22",
    role: "TPM, PIE Tooling (League content)", team: "tools team 2 → 12 engineers, plus Virtuos Sparx",
    context: "[ cosmetics context: what was breaking before ]",
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
  { id: "fulcrum", num: "CTO", numNote: "plus VP of Art and ML lead", title: "Fulcrum: AI adoption a studio said yes to", years: "2025–26",
    role: "Sr. TPM, League of Legends tools", team: "[ partners ]",
    context: "[ Fulcrum tension: why AI adoption was stuck ]",
    call: "I wrote Riot’s AI-assisted content strategy and a Human Framework for AI Adoption, framing AI tooling as how League serves new regions at viable cost.",
    tradeOff: "[ the trade-off ]",
    result: "It reached the CTO, VP of Art and ML lead.",
    reach: { from: ["AI-assisted content strategy", "Human Framework for AI Adoption"], to: ["CTO", "VP of Art", "ML lead"] },
    vizLabel: "The strategy and the Human Framework reached the CTO, VP of Art and ML lead." },
];
