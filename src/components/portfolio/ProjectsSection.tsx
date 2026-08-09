"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Project, SiteConfig } from "@/data";
import { MotionReveal } from "./MotionReveal";
import { ProjectCard } from "./ProjectCard";
import type { PushPinColor } from "./PushPin";

type ProjectsSectionProps = {
  projects: Project[];
  site: SiteConfig;
};

const projectPageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "104%" : "-104%",
    opacity: 0,
    scale: 0.965,
    filter: "blur(1px)",
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-104%" : "104%",
    opacity: 0,
    scale: 0.975,
    filter: "blur(1px)",
  }),
};

const reducedProjectPageVariants = {
  enter: { x: "0%", opacity: 1, scale: 1, filter: "blur(0px)" },
  center: { x: "0%", opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { x: "0%", opacity: 1, scale: 1, filter: "blur(0px)" },
};

const projectPageSpring = {
  type: "spring" as const,
  stiffness: 180,
  damping: 25,
  mass: 0.9,
};

const projectPinColors: readonly PushPinColor[] = ["blue", "green", "purple"];

export function ProjectsSection({ projects, site }: ProjectsSectionProps) {
  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(projects.length / pageSize));
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hasHydrated, setHasHydrated] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reduceProjectMotion = hasHydrated && prefersReducedMotion;
  const projectPages = useMemo(
    () =>
      Array.from({ length: pageCount }, (_, index) =>
        projects.slice(index * pageSize, index * pageSize + pageSize),
      ),
    [pageCount, projects],
  );
  const activeProjects = projectPages[pageIndex] ?? [];
  const pagerLabel = `${String(pageIndex + 1).padStart(2, "0")} / ${String(pageCount).padStart(2, "0")}`;

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const goToPage = (nextPageIndex: number) => {
    const boundedPageIndex = Math.min(pageCount - 1, Math.max(0, nextPageIndex));
    if (boundedPageIndex === pageIndex) return;

    setDirection(boundedPageIndex > pageIndex ? 1 : -1);
    setPageIndex(boundedPageIndex);
  };

  return (
    <section id="projects" className="scene section projects-section" aria-labelledby="projects-title">
      <div className="projects-showcase">
        <MotionReveal className="project-side">
          <div className="section-kicker">Featured Projects</div>
          <p id="projects-title">
            Where engineering
            <br />
            meets thoughtful
            <br />
            product design.
          </p>
        </MotionReveal>

        <MotionReveal className="project-pager" rotate={false} aria-label="Project pages">
          <button
            className="project-pager__button project-side-arrow"
            type="button"
            aria-label="Previous projects"
            disabled={pageIndex === 0}
            onClick={() => goToPage(pageIndex - 1)}
          >
            &larr;
          </button>
          <button
            className="project-pager__button project-row-arrow"
            type="button"
            aria-label="Next projects"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => goToPage(pageIndex + 1)}
          >
            &rarr;
          </button>
          <span className="project-pager__count">{pagerLabel}</span>
        </MotionReveal>

        <div className="project-slider-window" data-project-grid aria-live="polite">
          <div className="project-slider-track">
            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              <motion.div
                className="project-grid project-slider-page"
                key={`project-page-${pageIndex}`}
                custom={direction}
                variants={reduceProjectMotion ? reducedProjectPageVariants : projectPageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reduceProjectMotion ? { duration: 0 } : projectPageSpring}
                layout="position"
              >
                {activeProjects.map((project, projectIndex) => (
                  <motion.div className="project-slide-card" key={project.id} layout="position">
                    <ProjectCard project={project} pinColor={projectPinColors[projectIndex % projectPinColors.length]} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <MotionReveal className="project-more-row">
          <a className="project-more-link" href={site.githubUrl} target="_blank" rel="noreferrer">
            View All Projects <span>-&gt;</span>
          </a>
        </MotionReveal>
        <MotionReveal className="project-footer-tags">
          <div className="project-footer-tag project-footer-tag--yellow">
            <span>
              Engineer by profession,
              <br />
              creator by passion.
            </span>
            <span className="project-footer-tag__icon project-footer-tag__icon--camera" aria-hidden="true" />
          </div>
          <div className="project-footer-tag project-footer-tag--blue">
            <span>Let&apos;s build something awesome!</span>
            <span className="project-footer-tag__icon project-footer-tag__icon--sparkle" aria-hidden="true" />
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
