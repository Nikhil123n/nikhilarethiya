"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

type MotionRevealProps = Omit<HTMLMotionProps<"div">, "children" | "initial" | "whileInView" | "viewport" | "transition"> & {
  children: ReactNode;
  delay?: number;
  rotate?: boolean;
};

export function MotionReveal({ children, className, delay = 0, rotate = true, ...props }: MotionRevealProps) {
  return (
    <motion.div
      {...props}
      className={className}
      initial={{ opacity: 0, y: 24, rotate: rotate ? -0.8 : 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.42, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
