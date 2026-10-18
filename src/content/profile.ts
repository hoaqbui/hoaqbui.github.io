export type Profile = { name: string; roleLine: string; headline: string; logos: { name: string; src: string; height: number; ratio: number }[]; latest: { label: string; value: string }; email: string; linkedin: string; resumePath: string; ogImage: { url: string; width: number; height: number; alt: string }; vcardPath: string; openTo: string; industries: string[]; searchTerms: string[]; quote: { text: string; by: string } };
const email = "hoaqbui@gmail.com";
const linkedin = "https://www.linkedin.com/in/hoaqbui/";

export const profile: Profile = {
  name: "Hoa Bui",
  roleLine: "Technical Product Manager · 18 years · Creative tools · AI workflows · Los Angeles",
  headline: "Empowering **creative teams** to do their **best work**.",
  // studio marks under the headline, drawn in the text colour (height in px, ratio = width / height)
  logos: [
    { name: "Lucasfilm", src: "/logos/lucasfilm.svg", height: 30, ratio: 1000 / 328.8 },
    { name: "Pixar", src: "/logos/pixar.svg", height: 22, ratio: 667 / 108 },
    { name: "Riot Games", src: "/logos/riot.svg", height: 32, ratio: 264.6 / 117.6 },
  ],
  // the one proof point in the hero; the full stories are in Work
  latest: { label: "League map prototyping", value: "3 months → under an hour" },
  email,
  linkedin,
  // the public 2-page Doc: always current, readable on a phone
  resumePath: "https://docs.google.com/document/d/1s-OGEpBgFRViEk3mBTeSgL9CHzl-wdsOQKxoBNQtU7s/view",
  // link-preview card for every page (pages that set their own openGraph must repeat it)
  ogImage: { url: "/og.png", width: 1200, height: 630, alt: "Hoa Bui — Empowering creative teams to do their best work." },
  vcardPath: "/hoa-bui.vcf",
  openTo: "Open to hands-on technical product manager and producer roles in AI video and creative tools, including forward deployed teams. Los Angeles.",
  // shown under the proof numbers
  industries: ["Film & VFX", "Animation", "Live-service games", "Generative AI", "Creative software"],
  // page keywords and schema.org knowsAbout; only terms the work on the page backs
  searchTerms: [
    "Technical product management", "Product management", "AI creative tools", "Generative AI",
    "Generative video", "Diffusion models", "Multimodal AI", "Agentic AI", "Multi-agent orchestration",
    "Human-in-the-loop AI", "Model evaluation", "Content provenance", "Computer vision", "Edge AI",
    "Local-first AI", "Creative software", "Film and VFX", "Animation", "Live-service games",
    "Real-time 3D", "OpenUSD", "3D production pipelines", "Content pipelines", "Workflow automation",
    "Internal tools platforms", "Developer experience", "Vendor management", "Outsourcing", "Scaling teams",
  ],
  quote: { text: "You didn’t just make us faster, you changed everything.", by: "Principal game designer, Riot" },
};

