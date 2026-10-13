"use client";

import { useEffect, useRef, useState } from "react";

export function useMotion<T extends Element>(): {
  ref: React.RefObject<T | null>;
  allowed: boolean;
  paused: boolean;
  running: boolean;
  toggle: () => void;
} {
  const ref = useRef<T | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAllowed(!mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setAllowed(!event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  const toggle = () => {
    setPaused((prev) => !prev);
  };

  const running = allowed && !paused && onScreen;

  return {
    ref,
    allowed,
    paused,
    running,
    toggle,
  };
}
