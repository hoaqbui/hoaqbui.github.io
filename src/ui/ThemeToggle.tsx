"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const current =
        document.documentElement.dataset.theme === "dark" ||
        localStorage.getItem("theme") === "dark"
          ? "dark"
          : "light";
      setTheme(current);
      if (current === "dark") {
        document.documentElement.dataset.theme = "dark";
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      if (nextTheme === "dark") {
        document.documentElement.dataset.theme = "dark";
        localStorage.setItem("theme", "dark");
      } else {
        delete document.documentElement.dataset.theme;
        localStorage.setItem("theme", "light");
      }
    } catch {
      // Ignore storage access errors
    }
  };

  const isDark = theme === "dark";
  const ariaLabel = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted transition-colors hover:text-text cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
    >
      {isDark ? (
        // Moon icon (stroke SVG)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        // Sun icon (stroke SVG)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
