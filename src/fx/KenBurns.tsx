"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export interface KenBurnsProps {
  children: ReactNode;
  motionOn?: boolean;
  className?: string;
}

export default function KenBurns({
  children,
  motionOn = true,
  className = "w-full h-full",
}: KenBurnsProps) {
  const reducedMotion = useReducedMotion();
  const shouldPush = motionOn && !reducedMotion;

  return (
    <motion.div
      initial={shouldPush ? { scale: 1 } : false}
      animate={shouldPush ? { scale: 1.08 } : { scale: 1 }}
      transition={
        shouldPush
          ? { duration: 6, ease: "easeOut" }
          : { duration: 0 }
      }
      style={{
        width: "100%",
        height: "100%",
        transformOrigin: "center center",
        willChange: "transform",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
