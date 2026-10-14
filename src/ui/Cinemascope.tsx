"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import type { Photo } from "@/content/photos";
import KenBurns from "@/fx/KenBurns";

export interface CinemascopeProps {
  photos: Photo[];
  // false when the carousel sits below the fold (home): frame 1 loads lazily.
  eager?: boolean;
}

const SIZES = "(min-width: 1152px) 1072px, calc(100vw - 48px)";
const srcSet = (p: Photo) => `${p.src.replace(".webp", "-800.webp")} 800w, ${p.src} ${p.width}w`;

// Under the photo, in the page's own colours (it follows the dark fade on home)
function Caption({ photo }: { photo: Photo }) {
  return (
    <div data-photo-caption className="mt-4 text-center">
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-amber-text">{photo.place}</p>
      <h2 className="mt-1 font-serif italic text-[22px] md:text-[24px] text-text">{photo.title}</h2>
    </div>
  );
}

const focus = (p: Photo) => ({ objectPosition: `50% ${p.focusY ?? 50}%` });

export default function Cinemascope({ photos, eager = true }: CinemascopeProps) {
  const n = photos.length;
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
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
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

  // --- Thumbnail strip ----------------------------------------------------------------
  // The strip scrolls under a fixed frame in its middle. While it is dragged or swiped,
  // the photo crossfades with the strip's position: halfway between two thumbnails, half
  // of each. Let go and it eases into the nearest thumbnail, which becomes the photo.
  const scrollPos = useMotionValue(0); // thumbnails from the start, fractional
  const blend = useTransform(scrollPos, (v) => v - Math.floor(v));
  const [scrub, setScrub] = useState<{ a: number; b: number; near: number } | null>(null);
  // the swap at the end of a scrub shows the photo already on screen, so it doesn't fade
  const [instant, setInstant] = useState(false);
  const userScrolling = useRef(false);
  const settleTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  // the strip picked the photo itself, so don't re-centre it
  const fromStrip = useRef(false);
  const centredOnce = useRef(false);

  const pitch = (strip: HTMLDivElement) => {
    const [a, b] = strip.children as unknown as HTMLElement[];
    return a && b ? b.offsetLeft - a.offsetLeft : 1;
  };
  const position = (strip: HTMLDivElement) =>
    Math.min(n - 1, Math.max(0, strip.scrollLeft / pitch(strip)));

  const goTo = useCallback(
    (idx: number) => {
      if (n === 0) return;
      setInstant(false);
      setCurrentIndex((idx + n) % n);
    },
    [n]
  );
  const handlePrev = () => goTo(currentIndex - 1);
  const handleNext = () => goTo(currentIndex + 1);
  const handleTogglePlay = () => setPaused((prev) => !prev);

  // Autoplay, taps and arrow keys move the strip to centre the current thumbnail.
  useEffect(() => {
    if (fromStrip.current) {
      fromStrip.current = false;
      return;
    }
    const strip = stripRef.current;
    if (!strip) return;
    const left = currentIndex * pitch(strip);
    if (Math.abs(strip.scrollLeft - left) < 2) return;
    const smooth = !reducedMotion && centredOnce.current;
    centredOnce.current = true;
    strip.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  }, [currentIndex, reducedMotion]);

  const handleStripScroll = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const pos = position(strip);
    scrollPos.set(pos);
    if (userScrolling.current) {
      const a = Math.floor(pos);
      const b = Math.min(a + 1, n - 1);
      const nearest = Math.round(pos);
      setScrub((prev) =>
        prev && prev.a === a && prev.b === b && prev.near === nearest ? prev : { a, b, near: nearest }
      );
    }
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      if (!userScrolling.current || drag.current) return;
      const nearest = Math.round(position(strip));
      const target = nearest * pitch(strip);
      if (Math.abs(strip.scrollLeft - target) > 1) {
        // ease into the nearest thumbnail; this settles again when it arrives
        strip.scrollTo({ left: target, behavior: reducedMotion ? "auto" : "smooth" });
        return;
      }
      userScrolling.current = false;
      setDragging(false);
      fromStrip.current = true;
      setInstant(true);
      setCurrentIndex(nearest);
      setScrub(null);
    }, 120);
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
        setDragging(true); // snapping off while dragging and easing in
      }
      if (drag.current.moved) strip.scrollLeft = drag.current.left - dx;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const moved = drag.current?.moved;
      // keep the record until the click that follows a drag has been swallowed
      window.setTimeout(() => {
        drag.current = null;
        if (moved) handleStripScroll();
        else userScrolling.current = false;
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
  // A drag holds the slideshow only while it lasts; letting go resumes it (unless the
  // pause button is on), counting a fresh 6 s from the photo it landed on.
  useEffect(() => {
    if (!isPlaying || scrub || n <= 1) return;
    const timer = setInterval(() => {
      setInstant(false);
      setCurrentIndex((prev) => (prev + 1) % n);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, scrub, n, currentIndex]);

  // Preload the next image
  const nextPhoto = photos[(currentIndex + 1) % n];
  useEffect(() => {
    if (typeof window === "undefined" || !nextPhoto || !onScreen) return;
    const img = new window.Image();
    img.sizes = SIZES;
    img.srcset = srcSet(nextPhoto);
    img.src = nextPhoto.src;
  }, [nextPhoto, onScreen]);

  if (n === 0) return null;

  const currentPhoto = photos[currentIndex];
  const fade = effectiveMotion && !instant;
  const highlighted = scrub ? scrub.near : currentIndex;

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
            initial={fade ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={fade ? { opacity: 0 } : undefined}
            transition={{ duration: fade ? 0.8 : 0, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <KenBurns motionOn={isPlaying && !scrub}>
              {near && (
                <img
                  src={currentPhoto.src}
                  srcSet={srcSet(currentPhoto)}
                  sizes={SIZES}
                  alt={currentPhoto.alt}
                  width={currentPhoto.width}
                  height={currentPhoto.height}
                  fetchPriority={eager && currentIndex === 0 ? "high" : "auto"}
                  loading={eager && currentIndex === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                  style={focus(currentPhoto)}
                />
              )}
            </KenBurns>
          </motion.div>
        </AnimatePresence>

        {/* While scrubbing: the two photos either side of the strip's middle, blended */}
        {scrub && (
          <>
            <div className="absolute inset-0 z-[5]" data-scrub>
              <img src={photos[scrub.a].src} srcSet={srcSet(photos[scrub.a])} sizes={SIZES} alt="" className="absolute inset-0 w-full h-full object-cover" style={focus(photos[scrub.a])} />
              {scrub.b !== scrub.a && (
                <motion.img
                  src={photos[scrub.b].src}
                  srcSet={srcSet(photos[scrub.b])}
                  sizes={SIZES}
                  alt=""
                  style={{ opacity: blend, ...focus(photos[scrub.b]) }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          </>
        )}

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
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
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
        {isPlaying && !scrub && (
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
            className="h-full bg-[#f2b544]"
          />
        )}
      </div>

      <Caption photo={scrub ? photos[scrub.near] : currentPhoto} />

      {/* Thumbnail strip under a fixed frame; the padding lets the first and last thumbnails
          reach the middle */}
      <div className="relative mt-6 [--tw:6rem] sm:[--tw:7rem]">
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
          className={`flex gap-3 items-center overflow-x-auto py-3 px-[calc(50%-var(--tw)/2)] select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            dragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
          }`}
        >
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => {
                // a tap selects without pausing; only a drag pauses
                userScrolling.current = false;
                goTo(i);
              }}
              aria-label={`Show ${photo.title}`}
              aria-current={i === currentIndex ? "true" : undefined}
              title={photo.title}
              className={`relative h-14 w-[var(--tw)] shrink-0 snap-center rounded-md overflow-hidden transition-opacity duration-200 ${
                i === highlighted ? "opacity-100" : "opacity-45 hover:opacity-80"
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
          ))}
        </div>
        {/* the floating frame: it stays put while the thumbnails slide under it */}
        <div
          aria-hidden="true"
          data-strip-frame
          className="pointer-events-none absolute left-1/2 top-1/2 h-[3.75rem] w-[calc(var(--tw)+0.25rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg ring-2 ring-teal ring-offset-2 ring-offset-bg"
        />
      </div>
    </div>
  );
}
