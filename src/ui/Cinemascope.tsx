"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Photo } from "@/content/photos";
import KenBurns from "@/fx/KenBurns";

export interface CinemascopeProps {
  photos: Photo[];
  // false when the carousel sits below the fold (home): frame 1 loads lazily.
  eager?: boolean;
}

export default function Cinemascope({ photos, eager = true }: CinemascopeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(eager);
  // Below the fold, the photo isn't requested until the frame is near (lazy loading alone
  // still fetches it at page load on slow connections).
  const [near, setNear] = useState(eager);

  const frameRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Crossfades follow the reduced-motion setting; slides and the slow push also stop when
  // paused and while the frame is off screen.
  const effectiveMotion = !reducedMotion;
  const isPlaying = effectiveMotion && !paused && onScreen;

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting)
    );
    observer.observe(el);
    const nearObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: "800px 0px" }
    );
    nearObserver.observe(el);
    return () => {
      observer.disconnect();
      nearObserver.disconnect();
    };
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      const n = photos.length;
      if (n === 0) return;
      setCurrentIndex((idx + n) % n);
    },
    [photos.length]
  );

  const handlePrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const handleNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const handleTogglePlay = () => setPaused((prev) => !prev);

  // Thumbnail strip: drag or swipe it; when it comes to rest, the thumbnail nearest the
  // middle becomes the photo shown (and the slideshow pauses). Autoplay, taps and arrow
  // keys move the strip to centre the current thumbnail.
  const userScrolling = useRef(false);
  const settleTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const centredOnce = useRef(false);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[currentIndex] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    if (Math.abs(strip.scrollLeft - left) < 2) return;
    const instant = reducedMotion || !centredOnce.current;
    centredOnce.current = true;
    strip.scrollTo({ left, behavior: instant ? "auto" : "smooth" });
  }, [currentIndex, reducedMotion]);

  const handleStripScroll = () => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const strip = stripRef.current;
      if (!strip || !userScrolling.current || drag.current) return;
      userScrolling.current = false;
      const middle = strip.scrollLeft + strip.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      Array.from(strip.children).forEach((el, i) => {
        const t = el as HTMLElement;
        const d = Math.abs(t.offsetLeft + t.clientWidth / 2 - middle);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setCurrentIndex(nearest);
      setPaused(true);
    }, 140);
  };

  const handleStripPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    userScrolling.current = true;
    const strip = stripRef.current;
    if (e.pointerType !== "mouse" || !strip) return; // touch and pen scroll natively
    drag.current = { x: e.clientX, left: strip.scrollLeft, moved: false };
    const move = (ev: PointerEvent) => {
      if (!drag.current) return;
      const dx = ev.clientX - drag.current.x;
      if (Math.abs(dx) > 4 && !drag.current.moved) {
        drag.current.moved = true;
        setDragging(true);
      }
      if (drag.current.moved) strip.scrollLeft = drag.current.left - dx;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const moved = drag.current?.moved;
      setDragging(false);
      // keep the record until the click that follows a drag has been swallowed
      window.setTimeout(() => {
        drag.current = null;
        if (moved) handleStripScroll();
      }, 0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // Keyboard navigation on focused frame region only (no global listener)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Autoplay advances every 6s while playing
  useEffect(() => {
    if (!isPlaying || photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length, currentIndex]);

  // Preload the next image
  const nextIndex = (currentIndex + 1) % photos.length;
  const nextPhoto = photos[nextIndex];

  useEffect(() => {
    if (typeof window === "undefined" || !nextPhoto || !onScreen) return;
    const img = new window.Image();
    img.sizes = "(min-width: 1152px) 1072px, calc(100vw - 48px)";
    img.srcset = `${nextPhoto.src.replace(".webp", "-800.webp")} 800w, ${nextPhoto.src} ${nextPhoto.width}w`;
    img.src = nextPhoto.src;
  }, [nextPhoto, onScreen]);

  if (!photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="w-full">
      {/* 2.39:1 Letterbox Frame */}
      <div
        ref={frameRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Photo carousel"
        onKeyDown={handleKeyDown}
        className="relative aspect-[2.39/1] w-full overflow-hidden bg-black shadow-[0_50px_120px_rgba(0,0,0,0.6)] outline-none focus-visible:ring-2 focus-visible:ring-teal"
        style={{ aspectRatio: "2.39 / 1" }}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentPhoto.id}
            initial={effectiveMotion ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={effectiveMotion ? { opacity: 0 } : undefined}
            transition={{
              duration: effectiveMotion ? 0.8 : 0,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <KenBurns motionOn={effectiveMotion && onScreen}>
              {near && <img
                src={currentPhoto.src}
                srcSet={`${currentPhoto.src.replace(".webp", "-800.webp")} 800w, ${currentPhoto.src} ${currentPhoto.width}w`}
                sizes="(min-width: 1152px) 1072px, calc(100vw - 48px)"
                alt={currentPhoto.alt}
                width={currentPhoto.width}
                height={currentPhoto.height}
                fetchPriority={eager && currentIndex === 0 ? "high" : "auto"}
                loading={eager && currentIndex === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />}
            </KenBurns>

            {/* Subtitle-style caption centered low in the frame */}
            <div className="pointer-events-none absolute bottom-5 md:bottom-8 left-0 right-0 z-20 px-6 text-center">
              <p
                className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#f2b544]"
                style={{
                  textShadow:
                    "0 2px 8px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)",
                }}
              >
                {currentPhoto.place}
              </p>
              <h2
                className="mt-1 font-serif italic text-[22px] md:text-[24px] text-[#f3f1ec]"
                style={{
                  textShadow:
                    "0 2px 8px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.95)",
                }}
              >
                {currentPhoto.title}
              </h2>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Soft radial vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))]"
        />

        {/* The one control: pause (WCAG 2.2.2 — the slideshow moves for longer than 5 s) */}
        {!reducedMotion && (
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying || (!paused && !onScreen) ? "Pause slideshow" : "Play slideshow"}
            aria-pressed={paused}
            title={paused ? "Play slideshow" : "Pause slideshow"}
            className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-[#f3f1ec] backdrop-blur-sm transition-colors hover:bg-black/65 cursor-pointer"
          >
            {paused ? (
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Progress hairline indicator */}
      <div className="h-[2px] w-full bg-border overflow-hidden">
        {isPlaying && (
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full bg-[#f2b544]"
          />
        )}
      </div>

      {/* Draggable thumbnail strip; padding lets the first and last thumbnails reach the middle */}
      <div
        ref={stripRef}
        onScroll={handleStripScroll}
        onPointerDown={handleStripPointerDown}
        onWheel={() => (userScrolling.current = true)}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`relative mt-6 flex gap-3 items-center overflow-x-auto py-3 [--tw:6rem] sm:[--tw:7rem] px-[calc(50%-var(--tw)/2)] select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
        }`}
      >
        {photos.map((photo, i) => {
          const isCurrent = i === currentIndex;
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                // a tap selects without pausing; only a drag pauses
                userScrolling.current = false;
                goTo(i);
              }}
              aria-label={`Show ${photo.title}`}
              aria-current={isCurrent ? "true" : undefined}
              title={photo.title}
              className={`relative h-14 w-[var(--tw)] shrink-0 snap-center rounded-md overflow-hidden transition-[opacity,transform] duration-300 ${
                isCurrent
                  ? "ring-2 ring-teal ring-offset-2 ring-offset-bg opacity-100 scale-105"
                  : "opacity-45 hover:opacity-80 scale-100"
              }`}
            >
              <img
                src={photo.thumb}
                alt=""
                width={photo.width}
                height={photo.height}
                loading="lazy"
                draggable={false}
                className="pointer-events-none w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
