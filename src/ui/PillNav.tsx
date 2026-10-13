"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 500,
  damping: 38,
};

const BASE_SHADOW =
  "0 1px 2px rgba(20,24,26,.06), 0 12px 32px rgba(20,24,26,.12)";
const SCROLLED_SHADOW =
  "0 2px 6px rgba(20,24,26,.08), 0 24px 56px rgba(20,24,26,.18)";

export default function PillNav({
  items,
}: {
  items: { id: string; label: string; href: string }[];
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setIsDesktop(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    media.addEventListener("change", handleMediaChange);
    return () => media.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const highlightTransition = shouldReduceMotion
    ? { duration: 0 }
    : SPRING_TRANSITION;

  const pillAnimate = {
    y: shouldReduceMotion ? 0 : isScrolled ? (isDesktop ? -2 : 0) : 0,
    scale: shouldReduceMotion ? 1 : isScrolled ? 1.02 : 1,
    boxShadow: isScrolled ? SCROLLED_SHADOW : BASE_SHADOW,
  };

  const pillTransition = shouldReduceMotion
    ? { duration: 0 }
    : SPRING_TRANSITION;

  return (
    <nav
      aria-label="Sections"
      className="fixed z-50 left-1/2 -translate-x-1/2 max-md:bottom-[calc(16px+env(safe-area-inset-bottom))] md:top-4"
    >
      <motion.div
        className="flex items-center rounded-full border border-border bg-surface/85 backdrop-blur p-1"
        animate={pillAnimate}
        transition={pillTransition}
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
              className={`relative inline-flex min-h-[44px] items-center px-3.5 text-sm transition-colors duration-300 ease-in-out motion-reduce:transition-none ${
                index === 0 ? "font-semibold" : ""
              } ${isActive ? "text-surface" : "text-muted hover:text-text"}`}
            >
              {isActive && (
                <motion.span
                  layoutId="pill-active-highlight"
                  className="absolute inset-0 rounded-full bg-text"
                  transition={highlightTransition}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          );
        })}
      </motion.div>
    </nav>
  );
}
