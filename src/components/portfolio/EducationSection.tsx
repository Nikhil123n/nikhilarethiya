import Image from "next/image";
import { assets, type EducationEntry } from "@/data";
import { MotionReveal } from "./MotionReveal";

type EducationSectionProps = {
  education: EducationEntry[];
};

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="scene section education-section" aria-labelledby="education-title">
      <MotionReveal className="education-paper">
        <h2 id="education-title">Education</h2>
        <div className="education-layout">
          <div className="education-list" aria-label="Education history">
            {education.map((entry) => (
              <article className="education-item" key={entry.school}>
                <Image src={entry.icon} alt="" width={92} height={92} aria-hidden="true" />
                <div className="education-copy">
                  <div className="education-heading">
                    <h3>{entry.school}</h3>
                    <time>{entry.date}</time>
                  </div>
                  <p>{entry.degree}</p>
                  {entry.coursework ? (
                    <p>
                      <strong>Coursework:</strong> {entry.coursework}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          <Image
            className="education-illustration"
            src={assets.doodles.educationBooks}
            alt=""
            width={360}
            height={360}
            aria-hidden="true"
          />
        </div>
      </MotionReveal>
    </section>
  );
}
