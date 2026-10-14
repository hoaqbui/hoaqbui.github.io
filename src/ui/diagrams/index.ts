import type { JSX } from "react";
import IntentToVideo, { portrait as intentToVideo } from "./IntentToVideo";
import Parti, { portrait as parti } from "./Parti";
import HimmelCam, { portrait as himmelCam } from "./HimmelCam";
import type { PortraitSpec } from "./Portrait";

export const diagrams: Record<string, () => JSX.Element> = {
  "intent-to-video": IntentToVideo,
  "parti": Parti,
  "himmelcam": HimmelCam,
};

// Phone versions, drawn top to bottom by ./Portrait
export const portraits: Record<string, PortraitSpec> = {
  "intent-to-video": intentToVideo,
  "parti": parti,
  "himmelcam": himmelCam,
};

export { IntentToVideo, Parti, HimmelCam };
export { default as Portrait } from "./Portrait";
