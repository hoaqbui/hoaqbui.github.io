import type { PortraitSpec } from "./Portrait";

export default function IntentToVideo() {
  return (
    <svg
      viewBox="0 0 560 220"
      role="img"
      aria-label="Creative intent becomes character orthos in ComfyUI, then an image with render profiles, then video in LTX, kept consistent by a continuity ledger"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker
          id="i2v-teal-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="var(--color-teal)" />
        </marker>
        <marker
          id="i2v-amber-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="var(--color-amber)" />
        </marker>
      </defs>

      {/* Main forward connectors */}
      <g fill="none" stroke="var(--color-teal)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M 120 85 H 136" markerEnd="url(#i2v-teal-arrow)" />
        <path d="M 256 85 H 272" markerEnd="url(#i2v-teal-arrow)" />
        <path d="M 392 85 H 408" markerEnd="url(#i2v-teal-arrow)" />
      </g>

      {/* Continuity ledger loop back under the stages */}
      <path
        d="M 464 116 V 164 H 204 V 122"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#i2v-amber-arrow)"
      />

      {/* Boxes and labels */}
      <g
        fontFamily="var(--font-sans)"
        textAnchor="middle"
        fill="var(--color-text)"
        fontSize="11"
      >
        {/* Stage 1: Intent */}
        <rect
          x="16"
          y="54"
          width="104"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="68" y="90">
          Intent
        </text>

        {/* Stage 2: Character orthos · ComfyUI */}
        <rect
          x="136"
          y="54"
          width="120"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="196" y="82">
          <tspan x="196" dy="0">Character orthos</tspan>
          <tspan x="196" dy="16" fill="var(--color-muted)" fontSize="10">ComfyUI</tspan>
        </text>

        {/* Stage 3: Image · render profiles */}
        <rect
          x="272"
          y="54"
          width="120"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="332" y="82">
          <tspan x="332" dy="0">Image</tspan>
          <tspan x="332" dy="16" fill="var(--color-muted)" fontSize="10">render profiles</tspan>
        </text>

        {/* Stage 4: Video · LTX */}
        <rect
          x="408"
          y="54"
          width="112"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="464" y="82">
          <tspan x="464" dy="0">Video</tspan>
          <tspan x="464" dy="16" fill="var(--color-muted)" fontSize="10">LTX</tspan>
        </text>

        {/* Feedback loop label */}
        <text x="334" y="184" fill="var(--color-amber-text)" fontSize="11">
          continuity ledger loop
        </text>
      </g>
    </svg>
  );
}

export const portrait: PortraitSpec = {
  id: "i2v",
  aria: "Creative intent becomes character orthos in ComfyUI, then an image with render profiles, then video in LTX, kept consistent by a continuity ledger",
  steps: [
    { label: "Intent" },
    { label: "Character orthos", sub: "ComfyUI" },
    { label: "Image", sub: "render profiles" },
    { label: "Video", sub: "LTX" },
  ],
  loop: { from: 3, to: 1, label: "continuity ledger loop" },
};
