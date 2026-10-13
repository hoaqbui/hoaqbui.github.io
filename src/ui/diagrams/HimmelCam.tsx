export default function HimmelCam() {
  return (
    <svg
      viewBox="0 0 560 220"
      role="img"
      aria-label="Camera stream flows to Find Himmel vision model, drives Pan tilt zoom control, sending clips and alerts to phone with feedback back to camera"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker
          id="hc-teal-arrow"
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
          id="hc-amber-arrow"
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
        <path d="M 128 85 H 146" markerEnd="url(#hc-teal-arrow)" />
        <path d="M 264 85 H 282" markerEnd="url(#hc-teal-arrow)" />
        <path d="M 400 85 H 418" markerEnd="url(#hc-teal-arrow)" />
      </g>

      {/* Feedback loop from Pan · tilt · zoom back to camera stream */}
      <path
        d="M 341 122 V 162 H 72 V 122"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#hc-amber-arrow)"
      />

      {/* Stages and text */}
      <g
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        fill="var(--color-text)"
        fontSize="11"
      >
        {/* Stage 1: Camera stream */}
        <rect
          x="16"
          y="50"
          width="112"
          height="68"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        {/* PTZ camera icon element */}
        <circle cx="72" cy="72" r="8" fill="none" stroke="var(--color-text)" strokeWidth="1.5" />
        <circle cx="72" cy="72" r="3" fill="var(--color-text)" />
        <text x="72" y="99">
          <tspan x="72" dy="0">Camera stream</tspan>
        </text>

        {/* Stage 2: Find Himmel */}
        <rect
          x="152"
          y="50"
          width="112"
          height="68"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-teal)"
          strokeWidth="1.5"
        />
        <text x="208" y="80">
          <tspan x="208" dy="0">Find Himmel</tspan>
          <tspan x="208" dy="16" fill="var(--color-muted)" fontSize="10">vision model</tspan>
        </text>

        {/* Stage 3: Pan · tilt · zoom */}
        <rect
          x="288"
          y="50"
          width="112"
          height="68"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="344" y="80">
          <tspan x="344" dy="0">Pan · tilt · zoom</tspan>
          <tspan x="344" dy="16" fill="var(--color-muted)" fontSize="10">control loop</tspan>
        </text>

        {/* Stage 4: Clips & alerts */}
        <rect
          x="424"
          y="50"
          width="112"
          height="68"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="480" y="80">
          <tspan x="480" dy="0">Clips & alerts</tspan>
          <tspan x="480" dy="16" fill="var(--color-muted)" fontSize="10">phone push</tspan>
        </text>

        {/* Feedback label */}
        <text x="208" y="182" fill="var(--color-amber-text)" fontSize="11">
          PTZ actuation feedback loop
        </text>
      </g>
    </svg>
  );
}
