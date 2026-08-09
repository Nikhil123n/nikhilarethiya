import { assets, type Certification, type SkillGroup } from "@/data";
import { MotionReveal } from "./MotionReveal";
import { PushPin } from "./PushPin";

type ToolkitSectionProps = {
  skills: SkillGroup[];
  certifications: Certification[];
};

export function ToolkitSection({ skills, certifications }: ToolkitSectionProps) {
  return (
    <section id="toolkit" className="scene toolkit-strip-section" aria-labelledby="toolkit-title">
      <div className="toolkit-strip-layout">
        <MotionReveal className="toolkit-strip" rotate={false}>
          <div className="toolkit-strip-intro">
            <div className="toolkit-strip-heading">
              <h2 id="toolkit-title">My Toolkit</h2>
              <span className="toolkit-strip-sun" aria-hidden="true" />
            </div>
            <p>
              The technologies
              <br />I use to build
              <br />
              and ship.
            </p>
          </div>
          {skills.map((group) => (
            <div className="toolkit-strip-group" key={group.title}>
              <h3>{group.title}</h3>
              <div className="toolkit-strip-icons">
                {group.iconIds.map((icon) => (
                  <span className="toolkit-icon" data-label={icon.label} role="img" aria-label={icon.label} tabIndex={0} key={icon.symbol}>
                    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
                      <use href={`${assets.sprites.toolkit}#${icon.symbol}`} />
                    </svg>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </MotionReveal>
        <MotionReveal className="certifications-showcase" delay={0.08} rotate={false}>
          <article className="certifications-card certifications-card--toolkit">
            <PushPin color="purple" className="certifications-card__pin" />
            <div className="certifications-card__content">
              <h3 className="certifications-title">Certifications</h3>
              <ul className="certifications-list" aria-label="Certifications">
                {certifications.map((certification) => (
                  <li className="certification-item" key={certification.title}>
                    <span className="certification-check" aria-hidden="true" />
                    <span className="certification-copy">
                      {(certification.lines ?? [certification.title]).map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                      {certification.provider ? (
                        <span className="certification-provider">
                          (<span className="certification-provider__name">{certification.provider}</span>)
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </MotionReveal>
      </div>
    </section>
  );
}
