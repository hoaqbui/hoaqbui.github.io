// Phone version of a project diagram: the same stages, top to bottom, at a size whose
// labels stay readable on a 320–430px screen (the wide drawings shrink to ~6px text there).

export type PortraitStep = { label: string; sub?: string; strong?: boolean };
export type PortraitSpec = {
  id: string;
  aria: string;
  steps: PortraitStep[];
  // dashed boxes around runs of steps, e.g. which machine runs them
  groups?: { label: string; from: number; to: number }[];
  // amber dashed return path from one step back to an earlier one
  loop?: { from: number; to: number; label: string };
  // a shared base under everything (Parti's NAS), one string per line
  base?: string[];
};

const W = 300;
const BOX_X = 28;
const BOX_W = 212;
const CX = BOX_X + BOX_W / 2;
const BOX_H = 50;
const GAP = 26;
const GROUP_PAD = 10;
const GROUP_LABEL = 18;

export default function Portrait({ spec }: { spec: PortraitSpec }) {
  // vertical position of each step, leaving room for group labels above each group
  const ys: number[] = [];
  let y = 8;
  // A group's label sits on top unless a flow arrow comes in from above (not the first
  // step); then it goes underneath, so no arrow ever crosses it.
  const labelOnTop = (g: { from: number }) => g.from === 0;
  spec.steps.forEach((_, i) => {
    const opens = spec.groups?.find((g) => g.from === i);
    if (opens) y += labelOnTop(opens) ? GROUP_LABEL + GROUP_PAD : GROUP_PAD;
    ys.push(y);
    y += BOX_H;
    const closes = spec.groups?.find((g) => g.to === i);
    if (closes) y += labelOnTop(closes) ? GROUP_PAD : GROUP_PAD + GROUP_LABEL;
    y += GAP;
  });
  y -= GAP;
  const baseY = y + 18;
  const baseH = spec.base ? 16 + spec.base.length * 14 : 0;
  const H = (spec.base ? baseY + baseH + 8 : y) + (spec.loop ? 30 : 8);
  const mid = (i: number) => ys[i] + BOX_H / 2;
  const right = BOX_X + BOX_W;
  const loopX = W - 16;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.aria} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id={`${spec.id}-p-teal`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="var(--color-teal)" />
        </marker>
        <marker id={`${spec.id}-p-amber`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 7 5 L 0 8.5 z" fill="var(--color-amber)" />
        </marker>
      </defs>

      {spec.groups?.map((g) => {
        const top = ys[g.from] - GROUP_PAD - (labelOnTop(g) ? GROUP_LABEL - 4 : 0);
        const bottom = ys[g.to] + BOX_H + GROUP_PAD + (labelOnTop(g) ? 0 : GROUP_LABEL - 4);
        return (
          <rect key={g.label} x={BOX_X - 12} y={top} width={BOX_W + 24} height={bottom - top} rx="12" fill="none" stroke="var(--color-border)" strokeDasharray="3 3" />
        );
      })}

      {/* forward flow */}
      {spec.steps.slice(1).map((_, i) => (
        <line key={i} x1={CX} y1={ys[i] + BOX_H + 2} x2={CX} y2={ys[i + 1] - 4} stroke="var(--color-teal)" strokeWidth="1.5" markerEnd={`url(#${spec.id}-p-teal)`} />
      ))}

      {/* group labels */}
      {spec.groups?.map((g) => (
        <text
          key={g.label}
          x={BOX_X - 2}
          y={labelOnTop(g) ? ys[g.from] - GROUP_LABEL - GROUP_PAD + 19 : ys[g.to] + BOX_H + GROUP_PAD + 10}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--color-muted)"
        >
          {g.label}
        </text>
      ))}

      {spec.loop && (
        <path
          d={`M ${right} ${mid(spec.loop.from)} H ${loopX} V ${mid(spec.loop.to)} H ${right + 6}`}
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          markerEnd={`url(#${spec.id}-p-amber)`}
        />
      )}

      <g fontFamily="var(--font-mono)" textAnchor="middle" fill="var(--color-text)" fontSize="12">
        {spec.steps.map((s, i) => (
          <g key={s.label}>
            <rect
              x={BOX_X}
              y={ys[i]}
              width={BOX_W}
              height={BOX_H}
              rx="10"
              fill="var(--color-surface)"
              stroke={s.strong ? "var(--color-teal)" : "var(--color-border)"}
              strokeWidth={s.strong ? 1.5 : 1}
            />
            <text x={CX} y={ys[i] + (s.sub ? 22 : 30)}>
              <tspan x={CX} dy="0">{s.label}</tspan>
              {s.sub && (
                <tspan x={CX} dy="16" fill="var(--color-muted)" fontSize="11">
                  {s.sub}
                </tspan>
              )}
            </text>
          </g>
        ))}
      </g>

      {spec.base && (
        <g>
          <rect x={BOX_X - 12} y={baseY} width={BOX_W + 24} height={baseH} rx="12" fill="none" stroke="var(--color-border)" strokeDasharray="3 3" />
          <text textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-muted)">
            {spec.base.map((line, i) => (
              <tspan key={line} x={CX} y={baseY + 20 + i * 14}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      )}

      {spec.loop && (
        <text x={CX} y={H - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-amber-text)">
          ↺ {spec.loop.label}
        </text>
      )}
    </svg>
  );
}
