// A screenshot in light and dark: `src` is the path without "-light.webp" / "-dark.webp".
export type Shot = { src: string; width: number; height: number; alt: string };
export type Project = { id: string; title: string; body: string; status: string; live: boolean; steps?: string[]; why?: string; chips: string[]; tryUrl?: string;
  // screenshots of the running app (Parti only so far; user, 2026-10-14)
  shots?: { card: Shot; hero: Shot; steps: { shot: Shot; caption: string }[] } };
export const projects: Project[] = [
  { id: "intent-to-video", title: "Intent-to-video pipeline",
    body: "Turns creative intent into images, then video, on ComfyUI and LTX, with character orthos, render profiles and a continuity ledger for shot-to-shot consistency.",
    status: "runs end to end · hardening", live: true,
    steps: ["Intent", "Character orthos · ComfyUI", "Image · render profiles", "Video · LTX", "Continuity ledger"],
    why: "Removing the friction between a creative’s intent and what they make. Building it end to end shows where generative video still breaks.",
    chips: ["Generative video", "Diffusion", "Human-in-the-loop", "ComfyUI", "LTX"],
    // Compo, password-gated; the password is given on request, never published.
    tryUrl: "https://mac-m4max.eel-terrapin.ts.net/" },
  { id: "parti", title: "Parti",
    body: "An early-stage multi-agent orchestration system that runs a research, plan, implement, verify and evaluate loop across a three-node home lab: a Mac Studio, a GB10 workstation and a NAS.",
    status: "early stage", live: false,
    steps: ["Research", "Plan", "Implement", "Verify", "Evaluate"],
    why: "One person gets a coherent, capable team of AI collaborators without managing every agent or every conversation.",
    chips: ["Agentic AI", "Multi-agent orchestration", "Model evaluation", "Content provenance", "Local-first AI"],
    // The running app in its preview mode: demo data, a demo project, nothing from real sessions.
    shots: {
      card: { src: "/projects/parti/card", width: 1328, height: 632, alt: "Parti asks: two ways to fix the export, which one? Scale at render is recommended" },
      hero: { src: "/projects/parti/hero", width: 2400, height: 1500, alt: "The Parti workspace: sessions and agents on the left, the main agent's thread in the middle with a plan running and a question for you, the project's files on the right" },
      steps: [
        { shot: { src: "/projects/parti/step-1", width: 1328, height: 820, alt: "The plan for “Fix the export at 2x” running as step 3 of 5 on Codex, with a Claude Code worker and the files it read" }, caption: "You ask. The main agent plans the work and hands it to a coding worker: Claude Code or Codex." },
        { shot: { src: "/projects/parti/step-2", width: 1344, height: 816, alt: "Two questions waiting for you: which fix to take, and whether Claude Code may write to a file" }, caption: "A worker needs you: pick between two fixes, or approve a file write." },
        { shot: { src: "/projects/parti/step-3", width: 2000, height: 633, alt: "The main agent browsing a docs page about export scale, with its action log and a Stop button" }, caption: "An agent drives the built-in browser. You can watch it, take over or stop it." },
        { shot: { src: "/projects/parti/step-4", width: 2000, height: 741, alt: "The changes view: two changed files and the diff that stops applying the pixel ratio twice, ready to commit" }, caption: "Review the changes and the diff, then commit." },
        { shot: { src: "/projects/parti/step-5", width: 2000, height: 759, alt: "Proposals: a new skill, “Summarise a long thread”, with Accept, Edit first and Reject" }, caption: "The team learns: it proposes new skills, which you accept, edit or reject." },
      ],
    } },
  { id: "himmelcam", title: "HimmelCam", body: "A dog-cam watcher. A PTZ camera and a vision model find Himmel, and a pan/tilt/zoom loop keeps Himmel in view, with clips and alerts to a phone.", status: "[ status ]", live: false, steps: ["Camera stream", "Find Himmel", "Pan · tilt · zoom", "Clips & alerts"], why: "[ why build it ]", chips: ["Computer vision", "Edge AI", "PTZ control loop"] }
];
