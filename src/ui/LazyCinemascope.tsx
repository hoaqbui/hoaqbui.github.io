"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { CinemascopeProps } from "./Cinemascope";

const Cinemascope = dynamic(() => import("./Cinemascope"), { ssr: false });

// The home page's photo band: the carousel loads only when it comes within 1500px,
// so it adds nothing to the page's start-up. Until then a frame-shaped box holds its place.
export default function LazyCinemascope(props: CinemascopeProps) {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: "1500px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} data-carousel-slot>
      {near ? <Cinemascope {...props} /> : <div className="aspect-[2.39/1] w-full" />}
    </div>
  );
}
