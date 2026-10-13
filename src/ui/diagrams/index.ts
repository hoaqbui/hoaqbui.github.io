import type { JSX } from "react";
import IntentToVideo from "./IntentToVideo";
import Parti from "./Parti";
import HimmelCam from "./HimmelCam";

export const diagrams: Record<string, () => JSX.Element> = {
  "intent-to-video": IntentToVideo,
  "parti": Parti,
  "himmelcam": HimmelCam,
};

export { IntentToVideo, Parti, HimmelCam };
