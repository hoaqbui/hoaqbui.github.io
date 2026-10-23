/* eslint-disable @next/next/no-img-element */
import type { PrototypingDecision } from "@/content/prototyping";
import DrawOnce from "@/fx/DrawOnce";

export default function Decision({ decision }: { decision: PrototypingDecision }) {
  return (
    <article
      data-decision={decision.id}
      className="border-t border-border pt-8 pb-10"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-heading text-text">{decision.title}</h2>
        <span className="text-label text-muted tabular-nums">{decision.when}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Before column */}
        <div
          className={`grid gap-4 ${
            decision.before.length === 1
              ? "grid-cols-1"
              : "grid-cols-2"
          }`}
        >
          {decision.before.map((frame, idx) => {
            const isSpan = decision.before.length === 3 && idx === 2;
            return (
              <figure
                key={frame.id}
                data-frame={frame.id}
                className={`flex flex-col ${isSpan ? "col-span-2" : "col-span-1"}`}
              >
                <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
                  <img
                    src={frame.src}
                    width={frame.width}
                    height={frame.height}
                    loading="lazy"
                    alt={frame.caption}
                    className="block h-auto w-full object-cover object-top"
                  />
                  {decision.mark.frame === frame.id && (
                    <DrawOnce box={decision.mark} data-annotation />
                  )}
                </div>
                <figcaption className="mt-2 text-label text-text">
                  {frame.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* After column */}
        <div className="flex flex-col">
          {decision.after.map((frame) => (
            <figure
              key={frame.id}
              data-frame={frame.id}
              className="flex flex-col"
            >
              <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
                <img
                  src={frame.src}
                  width={frame.width}
                  height={frame.height}
                  loading="lazy"
                  alt={frame.caption}
                  className="block h-auto w-full object-cover object-top"
                />
                {decision.mark.frame === frame.id && (
                  <DrawOnce box={decision.mark} data-annotation />
                )}
              </div>
              <figcaption className="mt-2 text-label text-text">
                {frame.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <p data-reason className="mt-6 max-w-[640px] text-lead text-text">
        {decision.reason}
      </p>
      <p data-changed className="mt-2 max-w-[640px] text-body text-text">
        <span className="text-label text-muted">What it changed: </span>
        {decision.changed}
      </p>
    </article>
  );
}
