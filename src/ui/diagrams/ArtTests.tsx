export default function ArtTests() {
  return (
    <svg
      viewBox="0 0 560 220"
      role="img"
      aria-label="Source art passes automated checks, exports through build into in game assets, with provenance tracking back to source art"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker
          id="at-teal-arrow"
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
          id="at-amber-arrow"
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

      {/* Main forward flow connectors */}
      <g fill="none" stroke="var(--color-teal)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M 128 78 H 146" markerEnd="url(#at-teal-arrow)" />
        <path d="M 264 78 H 282" markerEnd="url(#at-teal-arrow)" />
        <path d="M 400 78 H 418" markerEnd="url(#at-teal-arrow)" />
      </g>

      {/* Provenance loop back to Source art */}
      <path
        d="M 480 114 V 162 H 72 V 122"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#at-amber-arrow)"
      />

      {/* Stages and text */}
      <g
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        fill="var(--color-text)"
        fontSize="11"
      >
        {/* Stage 1: Source art */}
        <rect
          x="16"
          y="46"
          width="112"
          height="64"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="72" y="74">
          <tspan x="72" dy="0">Source art</tspan>
          <tspan x="72" dy="16" fill="var(--color-muted)" fontSize="10">PSD · 3D · AI</tspan>
        </text>

        {/* Stage 2: Checks */}
        <rect
          x="152"
          y="46"
          width="112"
          height="64"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-teal)"
          strokeWidth="1.5"
        />
        <text x="208" y="74">
          <tspan x="208" dy="0">Checks</tspan>
          <tspan x="208" dy="16" fill="var(--color-muted)" fontSize="10">budget · format</tspan>
        </text>

        {/* Stage 3: Build */}
        <rect
          x="288"
          y="46"
          width="112"
          height="64"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="344" y="74">
          <tspan x="344" dy="0">Build</tspan>
          <tspan x="344" dy="16" fill="var(--color-muted)" fontSize="10">export · bake</tspan>
        </text>

        {/* Stage 4: In game */}
        <rect
          x="424"
          y="46"
          width="112"
          height="64"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="480" y="74">
          <tspan x="480" dy="0">In game</tspan>
          <tspan x="480" dy="16" fill="var(--color-muted)" fontSize="10">shipped asset</tspan>
        </text>

        {/* Fail -> Fix badge near Checks */}
        <rect
          x="173"
          y="120"
          width="70"
          height="20"
          rx="10"
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth="1"
        />
        <text x="208" y="134" fill="var(--color-amber-text)" fontSize="9">
          fail → fix
        </text>

        {/* Provenance loop label */}
        <text x="276" y="182" fill="var(--color-amber-text)" fontSize="11">
          provenance: source, version & tool
        </text>
      </g>
    </svg>
  );
}
