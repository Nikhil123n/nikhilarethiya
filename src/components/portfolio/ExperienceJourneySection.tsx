"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ExperienceEntry } from "@/data";
import { ExperienceStoryDiagram } from "./ExperienceStoryDiagram";
import { NicExperienceCard } from "./NicExperienceCard";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ExperienceJourneySectionProps = {
  experience: ExperienceEntry[];
};

type MotionPreference = "system" | "full" | "reduce";

const WIDE_STORY_QUERY = "(min-width: 1200px) and (min-height: 860px)";
const ROAD_ARTIFACT_PATH = "/assets/artifacts/experience-road/sketchbook-road-diagonal-selected.png";

const stopIconLabels: Record<string, string> = {
  nic: "</>",
  sndl: "AI",
  un: "UN",
  hive: "H",
};

const chapterStarts = [0.1, 0.29, 0.5, 0.7];

function scrollDistance() {
  return Math.min(4600, Math.max(3400, Math.round(window.innerHeight * 4.25)));
}

export function ExperienceJourneySection({ experience }: ExperienceJourneySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const roadRevealRef = useRef<SVGRectElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [motionPreference, setMotionPreference] = useState<MotionPreference>("system");
  const reduceMotion =
    motionPreference === "reduce" ||
    (hasHydrated && motionPreference === "system" && Boolean(prefersReducedMotion));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryPreference = params.get("motion") || params.get("experienceMotion");

    if (queryPreference === "full" || queryPreference === "reduce" || queryPreference === "system") {
      setMotionPreference(queryPreference);
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    let correctionTimer: number | undefined;
    let refreshFrame: number | undefined;

    const refreshExperience = () => {
      if (window.location.hash !== "#experience") return;

      refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        correctionTimer = window.setTimeout(() => {
          const section = sectionRef.current;
          if (!section) return;

          window.scrollTo({
            top: Math.max(0, section.getBoundingClientRect().top + window.scrollY),
            behavior: "auto",
          });
          ScrollTrigger.update();
        }, 80);
      });
    };

    refreshExperience();
    window.addEventListener("hashchange", refreshExperience);

    return () => {
      window.removeEventListener("hashchange", refreshExperience);
      if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
      if (correctionTimer) window.clearTimeout(correctionTimer);
    };
  }, [hasHydrated, motionPreference, reduceMotion]);

  const handleMotionPreference = () => {
    setMotionPreference(reduceMotion ? "full" : "reduce");
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const roadReveal = roadRevealRef.current;
      if (!hasHydrated || !section || !stage || !roadReveal) return;

      const chapters = gsap.utils.toArray<HTMLElement>(".experience-stop-callout", section);
      const chapterShells = gsap.utils.toArray<HTMLElement>(".experience-story-chapter", section);
      const chapterDetails = gsap.utils.toArray<HTMLElement>(
        ".experience-story-metric, .experience-impact, .experience-tags, .experience-takeaway",
        section,
      );
      const stations = gsap.utils.toArray<HTMLElement>(".experience-route-station", section);
      const progressItems = gsap.utils.toArray<HTMLElement>(".experience-progress-item", section);
      const synthesis = section.querySelector<HTMLElement>(".experience-synthesis");

      const clearActiveState = () => {
        chapters.forEach((chapter) => {
          chapter.dataset.active = "false";
        });
        progressItems.forEach((item) => {
          item.dataset.active = "false";
        });
        if (synthesis) synthesis.dataset.active = "false";
        section.dataset.activeChapter = "all";
      };

      section.dataset.layout = "natural";
      clearActiveState();

      if (reduceMotion) {
        gsap.set([...chapterShells, ...chapters, ...chapterDetails, ...stations, synthesis], {
          clearProps: "all",
        });
        gsap.set(roadReveal, { attr: { height: 1600 } });
        return;
      }

      const media = gsap.matchMedia();

      media.add(WIDE_STORY_QUERY, () => {
        let activeChapter = "";

        const syncActiveChapter = (nextChapter: string) => {
          if (activeChapter === nextChapter) return;
          activeChapter = nextChapter;
          section.dataset.activeChapter = nextChapter;

          chapters.forEach((chapter) => {
            chapter.dataset.active = String(chapter.dataset.experienceId === nextChapter);
          });
          progressItems.forEach((item) => {
            item.dataset.active = String(item.dataset.experienceId === nextChapter);
          });
          if (synthesis) synthesis.dataset.active = String(nextChapter === "synthesis");
        };

        const syncFromProgress = (progress: number) => {
          if (progress >= 0.925) syncActiveChapter("synthesis");
          else if (progress >= 0.72) syncActiveChapter(experience[3]?.id ?? "hive");
          else if (progress >= 0.52) syncActiveChapter(experience[2]?.id ?? "un");
          else if (progress >= 0.31) syncActiveChapter(experience[1]?.id ?? "sndl");
          else syncActiveChapter(experience[0]?.id ?? "nic");
        };

        gsap.set(roadReveal, { attr: { height: 0 } });
        gsap.set(chapterShells, { opacity: 0, y: 18, scale: 0.985 });
        gsap.set(chapterDetails, { opacity: 0, y: 10 });
        const openingChapter = chapterShells[0];
        const openingDetails = openingChapter?.querySelectorAll<HTMLElement>(
          ".experience-story-metric, .experience-impact, .experience-tags, .experience-takeaway",
        );
        if (openingChapter) gsap.set(openingChapter, { opacity: 1, y: 0, scale: 1 });
        if (openingDetails) gsap.set(openingDetails, { opacity: 1, y: 0 });
        gsap.set(stations, { opacity: 0, scale: 0.92, transformOrigin: "50% 50%" });
        if (stations[0]) gsap.set(stations[0], { opacity: 1, scale: 1 });
        if (synthesis) gsap.set(synthesis, { opacity: 0, y: 16 });

        section.dataset.layout = "pinned";
        syncActiveChapter(experience[0]?.id ?? "nic");

        const timeline = gsap.timeline({
          defaults: { overwrite: "auto" },
          scrollTrigger: {
            id: "experience-living-systems-road",
            trigger: section,
            start: "top top",
            end: () => `+=${scrollDistance()}`,
            scrub: 0.32,
            pin: stage,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => section.classList.add("is-animating"),
            onEnterBack: () => section.classList.add("is-animating"),
            onLeave: () => section.classList.remove("is-animating"),
            onLeaveBack: () => section.classList.remove("is-animating"),
            onUpdate: ({ progress }) => syncFromProgress(progress),
          },
        });

        timeline.addLabel("intro", 0);
        timeline.to(roadReveal, { attr: { height: 1600 }, duration: 0.88, ease: "none" }, 0.02);

        chapterShells.forEach((chapter, index) => {
          const start = chapterStarts[index] ?? 0.1 + index * 0.19;
          const detailElements = chapter.querySelectorAll<HTMLElement>(
            ".experience-story-metric, .experience-impact, .experience-tags, .experience-takeaway",
          );
          const station = stations[index];

          timeline.addLabel(experience[index]?.id ?? `chapter-${index + 1}`, start);
          if (index > 0) {
            timeline.to(chapterShells[index - 1], { opacity: 0, y: -12, duration: 0.06, ease: "power2.in" }, start - 0.035);
          }
          timeline.to(chapter, { opacity: 1, y: 0, scale: 1, duration: 0.085, ease: "power3.out" }, start);
          timeline.to(
            detailElements,
            { opacity: 1, y: 0, duration: 0.07, stagger: 0.012, ease: "power2.out" },
            start + 0.025,
          );
          if (station) {
            timeline.to(station, { opacity: 1, scale: 1, duration: 0.07, ease: "power2.out" }, start);
          }
        });

        timeline.addLabel("synthesis", 0.91);
        if (chapterShells.at(-1)) {
          timeline.to(chapterShells.at(-1)!, { opacity: 0, y: -12, duration: 0.06, ease: "power2.in" }, 0.9);
        }
        if (synthesis) {
          timeline.to(synthesis, { opacity: 1, y: 0, duration: 0.08, ease: "power3.out" }, 0.92);
        }
        timeline.to({}, { duration: 0.02 }, 0.98);

        return () => {
          timeline.kill();
          section.classList.remove("is-animating");
          section.dataset.layout = "natural";
          clearActiveState();
        };
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [hasHydrated, reduceMotion], revertOnUpdate: true },
  );

  return (
    <section
      id="experience"
      className="scene experience-journey-section"
      aria-labelledby="experience-title"
      data-reduced-motion={reduceMotion ? "true" : "false"}
      data-motion-preference={motionPreference}
      data-layout="natural"
      data-active-chapter="all"
      data-hydrated={hasHydrated ? "true" : "false"}
      ref={sectionRef}
    >
      <div className="experience-journey-stage" ref={stageRef}>
        <div className="experience-story-layout">
          <header className="experience-journey-heading">
            <p className="experience-story-overline">Field notes · systems in motion</p>
            <h2 id="experience-title" className="section-kicker">
              Professional Experience
            </h2>
            <p>
              I follow the signal from public infrastructure to research systems—modernizing,
              scaling, validating, and turning data into tools people can trust.
            </p>
            {hasHydrated && (
              <button
                className="experience-motion-toggle"
                type="button"
                aria-label={`Experience motion is ${reduceMotion ? "reduced" : "full"}. Activate to ${
                  reduceMotion ? "play the scroll story" : "show the static story"
                }.`}
                aria-pressed={reduceMotion}
                onClick={handleMotionPreference}
              >
                <span aria-hidden="true" className="experience-motion-toggle-dot" />
                Experience Motion: {reduceMotion ? "Reduced" : "Full"}
              </button>
            )}
          </header>

          <ol className="experience-progress" aria-hidden="true">
            {experience.map((entry, index) => (
              <li className="experience-progress-item" data-experience-id={entry.id} data-active="false" key={entry.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {entry.chapter}
              </li>
            ))}
          </ol>

          <div className="experience-road-scene" aria-hidden="true">
            <p className="experience-route-caption">One living route · four system scales</p>
            <div className="experience-road-track">
              <svg className="experience-road" viewBox="0 0 1000 1600" focusable="false">
                <defs>
                  <mask
                    id="experience-road-artifact-mask"
                    className="experience-road-mask"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="1000"
                    height="1600"
                  >
                    <rect x="0" y="0" width="1000" height="1600" fill="black" />
                    <rect
                      ref={roadRevealRef}
                      className="experience-road-reveal-window"
                      x="0"
                      y="0"
                      width="1000"
                      height="1600"
                      fill="white"
                    />
                  </mask>
                </defs>
                <image
                  className="experience-road-artifact experience-road-artifact--draw"
                  href={ROAD_ARTIFACT_PATH}
                  x="0"
                  y="0"
                  width="1000"
                  height="1600"
                  preserveAspectRatio="xMidYMid meet"
                  mask="url(#experience-road-artifact-mask)"
                />
              </svg>

              <div className="experience-route-stations">
                {experience.map((entry, index) => (
                  <span
                    className={`experience-route-station experience-route-station--${entry.id}`}
                    data-experience-id={entry.id}
                    key={entry.id}
                  >
                    <span className="experience-route-station-mark">{stopIconLabels[entry.id] ?? index + 1}</span>
                    <span className="experience-route-station-number">{String(index + 1).padStart(2, "0")}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ol className="experience-story-list">
            {experience.map((entry, index) => (
              <li
                className={`experience-story-chapter${entry.id === "nic" ? " experience-story-chapter--nic" : ""}`}
                key={entry.id}
              >
                {entry.id === "nic" ? (
                  <NicExperienceCard entry={entry} index={index} />
                ) : (
                  <article
                    className="experience-stop-callout experience-story-card"
                    data-experience-id={entry.id}
                    data-active="false"
                  >
                    <div className="experience-story-card-head">
                      <div>
                        <p className="experience-stop-eyebrow">
                          Chapter {String(index + 1).padStart(2, "0")} · {entry.chapter}
                        </p>
                        <time>{entry.date}</time>
                        <h3>{entry.role}</h3>
                        <p className="experience-company">{entry.company}</p>
                      </div>
                      <ExperienceStoryDiagram visual={entry.storyVisual} />
                    </div>

                    <div className="experience-story-metric">
                      <strong>{entry.metric.value}</strong>
                      <span>{entry.metric.label}</span>
                    </div>
                    <p className="experience-impact">{entry.impact}</p>
                    <ul className="experience-tags" aria-label="Technologies and methods">
                      {entry.tags.map((tag) => (
                        <li className="experience-tag" key={tag}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <p className="experience-takeaway">{entry.takeaway}</p>
                  </article>
                )}
              </li>
            ))}
          </ol>

          <aside className="experience-synthesis" data-active="false" aria-label="Experience story synthesis">
            <p className="experience-stop-eyebrow">The route so far</p>
            <h3>Reliable systems. Trusted data. Human outcomes.</h3>
            <p>
              Public systems → reliable infrastructure → trusted data → human-centered research tooling.
            </p>
            <span>Next stop: deeper study and education.</span>
          </aside>
        </div>
      </div>
    </section>
  );
}
