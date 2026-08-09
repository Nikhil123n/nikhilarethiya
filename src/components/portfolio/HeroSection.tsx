import Image from "next/image";
import { assets, type SiteConfig } from "@/data";
import { MotionReveal } from "./MotionReveal";
import { PushPin } from "./PushPin";
import { SketchButton } from "./SketchButton";
import { TiltCard } from "./TiltCard";

type HeroSectionProps = {
  site: SiteConfig;
};

export function HeroSection({ site }: HeroSectionProps) {
  return (
    <section id="home" className="scene hero" aria-labelledby="hero-title">
      <MotionReveal className="hero-copy">
        <p className="hero-kicker">Hi, I&apos;m</p>
        <div className="hero-name-wrap">
          <h1 id="hero-title" className="hero-name">
            {site.displayName}
          </h1>
        </div>
        <p className="hero-role">
          Software Engineer.
          <br />
          <span className="role-underlined">Problem Solver.</span> <span className="accent">Builder.</span> Storyteller.
        </p>
        <p className="hero-description">I turn ideas into scalable systems and craft digital experiences that solve real problems.</p>
        <p className="hero-mantra">
          Code is my tool.
          <br />
          Impact is my goal.
        </p>
        <div className="hero-actions">
          <SketchButton href="#projects">View Projects</SketchButton>
          <SketchButton href="/legacy/extra/#sketchbook" variant="ghost">
            Browse Sketchbook
          </SketchButton>
          <SketchButton href="#contact" variant="line">
            Contact Me
          </SketchButton>
        </div>
      </MotionReveal>

      <MotionReveal className="hero-stage" delay={0.08}>
        <TiltCard className="hero-stage-card">
          <Image
            className="hero-avatar"
            src={assets.avatars.working}
            alt="Hand-drawn avatar working at a laptop"
            width={760}
            height={760}
            priority
            sizes="(max-width: 900px) 86vw, 48vw"
          />
          <div className="code-note floating-note">
            <pre>{`function buildImpact() {
  const idea = sketch();
  const plan = architect();
  const code = build();
  return ship(code);
}`}</pre>
            <span>// stories live forever</span>
          </div>
          <article className="certifications-card plan-note" aria-labelledby="today-plan-title">
            <PushPin color="green" className="plan-note__pin" />
            <div className="certifications-card__content plan-note__content">
              <h3 id="today-plan-title" className="certifications-title plan-note__title">
                I build
              </h3>
              <ul className="certifications-list plan-note__list" aria-label="Build focus">
                {["Scalable Systems", "Intuitive UIs", "Clean Code", "Real Impact"].map((item) => (
                  <li className="certification-item plan-note__item" key={item}>
                    <span className="certification-check" aria-hidden="true" />
                    <span className="certification-copy">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <Image className="doodle doodle-plant" src={assets.doodles.plant} alt="" width={130} height={150} aria-hidden="true" />
          <Image className="doodle doodle-arrow" src={assets.doodles.arrowRight} alt="" width={120} height={120} aria-hidden="true" />
          <Image className="doodle doodle-spark" src={assets.doodles.sparkle} alt="" width={82} height={82} aria-hidden="true" />
        </TiltCard>
      </MotionReveal>
    </section>
  );
}
