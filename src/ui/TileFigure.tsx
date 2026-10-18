// The small picture on a Work tile, in place of a line of text (card 89).
// bars: a before/after pair · squares: one square per unit · dots: one dot per person ·
// pick: trial entrants, the one chosen, and the share it went on to make.
export type TileFig =
  | { kind: "bars"; before: string; after: string }
  | { kind: "squares"; count: number; caption: string }
  | { kind: "dots"; count: number; caption: string }
  | { kind: "pick"; tried: number; caption: string };

const caption = "font-mono text-label text-muted";

export default function TileFigure({ fig, label }: { fig: TileFig; label: string }) {
  return (
    <span role="img" aria-label={label} data-tile-figure className="flex w-full flex-col gap-2">
      {fig.kind === "bars" && (
        <>
          <span className="flex items-center gap-2">
            <span className={`${caption} w-12`}>before</span>
            <span className="h-2.5 flex-1 rounded-full bg-border" />
            <span className={caption}>{fig.before}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className={`${caption} w-12`}>now</span>
            <span className="h-2.5 w-1.5 rounded-full bg-teal" />
            <span className="flex-1" />
            <span className="font-mono text-label text-teal">{fig.after}</span>
          </span>
        </>
      )}
      {fig.kind === "squares" && (
        <>
          <span className="grid grid-cols-[repeat(auto-fill,6px)] gap-[2px]">
            {Array.from({ length: fig.count }, (_, i) => (
              <span key={i} className="size-1.5 rounded-[1px] bg-teal/45" />
            ))}
          </span>
          <span className={caption}>{fig.caption}</span>
        </>
      )}
      {fig.kind === "dots" && (
        <>
          <span className="grid grid-cols-[repeat(auto-fill,8px)] gap-[3px]">
            {Array.from({ length: fig.count }, (_, i) => (
              <span key={i} className="size-2 rounded-full bg-teal/55" />
            ))}
          </span>
          <span className={caption}>{fig.caption}</span>
        </>
      )}
      {fig.kind === "pick" && (
        <>
          <span className="flex items-center gap-1.5">
            {Array.from({ length: fig.tried }, (_, i) => (
              <span key={i} className={`size-5 rounded-md ${i === fig.tried - 1 ? "bg-teal" : "bg-border"}`} />
            ))}
            <span className="px-0.5 text-teal">→</span>
            {/* a half-filled ring: the share of League's skins */}
            <svg width="22" height="22" viewBox="0 0 22 22" className="text-teal">
              <circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="4" />
              <path d="M11 2 A9 9 0 0 1 11 20" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span>
          <span className={caption}>{fig.caption}</span>
        </>
      )}
    </span>
  );
}
