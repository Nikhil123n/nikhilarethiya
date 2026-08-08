import Image from "next/image";
import { assets } from "@/data";
import { MotionReveal } from "./MotionReveal";

const stats = [
  { icon: assets.doodles.briefcase, value: "2+", label: "Years of\nExperience" },
  { icon: assets.doodles.rocket, value: "10+", label: "Projects\nShipped" },
  { icon: assets.doodles.code, value: "5+", label: "Technologies\nMastered" },
  { icon: assets.doodles.puzzle, value: "1000+", label: "Problems\nSolved" },
  { icon: assets.doodles.clock, value: "24/7", label: "Always\nLearning" },
];

export function AboutSection() {
  return (
    <section id="about" className="scene section about-section" aria-label="Portfolio highlights">
      <MotionReveal className="stats-grid reveal-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.value}>
            <Image src={stat.icon} alt="" width={52} height={52} aria-hidden="true" />
            <strong>{stat.value}</strong>
            <span>
              {stat.label.split("\n").map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </span>
          </article>
        ))}
      </MotionReveal>
    </section>
  );
}
