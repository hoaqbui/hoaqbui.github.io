"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
}

// Always the same element, server and client: swapping a plain div for a motion.div after
// mount re-created the hero's text, and Lighthouse counted the headline as painted only then.
export default function Parallax({ children, className }: ParallaxProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 60]);

  return (
    <motion.div style={shouldReduceMotion ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
