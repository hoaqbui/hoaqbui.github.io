// One square per unit of work. The grid is the argument: this much, at best, is what the "no" avoided.
export default function WeekGrid({
  count,
  caption,
  label,
}: {
  count: number;
  caption: string;
  label: string;
}) {
  return (
    <div role="img" aria-label={label} className="rounded-2xl bg-well p-5 md:p-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(14px,1fr))] gap-[5px]">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="block aspect-square rounded-[3px] bg-teal/35" />
        ))}
      </div>
      <p className="mt-4 font-mono text-label text-muted">{caption}</p>
    </div>
  );
}
