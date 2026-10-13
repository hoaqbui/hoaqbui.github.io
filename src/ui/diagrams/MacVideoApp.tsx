export default function MacVideoApp() {
  return (
    <svg
      viewBox="0 0 560 220"
      role="img"
      aria-label="Prompt on the Mac sends requests to Cloud GPU, returning video back to the Mac, with local data kept private by default"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <marker
          id="mva-teal-arrow"
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
          id="mva-amber-arrow"
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

      {/* Mac boundary zone - private by default */}
      <rect
        x="24"
        y="24"
        width="216"
        height="172"
        rx="14"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Cloud GPU zone */}
      <rect
        x="320"
        y="24"
        width="216"
        height="172"
        rx="14"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* Connector lines between Mac and Cloud */}
      {/* Forward: Prompt to Cloud GPU */}
      <path
        d="M 194 72 H 366"
        fill="none"
        stroke="var(--color-teal)"
        strokeWidth="1.5"
        strokeLinecap="round"
        markerEnd="url(#mva-teal-arrow)"
      />

      {/* Return: Video back to Mac */}
      <path
        d="M 366 148 H 194"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth="1.5"
        strokeLinecap="round"
        markerEnd="url(#mva-amber-arrow)"
      />

      {/* Nodes & text */}
      <g
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        fill="var(--color-text)"
        fontSize="11"
      >
        {/* Mac boundary label */}
        <text x="132" y="44" fill="var(--color-muted)" fontSize="10">
          Mac (local)
        </text>

        {/* Cloud GPU boundary label */}
        <text x="428" y="44" fill="var(--color-muted)" fontSize="10">
          Cloud backend
        </text>

        {/* Prompt on Mac */}
        <rect
          x="54"
          y="52"
          width="136"
          height="40"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="122" y="76">
          Prompt
        </text>

        {/* Video on Mac */}
        <rect
          x="54"
          y="128"
          width="136"
          height="40"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-border)"
          strokeWidth="1"
        />
        <text x="122" y="152">
          Video player
        </text>

        {/* Cloud GPU */}
        <rect
          x="370"
          y="70"
          width="136"
          height="80"
          rx="10"
          fill="var(--color-surface)"
          stroke="var(--color-teal)"
          strokeWidth="1.5"
        />
        <text x="438" y="105">
          <tspan x="438" dy="0">Cloud GPU</tspan>
          <tspan x="438" dy="16" fill="var(--color-muted)" fontSize="10">video inference</tspan>
        </text>

        {/* Connector labels */}
        <text x="280" y="64" fill="var(--color-teal)" fontSize="10">
          prompt job
        </text>
        <text x="280" y="164" fill="var(--color-amber-text)" fontSize="10">
          rendered video
        </text>

        {/* "private by default" pill badge inside Mac zone */}
        <rect
          x="66"
          y="178"
          width="112"
          height="18"
          rx="9"
          fill="var(--color-surface)"
          stroke="var(--color-teal)"
          strokeWidth="1"
        />
        <text x="122" y="191" fill="var(--color-teal)" fontSize="9">
          private by default
        </text>
      </g>
    </svg>
  );
}
