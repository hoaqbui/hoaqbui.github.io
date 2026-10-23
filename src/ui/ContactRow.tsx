/* eslint-disable @next/next/no-img-element */
import type { PrototypingRow } from "@/content/prototyping";
import DrawOnce from "@/fx/DrawOnce";

export default function ContactRow({ row }: { row: PrototypingRow }) {
  return (
    <div
      data-row={row.id}
      data-row-type={row.type}
      className="border-t border-border pt-8 pb-10"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-heading font-medium text-text">{row.title}</h3>
        <span className="text-label font-mono text-muted">{row.when}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
        {row.frames.map((frame) => {
          const isKept = frame.mark === "kept";
          return (
            <figure
              key={frame.id}
              data-frame={frame.id}
              {...(frame.mark ? { "data-mark": frame.mark } : {})}
              className={`flex flex-col sm:w-[200px] sm:shrink-0 ${
                isKept ? "order-first sm:order-none" : ""
              }`}
            >
              <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
                <img
                  src={frame.src}
                  width={frame.width}
                  height={frame.height}
                  loading="lazy"
                  alt={frame.caption}
                  className="block h-auto w-full object-cover"
                />
                {frame.mark && (
                  <>
                    <DrawOnce mark={frame.mark} />
                    <span
                      className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                        isKept
                          ? "border border-teal/40 bg-surface/90 text-teal"
                          : "border border-border bg-surface/90 text-muted"
                      }`}
                    >
                      {frame.mark}
                    </span>
                  </>
                )}
              </div>
              <figcaption className="mt-2 text-xs font-medium leading-snug text-text sm:text-sm">
                {frame.caption}
              </figcaption>
              {frame.why && (
                <p data-why className="mt-1 text-xs leading-snug text-muted sm:text-sm">
                  {frame.why}
                </p>
              )}
            </figure>
          );
        })}
      </div>

      <p className="mt-4 text-body text-muted">
        <span className="font-semibold text-text">decided:</span> {row.decided}
      </p>
    </div>
  );
}
