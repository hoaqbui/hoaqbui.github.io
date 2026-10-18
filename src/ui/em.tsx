import { Fragment, type ReactNode } from "react";

// Emphasis in copy: the part of a line between ** and ** is set in teal.
// "went from **3 months to under an hour**." → the span after "from" is highlighted.
export function em(text: string): ReactNode {
  const parts = text.split("**");
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-teal">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
