"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ExperienceEntry } from "@/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ExperienceJourneySectionProps = {
  experience: ExperienceEntry[];
};

type MotionPreference = "system" | "full" | "reduce";

const ROAD_PATH =
  "M20 126 C238 124 456 196 470 318 C486 455 250 421 254 575 C258 724 646 705 674 880 C704 1054 498 1086 572 1244 C642 1392 828 1458 986 1528";
const ROAD_ARTIFACT_PATH = "/assets/artifacts/experience-road/sketchbook-road-diagonal-selected.png";

const stopIconLabels: Record<string, string> = {
  nic: "</>",
  sndl: "AI",
  un: "UN",
  hive: "H",
};

const stopCalloutSides: Array<"left" | "right"> = ["right", "left", "right", "left"];

export function ExperienceJourneySection({ experience }: ExperienceJourneySectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const roadRef = useRef<SVGPathElement | null>(null);
  const roadLaneRef = useRef<SVGPathElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [motionPreference, setMotionPreference] = useState<MotionPreference>("system");
  const reduceMotion =
    motionPreference === "reduce" ||
    (hasHydrated && motionPreference === "system" && Boolean(prefersReducedMotion));

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryPreference = params.get("motion") || params.get("experienceMotion");

    if (queryPreference === "full" || queryPreference === "reduce" || queryPreference === "system") {
      setMotionPreference(queryPreference);
    }
  }, []);

  useEffect(() => {
    let startCorrectionTimer: number | undefined;

    const refreshExperience = () => {
      if (window.location.hash !== "#experience") return;
      window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        startCorrectionTimer = window.setTimeout(() => {
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
      if (startCorrectionTimer) window.clearTimeout(startCorrectionTimer);
    };
  }, [motionPreference]);

  const handleMotionPreference = () => {
    const nextPreference: MotionPreference = reduceMotion ? "full" : "reduce";
    setMotionPreference(nextPreference);
    window.requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const road = roadRef.current;
      const roadLane = roadLaneRef.current;
      if (!section || !stage || !road || !roadLane) return;

      const roadTrack = section.querySelector<HTMLElement>(".experience-road-track");
      const callouts = gsap.utils.toArray<HTMLElement>(".experience-stop-callout", section);
      const roadPins = gsap.utils.toArray<HTMLElement>(".experience-map-pin", section);
      const pinLabels = gsap.utils.toArray<HTMLElement>(".experience-stop-label", section);
      const doodles = gsap.utils.toArray<HTMLElement>(".experience-doodle", section);
      const artifacts = gsap.utils.toArray<HTMLElement>(".experience-map-artifact", section);
      const animatedDetails = gsap.utils.toArray<HTMLElement>(
        ".experience-org-badge, .experience-stop-copy",
        section,
      );

      if (reduceMotion) {
        gsap.set(road, { strokeDasharray: "none", strokeDashoffset: 0, autoAlpha: 1 });
        gsap.set(roadLane, { autoAlpha: 1, clearProps: "strokeDasharray,strokeDashoffset" });
        gsap.set(roadTrack, { clearProps: "transform" });
        gsap.set(callouts, { autoAlpha: 1, x: 0, y: 0, clearProps: "transform" });
        gsap.set(roadPins, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" });
        gsap.set(pinLabels, { autoAlpha: 1, y: 0, clearProps: "transform" });
        gsap.set(animatedDetails, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" });
        gsap.set([...doodles, ...artifacts], { clearProps: "transform", autoAlpha: 1 });
        return;
      }

      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerElement = trigger.trigger;
        const ownsTrigger = triggerElement instanceof Element && section.contains(triggerElement);
        if (ownsTrigger || trigger.pin === stage) trigger.kill(true);
      });

      gsap.set([stage, road, roadLane, roadTrack, ...callouts, ...roadPins, ...pinLabels, ...animatedDetails, ...doodles, ...artifacts], {
        clearProps: "all",
      });

      const pathLength = road.getTotalLength();
      gsap.set(road, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
      gsap.set(roadLane, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        autoAlpha: 0,
      });
      gsap.set(roadPins, { autoAlpha: 0, y: -22, scale: 0.35, transformOrigin: "50% 90%" });
      gsap.set(pinLabels, { autoAlpha: 0, y: 10 });
      gsap.set(animatedDetails, { autoAlpha: 0, y: 12, scale: 0.92 });
      gsap.set(artifacts, { autoAlpha: 0.34, y: 32, rotate: -1.5 });
      gsap.set(roadTrack, { y: 60 });

      callouts.forEach((callout) => {
        const side = callout.dataset.side === "right" ? 1 : -1;
        gsap.set(callout, { autoAlpha: 0, x: side * 42, y: 18 });
      });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        const revealPositions = [0.14, 0.36, 0.58, 0.8];
        const timeline = gsap.timeline({
          defaults: { overwrite: "auto" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=5000",
            scrub: 0.95,
            pin: stage,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(road, { strokeDashoffset: 0, ease: "none", duration: 0.88 }, 0);
        timeline.to(roadLane, { strokeDashoffset: 0, autoAlpha: 0.42, ease: "none", duration: 0.88 }, 0.02);
        timeline.to(roadTrack, { y: -90, ease: "none", duration: 0.88 }, 0);
        timeline.to(doodles, { y: -34, x: 12, rotate: 1.8, ease: "none", stagger: 0.03, duration: 0.88 }, 0);
        timeline.to(artifacts, { autoAlpha: 0.9, y: -18, rotate: 1, ease: "none", stagger: 0.04, duration: 0.88 }, 0.02);

        callouts.forEach((callout, index) => {
          const start = revealPositions[index] ?? 0.2 + index * 0.17;
          const side = callout.dataset.side === "right" ? 1 : -1;
          const roadPin = roadPins[index];
          const label = pinLabels[index];
          const badge = callout.querySelector(".experience-org-badge");
          const copy = callout.querySelector(".experience-stop-copy");

          timeline.to(roadPin, { autoAlpha: 1, y: 0, scale: 1, duration: 0.055, ease: "back.out(3.2)" }, start);
          timeline.to(label, { autoAlpha: 1, y: 0, duration: 0.045, ease: "power2.out" }, start + 0.02);
          timeline.to(callout, { autoAlpha: 1, x: 0, y: 0, duration: 0.09, ease: "power3.out" }, start + 0.025);
          timeline.to(badge, { autoAlpha: 1, y: 0, scale: 1, duration: 0.055, ease: "back.out(2.5)" }, start + 0.055);
          timeline.fromTo(copy, { x: side * 10 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.07, ease: "power2.out" }, start + 0.08);
        });

        timeline.to({}, { duration: 0.15 }, 0.95);

        return () => timeline.kill();
      });

      mm.add("(max-width: 899px)", () => {
        gsap.set(roadTrack, { clearProps: "transform" });
        gsap.set(callouts, { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(animatedDetails, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(roadPins, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(pinLabels, { autoAlpha: 1, y: 0 });

        const mobileRoad = gsap.to(road, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 45%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });
        const mobileLane = gsap.to(roadLane, {
          strokeDashoffset: 0,
          autoAlpha: 0.78,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "bottom 45%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          mobileRoad.kill();
          mobileLane.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduceMotion, motionPreference], revertOnUpdate: true },
  );

  return (
    <section
      id="experience"
      className="scene experience-journey-section"
      aria-labelledby="experience-title"
      data-reduced-motion={reduceMotion ? "true" : "false"}
      data-motion-preference={motionPreference}
      ref={sectionRef}
    >
      <div className="experience-journey-stage" ref={stageRef}>
        <div className="experience-doodle experience-doodle--compass" aria-hidden="true" />
        <div className="experience-doodle experience-doodle--route" aria-hidden="true" />
        <div className="experience-doodle experience-doodle--spark" aria-hidden="true" />

        <div className="experience-journey-heading">
          <h2 id="experience-title" className="section-kicker">
            Professional Experience
          </h2>
          <p>Four stops, one route: public-sector scale, research infrastructure, global data, and product-minded engineering.</p>
          {hasHydrated && (prefersReducedMotion || motionPreference === "reduce") && (
            <button
              className="experience-motion-toggle"
              type="button"
              onClick={handleMotionPreference}
            >
              {reduceMotion ? "Play journey" : "Reduce motion"}
            </button>
          )}
        </div>

        <div className="experience-road-scene" aria-label="Professional experience journey">
          <div className="experience-map-artifacts" aria-hidden="true">
            <span className="experience-map-artifact experience-map-mountains" />
            <span className="experience-map-artifact experience-map-dashed-route" />
            <span className="experience-map-artifact experience-map-tree experience-map-tree--one" />
            <span className="experience-map-artifact experience-map-tree experience-map-tree--two" />
            <span className="experience-map-artifact experience-map-tree experience-map-tree--three" />
            <span className="experience-map-artifact experience-map-tree experience-map-tree--four" />
            <span className="experience-map-artifact experience-map-traveler" />
          </div>

          <div className="experience-road-track" aria-hidden="true">
            <svg className="experience-road" viewBox="0 0 1000 1600" role="img" aria-label="Winding road path connecting experience cards">
              <defs>
                <mask id="experience-road-artifact-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1600">
                  <rect x="0" y="0" width="1000" height="1600" fill="black" />
                  <path ref={roadRef} className="experience-road-draw experience-road-reveal-mask" d={ROAD_PATH} />
                </mask>
              </defs>
              <image
                className="experience-road-artifact experience-road-artifact--ghost"
                href={ROAD_ARTIFACT_PATH}
                x="0"
                y="0"
                width="1000"
                height="1600"
                preserveAspectRatio="xMidYMid meet"
              />
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
              <path ref={roadLaneRef} className="experience-road-centerline" d={ROAD_PATH} />
            </svg>

            <div className="experience-map-pins">
              {experience.map((entry, index) => (
                <span className={`experience-map-pin experience-map-pin--${entry.id}`} key={entry.id}>
                  <span className="experience-stop-label">{String(index + 1).padStart(2, "0")}</span>
                </span>
              ))}
            </div>

            <div className="experience-callout-layer">
              {experience.map((entry, index) => {
                const calloutSide = stopCalloutSides[index] ?? entry.side;

                return (
                  <article
                    className={`experience-stop-callout experience-stop-callout--${calloutSide}`}
                    data-side={calloutSide}
                    key={entry.id}
                    aria-label={`${entry.date}, ${entry.company}, ${entry.role}`}
                  >
                    <span className={`experience-org-badge experience-org-badge--${entry.id}`} aria-hidden="true">
                      {stopIconLabels[entry.id] ?? String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="experience-stop-copy">
                      <time>{entry.date}</time>
                      <p className="experience-stop-company">{entry.company}</p>
                      <h3 className="experience-stop-role">{entry.role}</h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
