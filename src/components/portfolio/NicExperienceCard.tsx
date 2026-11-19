import Image from "next/image";
import type { ExperienceEntry } from "@/data";

type NicExperienceCardProps = {
  entry: ExperienceEntry;
  index: number;
};

const techIconKinds: Record<string, string> = {
  Java: "java",
  JSP: "jsp",
  Oracle: "oracle",
  Spring: "spring",
  Linux: "linux",
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.1 3.9h11.8c.9 0 1.6.7 1.6 1.6v10.1c0 .9-.7 1.6-1.6 1.6H4.1c-.9 0-1.6-.7-1.6-1.6V5.5c0-.9.7-1.6 1.6-1.6Z" />
      <path d="M6 2.3v3.2m8-3.2v3.2M2.7 7.4h14.6" />
      <path d="M6 10.2h2m2 0h2m2 0h.8M6 13.5h2m2 0h2" />
    </svg>
  );
}

function TechIcon({ kind }: { kind: string }) {
  if (kind === "java") {
    return (
      <Image
        className="experience-nic-tech-icon experience-nic-tech-icon--java"
        src="/assets/artifacts/01-homepage-layout/transparent-png/tech-java.png"
        alt=""
        width={18}
        height={14}
        sizes="18px"
        aria-hidden="true"
      />
    );
  }

  if (kind === "jsp") {
    return (
      <svg className="experience-nic-tech-icon experience-nic-tech-icon--jsp" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5.2 4.7h9.6l1 10.6H4.2l1-10.6Z" />
        <path d="M7 8.1c2 1 4 1 6 0m-6 3.2c2 1 4 1 6 0" />
      </svg>
    );
  }

  if (kind === "oracle") {
    return (
      <svg className="experience-nic-tech-icon experience-nic-tech-icon--oracle" viewBox="0 0 20 20" aria-hidden="true">
        <ellipse cx="10" cy="10" rx="7.2" ry="4.8" />
        <ellipse cx="10" cy="10" rx="3.2" ry="1.8" />
      </svg>
    );
  }

  if (kind === "spring") {
    return (
      <svg className="experience-nic-tech-icon experience-nic-tech-icon--spring" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M16.8 3.2C8.4 3.5 3.7 7 3.5 12.1c-.1 2.7 2 4.7 4.8 4.7 5 0 7.7-5.2 8.5-13.6Z" />
        <path d="M5.4 14.7c2.2-3.3 4.7-5.5 8-7.2" />
      </svg>
    );
  }

  return (
    <svg className="experience-nic-tech-icon experience-nic-tech-icon--linux" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2.7c-2 0-3 1.8-3 4.1 0 1.1-.5 2.2-1.4 3.6-1.7 2.8-.4 6.4 4.4 6.7 4.8-.3 6.1-3.9 4.4-6.7-.9-1.4-1.4-2.5-1.4-3.6 0-2.3-1-4.1-3-4.1Z" />
      <circle cx="8.7" cy="6.2" r=".6" />
      <circle cx="11.3" cy="6.2" r=".6" />
      <path d="m8.6 8.1 1.4.8 1.4-.8M7.1 14.4l-2 2m7.8-2 2 2" />
    </svg>
  );
}

function HighlightedImpact({ entry }: { entry: ExperienceEntry }) {
  const highlight = entry.impactHighlight;
  if (!highlight) return <>{entry.impact}</>;

  const [before, after = ""] = entry.impact.split(highlight);
  return (
    <>
      {before}
      <strong className="experience-impact-highlight">{highlight}</strong>
      {after}
    </>
  );
}

export function NicExperienceCard({ entry, index }: NicExperienceCardProps) {
  return (
    <article
      className="experience-stop-callout experience-story-card experience-story-card--nic"
      data-experience-id={entry.id}
      data-active="false"
    >
      <span className="experience-nic-card__pin" data-pin-color="red" aria-hidden="true">
        <Image
          src="/assets/pushpin-sketchbook-red.png"
          alt=""
          width={32}
          height={70}
          sizes="32px"
          draggable={false}
        />
      </span>

      <div className="experience-nic-card__main">
        <p className="experience-stop-eyebrow">
          Chapter {String(index + 1).padStart(2, "0")} · {entry.chapter}
        </p>
        <h3>{entry.company}</h3>
        <h4 className="experience-nic-role">{entry.role}</h4>
        <span className="experience-nic-date">
          <CalendarIcon />
          <span>{entry.date}</span>
        </span>
        <p className="experience-impact">
          <HighlightedImpact entry={entry} />
        </p>
        <ul className="experience-tags" aria-label="Technologies and methods">
          {entry.tags.map((tag) => (
            <li className="experience-tag" key={tag}>
              <TechIcon kind={techIconKinds[tag] ?? "linux"} />
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      </div>

      <aside className="experience-nic-key-impact" aria-label="Key impact">
        <Image
          className="experience-nic-key-impact__paper"
          src="/assets/artifacts/04-hand-drawn-ui-elements/svg/sticky-note-blank.svg"
          alt=""
          fill
          sizes="160px"
          aria-hidden="true"
        />
        <div className="experience-nic-key-impact__content">
          <h4 className="experience-nic-key-impact__title">KEY IMPACT</h4>
          <ul className="experience-nic-key-impact__list">
            {entry.keyImpacts?.map((impact) => <li key={impact}>{impact}</li>)}
          </ul>
        </div>
      </aside>
    </article>
  );
}
