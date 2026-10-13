"use client";

import { useEffect, useState } from "react";

export default function PillNav({
  items,
}: {
  items: { id: string; label: string; href: string }[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const hashItems = items.filter((item) => item.href.startsWith("#"));
    const elements = hashItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-45% 0px -50% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    if (!href.startsWith("#")) return;

    e.preventDefault();
    const target = document.getElementById(id);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    window.history.replaceState(null, "", href);
    setActiveId(id);
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed z-50 left-1/2 -translate-x-1/2 max-md:bottom-[calc(16px+env(safe-area-inset-bottom))] md:top-4"
    >
      <div
        className="flex items-center rounded-full border border-border bg-surface/85 backdrop-blur p-1"
        style={{
          boxShadow:
            "0 1px 2px rgba(20,24,26,.06), 0 12px 32px rgba(20,24,26,.12)",
        }}
      >
        {items.map((item, index) => {
          const isHash = item.href.startsWith("#");
          const isActive = isHash && activeId === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleClick(e, item.href, item.id)}
              aria-current={isActive ? "true" : undefined}
              className={`inline-flex min-h-[44px] items-center px-3.5 text-sm transition-colors duration-300 ease-in-out motion-reduce:transition-none ${
                index === 0 ? "font-semibold" : ""
              } ${
                isActive
                  ? "rounded-full bg-text text-surface"
                  : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
