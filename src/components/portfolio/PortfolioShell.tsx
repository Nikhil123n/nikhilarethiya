"use client";

import { useEffect, useMemo, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import type {
  Certification,
  EducationEntry,
  ExperienceEntry,
  NavItem,
  Project,
  SceneMeta,
  SiteConfig,
  SkillGroup,
} from "@/data";
import { AboutSection } from "./AboutSection";
import { ContactSection } from "./ContactSection";
import { EducationSection } from "./EducationSection";
import { ExperienceJourneySection } from "./ExperienceJourneySection";
import { HeroSection } from "./HeroSection";
import { NotebookRail } from "./NotebookRail";
import { ProjectsSection } from "./ProjectsSection";
import { ReactiveAvatar } from "./ReactiveAvatar";
import { SceneProgress } from "./SceneProgress";
import { ToolkitSection } from "./ToolkitSection";
import { Topbar } from "./Topbar";

type PortfolioShellProps = {
  navItems: NavItem[];
  scenes: SceneMeta[];
  site: SiteConfig;
  projects: Project[];
  skills: SkillGroup[];
  certifications: Certification[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
};

export function PortfolioShell({
  navItems,
  scenes,
  site,
  projects,
  skills,
  certifications,
  education,
  experience,
}: PortfolioShellProps) {
  const reduceMotion = useReducedMotion();
  const [activeSceneId, setActiveSceneId] = useState(scenes[0]?.id ?? "home");
  const [progress, setProgress] = useState(0);
  const activeScene = useMemo(
    () => scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0],
    [activeSceneId, scenes],
  );
  const activeTarget = activeScene?.navTarget ?? "home";

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollHeight <= 0 ? 0 : Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setProgress(Number(nextProgress.toFixed(2)));
    }

    let frame = 0;
    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateProgress();
      });
    }

    updateProgress();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const elements = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    function chooseCurrentScene() {
      const referenceY = Math.min(window.innerHeight * 0.38, 320);
      let current = elements[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      elements.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= referenceY && rect.bottom > referenceY) {
          current = section;
          closestDistance = 0;
          return;
        }
        if (closestDistance !== 0) {
          const distance = Math.min(Math.abs(rect.top - referenceY), Math.abs(rect.bottom - referenceY));
          if (distance < closestDistance) {
            closestDistance = distance;
            current = section;
          }
        }
      });

      setActiveSceneId(current.id);
    }

    const observer = new IntersectionObserver(() => chooseCurrentScene(), {
      threshold: [0, 0.18, 0.38, 0.62, 1],
    });

    elements.forEach((element) => observer.observe(element));
    chooseCurrentScene();

    window.addEventListener("scroll", chooseCurrentScene, { passive: true });
    window.addEventListener("resize", chooseCurrentScene, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", chooseCurrentScene);
      window.removeEventListener("resize", chooseCurrentScene);
    };
  }, [scenes]);

  useEffect(() => {
    if (reduceMotion) return;

    function updateCursor(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      document.documentElement.style.setProperty("--cursor-x", x.toFixed(4));
      document.documentElement.style.setProperty("--cursor-y", y.toFixed(4));
    }

    window.addEventListener("pointermove", updateCursor, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updateCursor);
      document.documentElement.style.setProperty("--cursor-x", "0");
      document.documentElement.style.setProperty("--cursor-y", "0");
    };
  }, [reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio-shell" data-active-scene={activeSceneId}>
        <div className="paper-noise" aria-hidden="true" />
        <div className="cursor-orb" aria-hidden="true" />
        <NotebookRail items={navItems} activeTarget={activeTarget} />
        <Topbar site={site} />
        <SceneProgress progress={progress} />
        {activeScene ? <ReactiveAvatar scene={activeScene} /> : null}
        <main id="content">
          <HeroSection site={site} />
          <AboutSection />
          <ToolkitSection skills={skills} certifications={certifications} />
          <ProjectsSection projects={projects} site={site} />
          <ExperienceJourneySection experience={experience} />
          <EducationSection education={education} />
          <ContactSection site={site} />
        </main>
        <footer className="site-footer">
          <span className="footer-copy">&copy; 2025 {site.displayName}. All rights reserved.</span>
          <span className="footer-note">Built with passion. Framed with purpose.</span>
        </footer>
      </div>
    </MotionConfig>
  );
}
