"use client";

import { useOnce } from "@/fx/useOnce";

interface DrawOnceProps {
  mark: "kept" | "cut";
  className?: string;
}

export default function DrawOnce({ mark, className = "" }: DrawOnceProps) {
  const { ref, phase } = useOnce<SVGSVGElement>(0.2);

  const isKept = mark === "kept";
  const pathLength = isKept ? 300 : 150;
  const isArmed = phase === "armed";
  const isPlaying = phase === "play";

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    >
      {isKept ? (
        <path
          d="M 14,50 C 13,24 32,10 54,9 C 78,8 90,24 88,48 C 86,74 72,90 48,91 C 24,92 10,74 12,48 C 13,40 16,33 22,26"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="text-teal"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isArmed ? pathLength : 0,
            transition: isPlaying ? "stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          }}
        />
      ) : (
        <path
          d="M 14,16 C 38,38 62,62 86,84"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="text-muted/80"
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: isArmed ? pathLength : 0,
            transition: isPlaying ? "stroke-dashoffset 500ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          }}
        />
      )}
    </svg>
  );
}
