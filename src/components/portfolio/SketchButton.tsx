"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type SketchButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "line";
  className?: string;
};

export function SketchButton({ href, children, variant = "primary", className = "" }: SketchButtonProps) {
  return (
    <motion.a
      className={`btn btn-${variant} ${className}`}
      href={href}
      whileHover={{ y: -2, rotate: variant === "primary" ? -1 : 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {variant === "primary" ? <span aria-hidden="true" /> : null}
      {children}
    </motion.a>
  );
}
