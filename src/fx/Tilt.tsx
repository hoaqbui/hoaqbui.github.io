"use client";

import {
  useEffect,
  useState,
  useRef,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  "aria-hidden"?: boolean;
}

const SPRING_CONFIG = {
  stiffness: 260,
  damping: 20,
  mass: 0.5,
};

export default function Tilt({
  children,
  className,
  style,
  onClick,
  "aria-hidden": ariaHidden,
}: TiltProps) {
  const shouldReduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);

  const rotateX = useSpring(rotateXRaw, SPRING_CONFIG);
  const rotateY = useSpring(rotateYRaw, SPRING_CONFIG);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover)");
    const pointerQuery = window.matchMedia("(pointer: fine)");

    const checkSupport = () => {
      setCanTilt(hoverQuery.matches && pointerQuery.matches);
    };

    checkSupport();

    hoverQuery.addEventListener("change", checkSupport);
    pointerQuery.addEventListener("change", checkSupport);

    return () => {
      hoverQuery.removeEventListener("change", checkSupport);
      pointerQuery.removeEventListener("change", checkSupport);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Max 6deg tilt: pointer up tilts card toward top (positive rotateX), pointer right tilts card toward right (positive rotateY)
    rotateXRaw.set(-y * 12); // clamp to [-6, 6]
    rotateYRaw.set(x * 12);
  };

  const handleMouseLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  if (!canTilt || shouldReduceMotion) {
    return (
      <div
        ref={ref}
        className={className}
        style={style}
        onClick={onClick}
        aria-hidden={ariaHidden}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        perspective: 900,
        display: "contents",
      }}
    >
      <motion.div
        ref={ref}
        className={className}
        style={{
          ...style,
          rotateX,
          rotateY,
          transformPerspective: 900,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        aria-hidden={ariaHidden}
      >
        {children}
      </motion.div>
    </div>
  );
}
