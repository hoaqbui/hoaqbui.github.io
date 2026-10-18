// A screenshot in light and dark: `src` is the path without "-light.webp" / "-dark.webp".
// `themed: false` is one image for both themes at `${src}.webp` (an app with no dark theme).
// `scale` is the capture’s pixel ratio: a phone capture is 3x, a desktop one 2x.
export type Shot = { src: string; width: number; height: number; alt: string; themed?: boolean; scale?: number };
// A short muted loop the project made.
export type Clip = { src: string; poster: string; width: number; height: number; caption: string };
export type Project = { id: string; title: string; body: string; status: string; live: boolean; steps?: string[]; why?: string; chips: string[]; tryUrl?: string;
  // the From still to shot panel, after How it runs (card 73; Intent-to-video only)
  photoShots?: boolean;
  // screenshots of the running app (Parti only so far; user, 2026-10-14)
  shots?: { card: Shot; hero?: Shot; clips?: Clip[]; stepsTitle?: string; steps: { shot: Shot; caption: string }[] } };
export const projects: Project[] = [
  { id: "intent-to-video", title: "Intent-to-video pipeline",
    body: "Turns creative intent into images, then video, on ComfyUI and LTX, with character orthos, render profiles, and a continuity ledger for shot-to-shot consistency.",
    status: "runs end to end · hardening", live: true, photoShots: true,
    steps: ["Intent", "Character orthos · ComfyUI", "Image · render profiles", "Video · LTX", "Continuity ledger"],
    why: "Removing the friction between a creative’s intent and what they make. Building it end to end shows where generative video still breaks.",
    chips: ["Generative video", "Diffusion", "Human-in-the-loop", "ComfyUI", "LTX"],
    // Compo, the app the pipeline runs in, against mocked demo data; the clips are real takes.
    shots: {
      card: { src: "/projects/intent-to-video/card", width: 1170, height: 741, themed: false, scale: 3, alt: "Compo’s Library: a paper lantern drifting over a lake at night, and waves rolling onto a beach at sunset, both done" },
      clips: [
        { src: "/projects/intent-to-video/lantern", poster: "/projects/intent-to-video/lantern-poster.jpg", width: 704, height: 384, caption: "“A paper lantern drifting over a lake at night”" },
        { src: "/projects/intent-to-video/waves", poster: "/projects/intent-to-video/waves-poster.jpg", width: 704, height: 384, caption: "“Waves rolling onto a beach at sunset”" },
      ],
      stepsTitle: "From a sentence to a clip, in Compo",
      steps: [
        { shot: { src: "/projects/intent-to-video/step-1", width: 1170, height: 1683, themed: false, scale: 3, alt: "Compo’s chat with suggested prompts, and “A paper lantern drifting over a lake at night” typed in" }, caption: "Describe the shot in a sentence, or start from a photo." },
        { shot: { src: "/projects/intent-to-video/step-2", width: 1170, height: 785, themed: false, scale: 3, alt: "The guide’s plan: a 6-second 480p clip at 16:9, and Take 1 waiting in the queue" }, caption: "The guide turns it into a plan (clip or still, length, size) and queues the take on the home-lab machines." },
        { shot: { src: "/projects/intent-to-video/step-3", width: 1170, height: 1660, themed: false, scale: 3, alt: "The finished take in the chat: the lantern clip with Keep, Reject, Another take and Download" }, caption: "The take comes back into the chat. Keep it, reject it, or ask for another." },
        { shot: { src: "/projects/intent-to-video/step-4", width: 1170, height: 1823, themed: false, scale: 3, alt: "The Library: clips of a lantern, waves and a candle, and stills of a red kite and a blue door" }, caption: "Everything lands in the Library, stills and clips, to pick from later." },
      ],
    },
    // Compo, password-gated; the password is given on request, never published.
    tryUrl: "https://mac-m4max.eel-terrapin.ts.net/" },
  { id: "parti", title: "Parti",
    body: "An early-stage multi-agent orchestration system that runs a research, plan, implement, verify, and evaluate loop across a three-node home lab: a Mac Studio, a GB10 workstation, and a NAS.",
    status: "early stage", live: false,
    steps: ["Research", "Plan", "Implement", "Verify", "Evaluate"],
    why: "One person gets a coherent, capable team of AI collaborators without managing every agent or every conversation.",
    chips: ["Agentic AI", "Multi-agent orchestration", "Model evaluation", "Content provenance", "Local-first AI"],
    // The running app in its preview mode: demo data, a demo project, nothing from real sessions.
    shots: {
      card: { src: "/projects/parti/card", width: 1328, height: 640, alt: "Parti asks: two ways to fix the export, which one? Scale at render is recommended" },
      hero: { src: "/projects/parti/hero", width: 2400, height: 1500, alt: "The Parti workspace: sessions and agents on the left, the main agent’s thread in the middle with a plan running and a question for you, the project’s files on the right" },
      steps: [
        { shot: { src: "/projects/parti/step-1", width: 1328, height: 800, alt: "The plan for “Fix the export at 2x” running as step 3 of 5 on Codex, with a Claude Code worker and the files it read" }, caption: "You ask. The main agent plans the work and hands it to a coding worker: Claude Code or Codex." },
        { shot: { src: "/projects/parti/step-2", width: 1344, height: 788, alt: "Two questions waiting for you: which fix to take, and whether Claude Code may write to a file" }, caption: "A worker needs you: pick between two fixes, or approve a file write." },
        { shot: { src: "/projects/parti/step-3", width: 2000, height: 633, alt: "The main agent browsing a docs page about export scale, with its action log and a Stop button" }, caption: "An agent drives the built-in browser. You can watch it, take over or stop it." },
        { shot: { src: "/projects/parti/step-4", width: 2000, height: 741, alt: "The changes view: two changed files and the diff that stops applying the pixel ratio twice, ready to commit" }, caption: "Review the changes and the diff, then commit." },
        { shot: { src: "/projects/parti/step-5", width: 2000, height: 759, alt: "Proposals: a new skill, “Summarise a long thread”, with Accept, Edit first and Reject" }, caption: "The team learns: it proposes new skills, which you accept, edit or reject." },
      ],
    } },
  { id: "himmelcam", title: "HimmelCam", body: "A dog-cam watcher. A PTZ camera and a vision model find Himmel, and a pan/tilt/zoom loop keeps Himmel in view, with clips and alerts to a phone.", status: "side project", live: false, steps: ["Camera stream", "Find Himmel", "Pan · tilt · zoom", "Clips & alerts"], why: "[ why build it ]", chips: ["Computer vision", "Edge AI", "PTZ control loop"] }
];
