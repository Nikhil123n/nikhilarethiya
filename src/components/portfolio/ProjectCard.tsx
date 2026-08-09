import type { Project } from "@/data";
import { PushPin, type PushPinColor } from "./PushPin";

type ProjectCardProps = {
  project: Project;
  pinColor?: PushPinColor;
};

export function ProjectCard({ project, pinColor = "blue" }: ProjectCardProps) {
  const githubHref = project.githubUrl || "#contact";
  const liveDemoHref = project.liveDemoUrl || project.demoUrl || githubHref;

  return (
    <article className="project-card project-card--artifact project-card--reference">
      <span className="project-card-paper" aria-hidden="true" />
      <PushPin color={pinColor} className="project-card__pin" />
      <span className="project-paperclip-pin" aria-hidden="true" />
      <span className="project-tape-pin" aria-hidden="true" />
      <div className="project-card-content">
        <div className={`project-sketch ${project.sketch}-sketch`} aria-hidden="true">
          {project.sketch === "dashboard" ? <DashboardSketch /> : null}
          {project.sketch === "medical" ? <MedicalSketch /> : null}
          {project.sketch === "neural" ? <NeuralSketch /> : null}
        </div>
        <h3>
          <span className="project-title-copy">{project.title}</span>
          <span className="project-title-star" aria-hidden="true" />
        </h3>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p>{renderHighlightedDescription(project.description, project.descriptionHighlights)}</p>
        <div className="project-card__actions">
          <a href={githubHref} target={isExternal(githubHref) ? "_blank" : undefined} rel={isExternal(githubHref) ? "noreferrer" : undefined}>
            {project.ctaLabel} <span>&rarr;</span>
          </a>
          <a href={liveDemoHref} target={isExternal(liveDemoHref) ? "_blank" : undefined} rel={isExternal(liveDemoHref) ? "noreferrer" : undefined}>
            {project.liveDemoLabel || "Live Demo"} <span>&rarr;</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function renderHighlightedDescription(text: string, phrases: string[] = []) {
  const highlights = phrases.map((phrase) => phrase.trim()).filter(Boolean);

  if (!text || highlights.length === 0) {
    return text;
  }

  const lowerSource = text.toLowerCase();
  const lowerHighlights = highlights.map((phrase) => phrase.toLowerCase());
  const nodes = [];
  let cursor = 0;
  let key = 0;

  while (cursor < text.length) {
    let nextIndex = -1;
    let nextPhrase = "";

    lowerHighlights.forEach((phrase, index) => {
      const foundIndex = lowerSource.indexOf(phrase, cursor);
      if (
        foundIndex !== -1 &&
        (nextIndex === -1 || foundIndex < nextIndex || (foundIndex === nextIndex && phrase.length > nextPhrase.length))
      ) {
        nextIndex = foundIndex;
        nextPhrase = highlights[index];
      }
    });

    if (nextIndex === -1) {
      nodes.push(text.slice(cursor));
      break;
    }

    if (nextIndex > cursor) {
      nodes.push(text.slice(cursor, nextIndex));
    }

    nodes.push(
      <span className="project-description-mark" key={`mark-${key}`}>
        {text.slice(nextIndex, nextIndex + nextPhrase.length)}
      </span>,
    );
    key += 1;
    cursor = nextIndex + nextPhrase.length;
  }

  return nodes;
}

function DashboardSketch() {
  return (
    <>
      <span className="dash-panel" />
      <span className="dash-list" />
      <span className="dash-map" />
      <span className="dash-chart chart-one" />
      <span className="dash-chart chart-two" />
      <span className="dash-pin" />
    </>
  );
}

function MedicalSketch() {
  return (
    <>
      <span className="medical-note note-left" />
      <span className="medical-note note-right" />
      <span className="profile-head" />
      <span className="profile-neck" />
      <span className="brain-loop loop-one" />
      <span className="brain-loop loop-two" />
      <span className="brain-stem" />
    </>
  );
}

function NeuralSketch() {
  return (
    <>
      {Array.from({ length: 8 }, (_, index) => (
        <span key={index} className={`node n${index + 1}`} />
      ))}
    </>
  );
}
