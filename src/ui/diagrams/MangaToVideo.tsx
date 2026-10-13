export default function MangaToVideo() {
  return (
    <svg
      viewBox="0 0 560 220"
      role="img"
      aria-label="Comic pages go through panel detection, character orthos in ComfyUI and video in LTX, tracked by a continuity ledger"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker
          id="m2v-teal-arrow"
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
          id="m2v-amber-arrow"
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
        <path d="M 108 85 H 120" markerEnd="url(#m2v-teal-arrow)" />
        <path d="M 218 85 H 230" markerEnd="url(#m2v-teal-arrow)" />
        <path d="M 328 85 H 340" markerEnd="url(#m2v-teal-arrow)" />
        <path d="M 438 85 H 450" markerEnd="url(#m2v-teal-arrow)" />
      </g>

      {/* Continuity ledger loop back under the stages */}
      <path
        d="M 505 116 V 164 H 174 V 122"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#m2v-amber-arrow)"
      />

      {/* Boxes and labels */}
      <g
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        fill="var(--color-text)"
        fontSize="11"
      >
        {/* Stage 1: Comic pages */}
        <rect
          x="12"
          y="54"
          width="96"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="60" y="82">
          <tspan x="60" dy="0">Comic</tspan>
          <tspan x="60" dy="16">pages</tspan>
        </text>

        {/* Stage 2: Panel detection */}
        <rect
          x="122"
          y="54"
          width="96"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="170" y="82">
          <tspan x="170" dy="0">Panel</tspan>
          <tspan x="170" dy="16">detection</tspan>
        </text>

        {/* Stage 3: Character orthos · ComfyUI */}
        <rect
          x="232"
          y="54"
          width="96"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="280" y="82">
          <tspan x="280" dy="0">Orthos</tspan>
          <tspan x="280" dy="16" fill="var(--color-muted)" fontSize="10">ComfyUI</tspan>
        </text>

        {/* Stage 4: Video · LTX */}
        <rect
          x="342"
          y="54"
          width="96"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="390" y="82">
          <tspan x="390" dy="0">Video</tspan>
          <tspan x="390" dy="16" fill="var(--color-muted)" fontSize="10">LTX</tspan>
        </text>

        {/* Stage 5: Continuity ledger */}
        <rect
          x="452"
          y="54"
          width="96"
          height="62"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="500" y="82">
          <tspan x="500" dy="0">Continuity</tspan>
          <tspan x="500" dy="16">ledger</tspan>
        </text>

        {/* Feedback loop label */}
        <text x="339" y="184" fill="var(--color-amber-text)" fontSize="11">
          continuity feedback loop
        </text>
      </g>
    </svg>
  );
}
