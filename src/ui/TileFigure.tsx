"use client";

import { useOnce } from "@/fx/useOnce";

// The small picture on an Impact tile, in place of a line of text (card 89). Each draws itself
// once when the tile scrolls in (card 99): the "now" bar shrinks from three months to an hour,
// the squares and dots fill in, the trial narrows to one studio and its share.
// bars: a before/after pair · squares: one square per unit · dots: one dot per person ·
// pick: trial entrants, the one chosen, and the share it went on to make.
export type TileFig =
  | { kind: "bars"; before: string; after: string }
  | { kind: "squares"; count: number; caption: string }
  | { kind: "dots"; count: number; caption: string }
  | { kind: "pick"; tried: number; caption: string };

const caption = "text-label text-muted";
const ease = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export default function TileFigure({ fig, label }: { fig: TileFig; label: string }) {
  const { ref, phase } = useOnce<HTMLSpanElement>(0.5);
  const armed = phase === "armed";

  return (
    <span ref={ref} role="img" aria-label={label} data-tile-figure className="flex w-full flex-col gap-2">
      {fig.kind === "bars" && (
        <>
          <span className="flex items-center gap-2">
            <span className={`${caption} w-12`}>before</span>
            <span className="h-2.5 flex-1 rounded-full bg-border" />
            <span className={caption}>{fig.before}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className={`${caption} w-12`}>now</span>
            {/* starts as long as "before", then collapses to a sliver */}
            <span className="relative h-2.5 flex-1">
              <span
                className={`absolute inset-y-0 left-0 rounded-full bg-teal transition-[width] delay-300 duration-[1400ms] ${ease}`}
                style={{ width: armed ? "100%" : "6px" }}
              />
            </span>
            <span className="text-label text-teal">{fig.after}</span>
          </span>
        </>
      )}
      {fig.kind === "squares" && (
        <>
          <span className="grid grid-cols-[repeat(auto-fill,6px)] gap-[2px]">
            {Array.from({ length: fig.count }, (_, i) => (
              <span
                key={i}
                className="size-1.5 rounded-[1px] bg-teal/45 transition-opacity duration-300"
                style={{ opacity: armed ? 0 : 1, transitionDelay: `${i * 6}ms` }}
              />
            ))}
          </span>
          <span className={caption}>{fig.caption}</span>
        </>
      )}
      {fig.kind === "dots" && (
        <>
          <span className="grid grid-cols-[repeat(auto-fill,8px)] gap-[3px]">
            {Array.from({ length: fig.count }, (_, i) => (
              <span
                key={i}
                className={`size-2 rounded-full bg-teal/55 transition-[opacity,transform] duration-300 ${ease}`}
                style={{ opacity: armed ? 0 : 1, transform: armed ? "scale(0.2)" : "none", transitionDelay: `${i * 18}ms` }}
              />
            ))}
          </span>
          <span className={caption}>{fig.caption}</span>
        </>
      )}
      {fig.kind === "pick" && (
        <>
          <span className="flex items-center gap-1.5">
            {Array.from({ length: fig.tried }, (_, i) => {
              const chosen = i === fig.tried - 1;
              return (
                <span
                  key={i}
                  className={`size-5 rounded-md transition-[opacity,transform] duration-500 ${ease} ${chosen ? "bg-teal" : "bg-border"}`}
                  style={{
                    opacity: armed ? 0 : 1,
                    transform: armed ? "scale(0.6)" : chosen ? "scale(1.12)" : "none",
                    transitionDelay: `${chosen ? 650 : i * 90}ms`,
                  }}
                />
              );
            })}
            <span
              className="px-0.5 text-teal transition-opacity duration-300"
              style={{ opacity: armed ? 0 : 1, transitionDelay: "900ms" }}
            >
              →
            </span>
            {/* a half-filled ring: the share of League's skins; the half draws itself */}
            <svg width="22" height="22" viewBox="0 0 22 22" className="text-teal">
              <circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="4" />
              <path
                d="M11 2 A9 9 0 0 1 11 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="28.3"
                className={`transition-[stroke-dashoffset] delay-1000 duration-700 ${ease}`}
                style={{ strokeDashoffset: armed ? 28.3 : 0 }}
              />
            </svg>
          </span>
          <span className={caption}>{fig.caption}</span>
        </>
      )}
    </span>
  );
}
