import type { Bar } from "@/content/stories";
import styles from "./bars.module.css";

export default function Bars({
  bars,
  note,
  label,
}: {
  bars: Bar[];
  note?: string;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="flex flex-col gap-[22px] rounded-2xl bg-well p-6"
    >
      {bars.map((bar, index) => (
        <div
          key={index}
          className="grid grid-cols-[minmax(120px,180px)_1fr] items-center gap-x-5 gap-y-2"
        >
          <div className="font-mono text-xs text-muted">{bar.label}</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 min-w-[6px] rounded-full bg-muted/40 ${styles.bar}`}
                style={{ width: bar.beforeWidth }}
              />
              <span className="whitespace-nowrap font-mono text-xs text-muted">
                {bar.before}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 min-w-[6px] rounded-full bg-teal ${styles.bar}`}
                style={{ width: bar.afterWidth }}
              />
              <span className="whitespace-nowrap font-mono text-xs text-teal">
                {bar.after}
              </span>
            </div>
          </div>
        </div>
      ))}
      {note && <div className="font-mono text-[11px] text-muted">{note}</div>}
    </div>
  );
}
