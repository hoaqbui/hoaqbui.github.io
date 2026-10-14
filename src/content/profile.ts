export type Profile = { name: string; roleLine: string; headline: string; subLine: string; email: string; linkedin: string; resumePath: string; resumePdfUrl: string; resumeEmailHref: string; vcardPath: string; openTo: string; industries: string[]; searchTerms: string[]; quote: { text: string; by: string } };
const email = "hoaqbui@gmail.com";
const linkedin = "https://www.linkedin.com/in/hoaqbui/";
// Google renders a fresh PDF from the public 2-page Doc on every request.
const resumePdfUrl =
  "https://docs.google.com/document/d/1s-OGEpBgFRViEk3mBTeSgL9CHzl-wdsOQKxoBNQtU7s/export?format=pdf";
// Résumé button: an email draft carrying a link to the always-current PDF.
const resumeEmailHref =
  "mailto:?subject=" +
  encodeURIComponent("Hoa Bui — Résumé") +
  "&body=" +
  encodeURIComponent(
    `Hoa Bui's résumé (latest PDF): ${resumePdfUrl}\n\n` +
      `LinkedIn: ${linkedin}\n` +
      `Site: https://hoa.flamme.us\n` +
      `Email: ${email}\n`,
  );

export const profile: Profile = {
  name: "Hoa Bui",
  roleLine: "Senior Technical Product Manager · AI creative tools · Los Angeles",
  headline: "AI and creative tools that put more in people’s hands.",
  subLine: "19 years of pipelines and tools at Lucasfilm, Pixar and Riot Games.",
  email,
  linkedin,
  resumePath: "https://docs.google.com/document/d/1s-OGEpBgFRViEk3mBTeSgL9CHzl-wdsOQKxoBNQtU7s/view",
  resumePdfUrl,
  resumeEmailHref,
  vcardPath: "/hoa-bui.vcf",
  openTo: "Open to Senior Product Manager and Senior Technical Product Manager roles in AI creative tools. Los Angeles.",
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

