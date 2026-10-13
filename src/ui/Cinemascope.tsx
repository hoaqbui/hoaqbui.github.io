"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Photo } from "@/content/photos";
import KenBurns from "@/fx/KenBurns";

export interface CinemascopeProps {
  photos: Photo[];
}

export default function Cinemascope({ photos }: CinemascopeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const [thumbsOn, setThumbsOn] = useState(true);

  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // If user prefers reduced motion or motion toggle is off, effective motion is false
  const effectiveMotion = motionOn && !reducedMotion;
  const isPlaying = effectiveMotion && !paused;

  // On client mount with prefers-reduced-motion, default to paused
  useEffect(() => {
    if (reducedMotion) {
      setPaused(true);
    }
  }, [reducedMotion]);

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

  const handleTogglePlay = () => {
    if (!motionOn) {
      // If motion was off and user plays, enable motion and unpause
      setMotionOn(true);
      setPaused(false);
    } else {
      setPaused((prev) => !prev);
    }
  };

  const toggleMotion = () => {
    setMotionOn((prev) => {
      const next = !prev;
      if (!next) {
        setPaused(true);
      }
      return next;
    });
  };

  const toggleThumbs = () => {
    setThumbsOn((prev) => !prev);
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
    if (typeof window === "undefined" || !nextPhoto) return;
    const img = new window.Image();
    img.sizes = "(min-width: 1152px) 1072px, calc(100vw - 48px)";
    img.srcset = `${nextPhoto.src.replace(".webp", "-800.webp")} 800w, ${nextPhoto.src} ${nextPhoto.width}w`;
    img.src = nextPhoto.src;
  }, [nextPhoto]);

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
            <KenBurns motionOn={effectiveMotion}>
              <img
                src={currentPhoto.src}
                srcSet={`${currentPhoto.src.replace(".webp", "-800.webp")} 800w, ${currentPhoto.src} ${currentPhoto.width}w`}
                sizes="(min-width: 1152px) 1072px, calc(100vw - 48px)"
                alt={currentPhoto.alt}
                width={currentPhoto.width}
                height={currentPhoto.height}
                fetchPriority={currentIndex === 0 ? "high" : "auto"}
                loading={currentIndex === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />
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
      </div>

      {/* Progress hairline indicator */}
      <div className="h-[2px] w-full bg-[#22272a] overflow-hidden">
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

      {/* Thumbnails strip or 0...N line indicator */}
      {thumbsOn ? (
        <div className="relative mt-6 overflow-hidden">
          <div className="flex gap-3 justify-center items-center overflow-x-auto py-2 px-1">
            {photos.map((photo, i) => {
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${photo.title}`}
                  aria-current={isCurrent ? "true" : undefined}
                  title={photo.title}
                  className={`relative h-14 w-24 sm:w-28 shrink-0 rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                    isCurrent
                      ? "ring-2 ring-[#3cc9b4] ring-offset-2 ring-offset-photo opacity-100 scale-105"
                      : "opacity-45 hover:opacity-80 scale-100"
                  }`}
                >
                  <img
                    src={photo.thumb}
                    alt=""
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-center gap-3 font-mono text-xs text-[#9aa4a8]">
          <span>0</span>
          <div className="flex items-center gap-1.5">
            {photos.map((photo, i) => {
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show ${photo.title}`}
                  aria-current={isCurrent ? "true" : undefined}
                  title={photo.title}
                  className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    isCurrent
                      ? "w-7 bg-[#3cc9b4]"
                      : "w-1.5 bg-[#3a4146] hover:bg-[#596064]"
                  }`}
                />
              );
            })}
          </div>
          <span>{photos.length}</span>
        </div>
      )}

      {/* Centered Controls and Quiet Toggles */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
        {/* Left: counter */}
        <div className="hidden sm:flex items-center font-mono text-xs text-[#9aa4a8]">
          <span>
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </span>
        </div>

        {/* Center: Previous · Play/Pause · Next */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            title="Previous photo"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#ecefee] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            aria-pressed={!isPlaying}
            title={isPlaying ? "Pause slideshow" : "Play slideshow"}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#3a4146] text-[#ecefee] hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            title="Next photo"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#ecefee] hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Right: quiet toggles */}
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <button
            type="button"
            aria-pressed={motionOn}
            onClick={toggleMotion}
            className="inline-flex min-h-[44px] items-center rounded-full border border-[#2a3034] px-3 font-mono text-[11px] text-[#9aa4a8] hover:text-[#ecefee] transition-colors cursor-pointer"
          >
            Motion {motionOn ? "on" : "off"}
          </button>
          <button
            type="button"
            aria-pressed={thumbsOn}
            onClick={toggleThumbs}
            className="inline-flex min-h-[44px] items-center rounded-full border border-[#2a3034] px-3 font-mono text-[11px] text-[#9aa4a8] hover:text-[#ecefee] transition-colors cursor-pointer"
          >
            Thumbnails {thumbsOn ? "on" : "off"}
          </button>
        </div>
      </div>
    </div>
  );
}
