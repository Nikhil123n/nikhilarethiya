import type { ExperienceStoryVisual } from "@/data";

type ExperienceStoryDiagramProps = {
  visual: ExperienceStoryVisual;
};

export function ExperienceStoryDiagram({ visual }: ExperienceStoryDiagramProps) {
  return (
    <svg
      className="experience-story-diagram"
      data-story-visual={visual}
      viewBox="0 0 180 108"
      aria-hidden="true"
      focusable="false"
    >
      {visual === "civic-grid" && (
        <>
          <g data-diagram-part="network" className="experience-diagram-ink">
            <path d="M24 27H76M104 27h52M24 80h52M104 80h52M50 27v53M130 27v53M50 54h80" />
          </g>
          <g data-diagram-part="nodes" className="experience-diagram-nodes">
            <circle cx="24" cy="27" r="5" />
            <circle cx="76" cy="27" r="5" />
            <circle cx="104" cy="27" r="5" />
            <circle cx="156" cy="27" r="5" />
            <circle cx="24" cy="80" r="5" />
            <circle cx="76" cy="80" r="5" />
            <circle cx="104" cy="80" r="5" />
            <circle cx="156" cy="80" r="5" />
          </g>
        </>
      )}

      {visual === "neural-pipeline" && (
        <>
          <g data-diagram-part="pipeline" className="experience-diagram-ink">
            <path d="M20 54h30M70 54h40M130 54h30" />
            <path d="m44 47 8 7-8 7M104 47l8 7-8 7M154 47l8 7-8 7" />
          </g>
          <g data-diagram-part="nodes" className="experience-diagram-nodes">
            <rect x="12" y="39" width="30" height="30" rx="7" />
            <rect x="54" y="32" width="42" height="44" rx="9" />
            <rect x="112" y="37" width="38" height="34" rx="8" />
            <circle cx="77" cy="54" r="5" />
            <circle cx="131" cy="54" r="5" />
          </g>
        </>
      )}

      {visual === "validation-ledger" && (
        <>
          <g data-diagram-part="ledger" className="experience-diagram-ink">
            <path d="M30 22h78v64H30zM43 39h40M43 52h52M43 65h34" />
          </g>
          <g data-diagram-part="approval" className="experience-diagram-accent">
            <circle cx="126" cy="62" r="28" />
            <path d="m112 62 10 10 19-23" />
          </g>
        </>
      )}

      {visual === "glucose-wave" && (
        <>
          <g data-diagram-part="dashboard" className="experience-diagram-ink">
            <path d="M18 25h144v58H18zM31 69h24M31 40h42" />
          </g>
          <g data-diagram-part="signal" className="experience-diagram-accent">
            <path d="M31 59c12 0 11-18 22-18s11 31 23 31 12-39 24-39 11 27 23 27 12-13 26-13" />
          </g>
        </>
      )}
    </svg>
  );
}
