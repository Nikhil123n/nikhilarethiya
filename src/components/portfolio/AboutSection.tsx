"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { assets } from "@/data/assets";
import { MotionReveal } from "./MotionReveal";

const stats = [
  { icon: assets.doodles.briefcase, end: 2, suffix: "+", value: "2+", label: "Years of\nExperience" },
  { icon: assets.doodles.rocket, end: 10, suffix: "+", value: "10+", label: "Projects\nShipped" },
  { icon: assets.doodles.code, end: 5, suffix: "+", value: "5+", label: "Technologies\nMastered" },
  { icon: assets.doodles.puzzle, end: 1000, suffix: "+", value: "1000+", label: "Problems\nSolved" },
  { icon: assets.doodles.clock, end: 24, suffix: "/7", value: "24/7", label: "Always\nLearning" },
] as const;

const COUNT_DURATION = 1.4;
const STAT_STAGGER = 0.1;
const REPLAY_DELAY = 30_000;

type AnimatedStatValueProps = {
  end: number;
  suffix: string;
  start: boolean;
  delay: number;
  onComplete: () => void;
};

function AnimatedStatValue({ end, suffix, start, delay, onComplete }: AnimatedStatValueProps) {
  const [displayedValue, setDisplayedValue] = useState(end);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (hasCompleted.current) return;

    if (!start) {
      setDisplayedValue(0);
      return;
    }

    setDisplayedValue(0);
    const controls = animate(0, end, {
      delay,
      duration: COUNT_DURATION,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayedValue(Math.round(latest)),
      onComplete: () => {
        hasCompleted.current = true;
        setDisplayedValue(end);
        onComplete();
      },
    });

    return () => controls.stop();
  }, [delay, end, onComplete, start]);

  return `${displayedValue}${suffix}`;
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: false, amount: 0.35, margin: "0px 0px -10% 0px" });
  const [hasMounted, setHasMounted] = useState(false);
  const [completedStats, setCompletedStats] = useState(0);
  const [countCycle, setCountCycle] = useState(0);
  const reduceSpatialMotion = hasMounted && prefersReducedMotion === true;
  const countState = completedStats === stats.length ? "complete" : isInView ? "counting" : "idle";
  const handleStatComplete = useCallback(() => {
    setCompletedStats((completed) => completed + 1);
  }, []);

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (completedStats !== stats.length) return;

    const replayTimer = window.setTimeout(() => {
      setCompletedStats(0);
      setCountCycle((cycle) => cycle + 1);
    }, REPLAY_DELAY);

    return () => window.clearTimeout(replayTimer);
  }, [completedStats]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="scene section about-section"
      aria-label="Portfolio highlights"
      data-count-state={countState}
      data-count-cycle={countCycle}
    >
      <MotionReveal className="stats-grid reveal-grid" rotate={false}>
        {stats.map((stat, index) => (
          <article className="stat-card" key={stat.value}>
            <motion.div
              key={countCycle}
              className="stat-card__content"
              initial={reduceSpatialMotion ? false : "rest"}
              animate={reduceSpatialMotion || isInView ? "visible" : "rest"}
              variants={{
                rest: { opacity: 0, y: 12, scale: 0.99 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={
                reduceSpatialMotion
                  ? { duration: 0 }
                  : { delay: isInView ? index * STAT_STAGGER : 0, duration: 0.38, ease: [0.2, 0, 0, 1] }
              }
            >
              <Image src={stat.icon} alt="" width={52} height={52} aria-hidden="true" />
              <strong aria-label={stat.value}>
                <AnimatedStatValue
                  end={stat.end}
                  suffix={stat.suffix}
                  start={isInView}
                  delay={index * STAT_STAGGER}
                  onComplete={handleStatComplete}
                />
              </strong>
              <span>
                {stat.label.split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </span>
            </motion.div>
          </article>
        ))}
      </MotionReveal>
    </section>
  );
}
