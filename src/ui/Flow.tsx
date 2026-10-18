// A row of steps joined by arrows, one row per line. For a before/after, pass two rows.
// Each row: an optional label on the left, the steps, and an optional note on the right.
export type FlowRow = { label?: string; steps: { text: string; sub?: string; strong?: boolean }[]; note?: string };

export default function Flow({ rows, label }: { rows: FlowRow[]; label: string }) {
  return (
    <div role="img" aria-label={label} className="flex flex-col gap-4 rounded-2xl bg-well p-5 md:p-6">
      {rows.map((row, r) => (
        <div key={r} className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {row.label && (
            <span className="w-full font-mono text-[12px] text-muted md:w-[88px] md:shrink-0">{row.label}</span>
          )}
          {row.steps.map((step, i) => (
            <span key={i} className="contents">
              {i > 0 && (
                <span aria-hidden="true" className="font-medium text-teal">
                  →
                </span>
              )}
              <span
                className={`flex flex-col rounded-xl px-3.5 py-2 text-[14px] leading-snug ${
                  step.strong ? "bg-teal text-white" : "bg-surface text-text"
                }`}
              >
                <span>{step.text}</span>
                {step.sub && (
                  <span className={`font-mono text-[11px] ${step.strong ? "text-white/80" : "text-muted"}`}>{step.sub}</span>
                )}
              </span>
            </span>
          ))}
          {row.note && <span className="font-mono text-[12px] text-muted">{row.note}</span>}
        </div>
      ))}
    </div>
  );
}
