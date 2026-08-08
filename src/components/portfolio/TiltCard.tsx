"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  baseRotate?: string;
};

export function TiltCard({
  children,
  className,
  baseRotate = "var(--tilt-base-rotate, 0deg)",
}: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasHydrated, setHasHydrated] = useState(false);
  const reduceTiltMotion = hasHydrated && prefersReducedMotion;

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return (
    <motion.div
      className={className}
      style={{
        rotate: baseRotate,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      whileHover={
        reduceTiltMotion
          ? undefined
          : {
              y: -12,
              scale: 1.01,
              rotateX: 0.75,
              rotateY: -0.65,
            }
      }
      whileTap={reduceTiltMotion ? undefined : { y: -5, scale: 0.997 }}
      transition={{
        type: "spring",
        stiffness: 145,
        damping: 20,
        mass: 0.88,
        restDelta: 0.001,
      }}
    >
      {children}
    </motion.div>
  );
}
