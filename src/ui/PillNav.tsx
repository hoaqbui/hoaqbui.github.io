"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import ThemeToggle from "@/ui/ThemeToggle";

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
  // trailingSlash: true serves "/photos/"; compare without the slash.
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  const isHome = pathname === "/";
  const onPhotosPage = pathname === "/photos";

  const [activeId, setActiveId] = useState<string>("");
  // Dark pill over the photo band (home) or on the /photos page.
  const isPhotos = onPhotosPage || (isHome && activeId === "photos");
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
    if (!isHome) {
      return;
    }

    const hashItems = items.filter(
      (item) => item.href.startsWith("#") || item.href.startsWith("/#")
    );
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
  }, [items, isHome]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    const isHash = href.startsWith("#") || href.startsWith("/#");
    if (!isHome || !isHash) return;

    e.preventDefault();
    const target = document.getElementById(id);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (target) {
      // let sections and the page fade know this is a jump, not a read-through
      window.dispatchEvent(new CustomEvent("nav-jump", { detail: id }));
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    // No history.replaceState for the hash: Next.js treats it as a navigation, which ran
    // the page-transition crossfade over the smooth scroll (doubled text, blank frames).
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
    <>
      {/* Mobile-only standalone ThemeToggle: top-right fixed button */}
      <div
        className="fixed z-50 md:hidden right-3 top-[calc(12px+env(safe-area-inset-top))] flex items-center justify-center rounded-full border border-border bg-surface shadow-sm"
      >
        <ThemeToggle />
      </div>

      <nav
        aria-label="Sections"
        className="fixed z-50 left-1/2 -translate-x-1/2 max-md:bottom-[calc(16px+env(safe-area-inset-bottom))] md:top-4"
      >
        <motion.div
          className={`flex items-center rounded-full p-1 transition-colors duration-300 ${
            isPhotos
              ? "bg-photo border border-[rgba(255,255,255,0.08)]"
              : "border border-border bg-surface"
          }`}
          animate={pillAnimate}
          transition={pillTransition}
        >
          {items.map((item, index) => {
            const isHash = item.href.startsWith("#") || item.href.startsWith("/#");
            const isActive = isHome
              ? isHash && activeId === item.id
              : item.href === pathname || (onPhotosPage && item.id === "photos");

            const isResume = item.id === "resume";

            let textColor = "";
            if (isPhotos) {
              textColor = isActive
                ? "text-[#0d0f10]"
                : "text-[#c9d0d3] hover:text-white";
            } else {
              textColor = isActive
                ? "text-surface"
                : "text-muted hover:text-text";
            }

            const isExternal = item.href.startsWith("http") || item.href.endsWith(".pdf");
            const LinkComponent = isExternal ? "a" : Link;

            return (
              <LinkComponent
                key={item.id}
                href={item.href}
                {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                onClick={(e) => handleClick(e, item.href, item.id)}
                aria-current={isActive ? (isHome ? "true" : "page") : undefined}
                className={`relative ${
                  isResume ? "hidden md:inline-flex" : "inline-flex"
                } min-h-[44px] items-center px-2.5 md:px-3.5 text-[13px] md:text-sm transition-colors duration-300 ease-in-out motion-reduce:transition-none ${
                  index === 0 ? "font-semibold" : ""
                } ${textColor}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill-active-highlight"
                    className={`absolute inset-0 rounded-full ${
                      isPhotos ? "bg-[#3cc9b4]" : "bg-text"
                    }`}
                    transition={highlightTransition}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </LinkComponent>
            );
          })}
          <div
            aria-hidden="true"
            className={`hidden md:block mx-1 h-4 w-[1px] shrink-0 ${
              isPhotos ? "bg-[rgba(255,255,255,0.15)]" : "bg-border"
            }`}
          />
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </motion.div>
      </nav>
    </>
  );
}
