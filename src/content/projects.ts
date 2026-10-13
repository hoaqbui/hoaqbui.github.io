export type Project = { id: string; title: string; body: string; status: string; live: boolean; steps?: string[]; why?: string; chips: string[] };
export const projects: Project[] = [
  { id: "intent-to-video", title: "Intent-to-video pipeline",
    body: "Turns creative intent into images, then video, on ComfyUI and LTX, with character orthos, render profiles and a continuity ledger for shot-to-shot consistency.",
    status: "runs end to end · hardening", live: true,
    steps: ["Intent", "Character orthos · ComfyUI", "Image · render profiles", "Video · LTX", "Continuity ledger"],
    why: "Removing the friction between a creative’s intent and what they make. Building it end to end shows where generative video still breaks.",
    chips: ["ComfyUI", "LTX", "continuity ledger"] },
  { id: "parti", title: "Parti",
    body: "An early-stage multi-agent orchestration system that runs a research, plan, implement, verify and evaluate loop across a three-node home lab: a Mac Studio, a GB10 workstation and a NAS.",
    status: "early stage", live: false,
    steps: ["Research", "Plan", "Implement", "Verify", "Evaluate"],
    why: "One person gets a coherent, capable team of AI collaborators without managing every agent or every conversation.",
    chips: ["multi-agent", "home lab", "Claude Code"] },
  { id: "himmelcam", title: "HimmelCam", body: "A dog-cam watcher. A PTZ camera and a vision model find Himmel, and a pan/tilt/zoom loop keeps Himmel in view, with clips and alerts to a phone.", status: "[ status ]", live: false, steps: ["Camera stream", "Find Himmel", "Pan · tilt · zoom", "Clips & alerts"], why: "[ why build it ]", chips: ["PTZ camera", "vision model", "tracking loop"] }
];
