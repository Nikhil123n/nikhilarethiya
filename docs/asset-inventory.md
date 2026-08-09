# Asset Inventory

This migration preserves the original static portfolio assets and copies them into `public/assets` for the Next.js app. The original `assets/` directory remains in place for source history and visual parity checks.

## Summary

| Type | Count |
| --- | ---: |
| PNG | 298 |
| SVG | 166 |
| JPG | 8 |
| JSON | 3 |
| Markdown | 2 |
| HTML | 2 |
| CSS | 2 |
| CSV | 1 |

## Primary Asset Groups

- `avatars/` contains the seven transparent avatar illustrations plus the avatar contact sheet and manifest.
- `artifacts/01-homepage-layout/` contains separated homepage source crops, transparent PNGs, and recreated tech SVGs.
- `artifacts/03-icons-doodles/` contains the hand-drawn icons, contact icons, education doodles, arrows, scribbles, and tech icon exports.
- `artifacts/04-hand-drawn-ui-elements/` contains tape, sticky notes, paper clips, pushpins, buttons, bubbles, paper, and arrows.
- `artifacts/05-typography/` contains the wordmark and typography specimen assets.
- `artifacts/06-color-palette/` contains palette swatches and token files.
- `artifacts/07-ui-cards-components/` contains project card, skill badge, section title, checklist, and step-box templates.
- `artifacts/08-textures-background/` contains paper, notebook, grid, graphite, watercolor, torn paper, binding, and tape textures.
- `artifacts/09-buttons-nav-tabs/` contains hand-drawn nav tab and button exports.
- `artifacts/09-toolkit-strip-icons/toolkit-icons.svg` is used as the SVG symbol sprite for the toolkit section.
- `artifacts/10-certifications-card/` contains the certification card base.
- `artifacts/experience-road/` contains the selected Experience road, reference image, and generated road candidates.
- `artifacts/featured-projects-reference/` contains project-card visual references.
- `artifacts/project-card/` contains the composite paper card, tape, paperclip, tag frame, and title-ray assets used by Featured Projects.
- `artifacts/preview-contact-sheets/` contains visual contact sheets for the separated asset batches.

## Semantic App Usage

The Next.js app references used assets through `src/data/assets.ts`. This provides semantic aliases for:

- avatars used by section state and hero/contact scenes
- paper textures, tape, and section dividers
- doodle icons for stats, contact, education, nav, and hero accents
- project-card paper, tape, paperclip, tag, and title-ray assets
- the toolkit SVG sprite

Keeping the full taxonomy in `public/assets` preserves source context, while semantic aliases keep component code readable. The original `assets/` tree contains 283 PNG files; the 15 additional PNGs in `public/assets/` are the selected Experience road and its generated candidates.

The selected road path is referenced directly by `ExperienceJourneySection.tsx`; the remaining files under `artifacts/experience-road/candidates/` are retained visual alternatives.

## Legacy Copy

The previous static site is preserved under `public/legacy/` with the same relative structure. Ignored/private generated config is not copied; `public/legacy/js/site-config.js` contains blank public contact values, and `public/legacy/js/portfolio-content.js` contains non-secret project content.
