"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
}

export default function Parallax({ children, className }: ParallaxProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 60]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
