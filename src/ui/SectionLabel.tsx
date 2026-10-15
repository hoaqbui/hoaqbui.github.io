import type { ReactNode } from "react";

// One section marker for the whole site: a short teal rule, then the name in
// spaced uppercase mono. Teal (not muted grey) so it reads as a heading, not metadata.
export default function SectionLabel({
  as: Tag = "p",
  className = "",
  children,
}: {
  as?: "p" | "h1" | "h2";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.16em] text-teal ${className}`}
    >
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-current" />
      {children}
    </Tag>
  );
}
