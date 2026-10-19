"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ThemeToggle from "@/ui/ThemeToggle";
import { LinkedInIcon, MailIcon, ResumeIcon } from "@/ui/Icons";

const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 500,
  damping: 38,
};

const BASE_SHADOW =
  "0 1px 2px rgba(20,24,26,.06), 0 12px 32px rgba(20,24,26,.12)";
const SCROLLED_SHADOW =
  "0 2px 6px rgba(20,24,26,.08), 0 24px 56px rgba(20,24,26,.18)";

type ContactInfo = { availability: string; email: string; resumePath: string; linkedin: string };

export default function PillNav({
  items,
  contact,
}: {
  items: { id: string; label: string; href: string }[];
  // with it, the Contact item opens a sheet: availability, email, résumé, LinkedIn (user, 2026-10-19)
  contact?: ContactInfo;
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
  // While a tap scrolls the page, the sections it passes must not take the highlight
  // (user bug report, 2026-10-19: About → Now flashed Impact and How I work on the way).
  const jumpingRef = useRef<(() => void) | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  // the sheet closes on Escape or a tap outside the nav
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [sheetOpen]);

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
        if (jumpingRef.current) return;
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

  // Hold the highlight until the page has moved and then stopped (150 ms still, capped at 3 s),
  // or the visitor scrolls by hand. A smooth scroll can take ~300 ms to start, so stillness
  // before the first movement doesn't count.
  const holdHighlight = () => {
    jumpingRef.current?.();
    let lastY = window.scrollY;
    let moved = false;
    let still = 0;
    const timer = window.setInterval(() => {
      if (window.scrollY !== lastY) moved = true;
      still = window.scrollY === lastY ? still + 1 : 0;
      lastY = window.scrollY;
      if (moved && still >= 3) release();
    }, 50);
    const cap = window.setTimeout(() => release(), 3000);
    const userInput = ["wheel", "touchstart", "keydown"];
    function release() {
      window.clearInterval(timer);
      window.clearTimeout(cap);
      userInput.forEach((t) => window.removeEventListener(t, release));
      jumpingRef.current = null;
    }
    userInput.forEach((t) => window.addEventListener(t, release, { passive: true, once: true }));
    jumpingRef.current = release;
  };

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
      holdHighlight();
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
        ref={navRef}
        aria-label="Sections"
        className="fixed z-50 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-16px)] max-md:bottom-[calc(16px+env(safe-area-inset-bottom))] md:top-4"
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
            const itemClass = `relative ${
              isResume ? "hidden md:inline-flex" : "inline-flex"
            } min-h-[44px] items-center whitespace-nowrap px-1.5 min-[360px]:px-2 md:px-3.5 text-[13px] md:text-sm transition-colors duration-300 ease-in-out motion-reduce:transition-none ${
              index === 0 ? "font-semibold" : ""
            } ${textColor}`;
            const highlight = isActive && (
              <motion.span
                layoutId="pill-active-highlight"
                className={`absolute inset-0 rounded-full ${isPhotos ? "bg-[#3cc9b4]" : "bg-text"}`}
                transition={highlightTransition}
              />
            );

            if (item.id === "contact" && contact) {
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={sheetOpen}
                  aria-controls="contact-sheet"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setSheetOpen((open) => !open)}
                  className={`${itemClass} cursor-pointer`}
                >
                  {highlight}
                  <span className={`relative z-10 ${sheetOpen && !isActive ? "underline decoration-2 underline-offset-4" : ""}`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <LinkComponent
                key={item.id}
                href={item.href}
                {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                onClick={(e) => handleClick(e, item.href, item.id)}
                aria-current={isActive ? (isHome ? "true" : "page") : undefined}
                className={itemClass}
              >
                {highlight}
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

        <AnimatePresence>
          {contact && sheetOpen && (
            <motion.div
              id="contact-sheet"
              role="dialog"
              aria-label="Contact"
              initial={shouldReduceMotion ? false : { opacity: 0, y: isDesktop ? -8 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: isDesktop ? -8 : 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-1/2 w-[min(360px,calc(100vw-24px))] -translate-x-1/2 rounded-3xl border border-border bg-surface p-5 text-text shadow-[0_2px_6px_rgba(20,24,26,.08),0_24px_56px_rgba(20,24,26,.18)] max-md:bottom-full max-md:mb-3 md:top-full md:mt-3"
            >
              <p className="flex items-center gap-2 text-label text-muted">
                <span aria-hidden="true" className="relative flex size-2.5 shrink-0">
                  <span className="absolute inline-flex size-full rounded-full bg-teal opacity-60 motion-safe:animate-ping" />
                  <span className="relative size-2.5 rounded-full bg-teal" />
                </span>
                {contact.availability}
              </p>
              {/* three big targets, one word each (user, 2026-10-19: visual, few words) */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: "Email", href: `mailto:${contact.email}`, icon: <MailIcon size={26} />, tone: "bg-teal text-surface" },
                  { label: "Résumé", href: contact.resumePath, icon: <ResumeIcon size={26} />, tone: "bg-amber text-[#1f2326]", external: true },
                  { label: "LinkedIn", href: contact.linkedin, icon: <LinkedInIcon size={26} />, tone: "bg-[#0a66c2] text-white", external: true },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    {...(action.external ? { target: "_blank", rel: "noopener" } : {})}
                    className="group flex flex-col items-center gap-1.5 rounded-2xl py-1"
                  >
                    <span
                      className={`flex size-16 items-center justify-center rounded-full shadow-md transition-transform motion-safe:group-hover:scale-105 ${action.tone}`}
                    >
                      {action.icon}
                    </span>
                    <span className="text-label font-medium text-text">{action.label}</span>
                  </a>
                ))}
              </div>
              <Link
                href="/#contact"
                onClick={(e) => {
                  setSheetOpen(false);
                  handleClick(e, "/#contact", "contact");
                }}
                className="mt-3 flex min-h-[44px] items-center justify-center text-label text-muted hover:text-text"
              >
                Save contact · Projects ↓
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
