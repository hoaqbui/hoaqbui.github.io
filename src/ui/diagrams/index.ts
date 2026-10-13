import type { JSX } from "react";
import MangaToVideo from "./MangaToVideo";
import MacVideoApp from "./MacVideoApp";
import Parti from "./Parti";
import HimmelCam from "./HimmelCam";
import ArtTests from "./ArtTests";

export const diagrams: Record<string, () => JSX.Element> = {
  "manga-to-video": MangaToVideo,
  "mac-video-app": MacVideoApp,
  "parti": Parti,
  "himmelcam": HimmelCam,
  "art-tests": ArtTests,
};

export { MangaToVideo, MacVideoApp, Parti, HimmelCam, ArtTests };
