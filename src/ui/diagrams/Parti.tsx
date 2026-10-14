import type { PortraitSpec } from "./Portrait";

export default function Parti() {
  return (
    <svg
      viewBox="0 0 560 220"
      role="img"
      aria-label="Multi-agent orchestration running a Research, Plan, Implement, Verify, Evaluate loop spanning Mac Studio, GB10 workstation, and NAS"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker
          id="parti-teal-arrow"
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
          id="parti-amber-arrow"
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

      {/* Node clusters / host backgrounds */}
      {/* Node 1: Mac Studio */}
      <rect
        x="16"
        y="16"
        width="216"
        height="124"
        rx="12"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Node 2: GB10 workstation */}
      <rect
        x="248"
        y="16"
        width="296"
        height="124"
        rx="12"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Node 3: NAS (shared storage & artifact hub at bottom) */}
      <rect
        x="16"
        y="156"
        width="528"
        height="48"
        rx="12"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Inter-stage connections (Research -> Plan -> Implement -> Verify -> Evaluate) */}
      <g fill="none" stroke="var(--color-teal)" strokeWidth="1.5" strokeLinecap="round">
        {/* Research to Plan */}
        <path d="M 108 78 H 126" markerEnd="url(#parti-teal-arrow)" />
        {/* Plan to Implement (crosses from Mac Studio to GB10) */}
        <path d="M 218 78 H 258" markerEnd="url(#parti-teal-arrow)" />
        {/* Implement to Verify */}
        <path d="M 350 78 H 360" markerEnd="url(#parti-teal-arrow)" />
        {/* Verify to Evaluate */}
        <path d="M 444 78 H 452" markerEnd="url(#parti-teal-arrow)" />
      </g>

      {/* Loop back from Evaluate to Research via NAS */}
      <path
        d="M 495 106 V 152"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <path
        d="M 64 152 V 110"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        markerEnd="url(#parti-amber-arrow)"
      />

      {/* Host / Stage Nodes and Text */}
      <g
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        fill="var(--color-text)"
        fontSize="11"
      >
        {/* Cluster Headers */}
        <text x="124" y="34" fill="var(--color-muted)" fontSize="10">
          Mac Studio · Orchestrator
        </text>
        <text x="396" y="34" fill="var(--color-muted)" fontSize="10">
          GB10 Workstation · Compute & Harness
        </text>
        <text x="280" y="174" fill="var(--color-muted)" fontSize="10">
          NAS · Shared Workspace, Checkpoints & Provenance
        </text>

        {/* Stage 1: Research (on Mac Studio) */}
        <rect
          x="28"
          y="52"
          width="80"
          height="52"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="68" y="82">Research</text>

        {/* Stage 2: Plan (on Mac Studio) */}
        <rect
          x="138"
          y="52"
          width="80"
          height="52"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="178" y="82">Plan</text>

        {/* Stage 3: Implement (on GB10) */}
        <rect
          x="266"
          y="52"
          width="84"
          height="52"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-teal)"
          strokeWidth="1.5"
        />
        <text x="308" y="82">Implement</text>

        {/* Stage 4: Verify (on GB10) */}
        <rect
          x="368"
          y="52"
          width="76"
          height="52"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="406" y="82">Verify</text>

        {/* Stage 5: Evaluate (on GB10) */}
        <rect
          x="460"
          y="52"
          width="76"
          height="52"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="498" y="82">Evaluate</text>

        {/* Evaluation to Research cycle label */}
        <text x="280" y="192" fill="var(--color-amber-text)" fontSize="10">
          feedback & iteration loop
        </text>
      </g>
    </svg>
  );
}

export const portrait: PortraitSpec = {
  id: "parti",
  aria: "Multi-agent orchestration running a Research, Plan, Implement, Verify, Evaluate loop spanning Mac Studio, GB10 workstation, and NAS",
  steps: [
    { label: "Research" },
    { label: "Plan" },
    { label: "Implement", strong: true },
    { label: "Verify" },
    { label: "Evaluate" },
  ],
  groups: [
    { label: "Mac Studio · Orchestrator", from: 0, to: 1 },
    { label: "GB10 · Compute & Harness", from: 2, to: 4 },
  ],
  base: ["NAS · Shared Workspace,", "Checkpoints & Provenance"],
  loop: { from: 4, to: 0, label: "feedback & iteration loop" },
};
