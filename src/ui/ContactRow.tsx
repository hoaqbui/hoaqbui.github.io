/* eslint-disable @next/next/no-img-element */
import type { PrototypingRow } from "@/content/prototyping";

export default function ContactRow({ row }: { row: PrototypingRow }) {
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
        {row.frames.map((frame) => (
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
                className="block h-auto w-full object-cover object-top max-h-[220px]"
              />
            </div>
            <figcaption className="mt-2 text-label text-text">
              {frame.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
