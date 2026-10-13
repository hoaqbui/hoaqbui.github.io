export default function ReachChips({
  from,
  to,
  label,
}: {
  from: string[];
  to: string[];
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl bg-well p-6"
    >
      <div className="flex flex-col gap-2">
        {from.map((item, index) => (
          <span
            key={index}
            className="rounded-xl bg-surface px-3.5 py-2 text-sm"
          >
            {item}
          </span>
        ))}
      </div>
      <span aria-hidden="true" className="text-xl text-teal">
        →
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {to.map((item, index) => (
          <span
            key={index}
            className="rounded-full bg-teal/10 px-3.5 py-2 font-mono text-[13px] text-teal"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
