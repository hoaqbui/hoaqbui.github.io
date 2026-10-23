/* eslint-disable @next/next/no-img-element */
import type { PrototypingRow } from "@/content/prototyping";
import DrawOnce from "@/fx/DrawOnce";

export default function ContactRow({ row }: { row: PrototypingRow }) {
  const frames = [...row.frames].sort((a, b) =>
    a.mark === "kept" ? -1 : b.mark === "kept" ? 1 : 0
  );

  return (
    <div
      data-row={row.id}
      data-row-type={row.type}
      className="border-t border-border pt-8 pb-10"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-heading text-text">{row.title}</h3>
        <span className="text-label text-muted tabular-nums">{row.when}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {frames.map((frame) => {
          const isKept = frame.mark === "kept";
          const isHero = frame.id === "live-m5";
          const isWide = isKept || isHero;

          return (
            <figure
              key={frame.id}
              data-frame={frame.id}
              {...(frame.mark ? { "data-mark": frame.mark } : {})}
              className={`flex flex-col ${
                isWide ? "col-span-2 md:col-span-2" : "col-span-1 md:col-span-1"
              } ${isHero ? "order-first md:order-none" : ""}`}
            >
              <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
                <img
                  src={frame.src}
                  width={frame.width}
                  height={frame.height}
                  loading="lazy"
                  alt={frame.caption}
                  // tall panel crops show their top, so a portrait frame never outweighs its row
                  className={`block h-auto w-full object-cover object-top ${isWide ? "max-h-[440px]" : "max-h-[300px]"}`}
                />
                {frame.mark && (
                  <>
                    <DrawOnce mark={frame.mark} />
                    <span className="sr-only">{frame.mark}</span>
                  </>
                )}
              </div>
              <figcaption className="mt-2 text-label text-text">
                {frame.caption}
              </figcaption>
              {frame.why && (
                <p data-why className="mt-1 text-label text-muted">
                  {frame.why}
                </p>
              )}
            </figure>
          );
        })}
      </div>

      <p className="mt-4 text-body text-text">
        {row.decided}
      </p>
    </div>
  );
}
