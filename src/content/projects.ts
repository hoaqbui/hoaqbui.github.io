export type Project = { id: string; title: string; body: string; status: string; live: boolean; steps?: string[]; why?: string; chips: string[] };
export const projects: Project[] = [
  { id: "manga-to-video", title: "Manga-to-video pipeline",
    body: "Turns comic pages into storyboarded video using ComfyUI, LTX and automatic panel detection.",
    status: "runs end to end · hardening", live: true,
    steps: ["Comic pages", "Panel detection", "Character orthos · ComfyUI", "Video · LTX", "Continuity ledger"],
    why: "Removing the friction between a creative’s intent and what they make. Building it end to end shows where generative video still breaks.",
    chips: ["ComfyUI", "LTX", "panel detection"] },
  { id: "mac-video-app", title: "Mac-native AI video app",
    body: "A privacy-first video generation product with a cloud GPU backend.",
    status: "working prototype", live: true,
    chips: ["macOS", "video generation", "cloud GPU"] },
  { id: "parti", title: "Parti",
    body: "An early-stage multi-agent orchestration system that runs a research, plan, implement, verify and evaluate loop across a three-node home lab: a Mac Studio, a GB10 workstation and a NAS.",
    status: "early stage", live: false,
    steps: ["Research", "Plan", "Implement", "Verify", "Evaluate"],
    why: "One person gets a coherent, capable team of AI collaborators without running an agent swarm or coordinating every conversation.",
    chips: ["multi-agent", "home lab", "Claude Code"] },
];
