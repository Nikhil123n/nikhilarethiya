# Implementation Notes

## Migration boundary

The Next.js app owns `/`. The original static portfolio remains available under `/legacy/` so visual parity can be checked without restoring old source files. The migration preserves every original section and keeps visible content as HTML/JSX.

## Component and content structure

`PortfolioShell` composes the notebook rail, top bar, progress rail, reactive avatar, page sections, and footer. Each section is an isolated React component under `src/components/portfolio/`. Editable portfolio copy lives in typed files under `src/data/`; components do not duplicate section content.

Global design tokens and the legacy-derived sketch treatments live in `src/app/globals.css`. Tailwind is available for composition, while custom CSS preserves paper textures, imperfect borders, tape, tabs, sticky notes, and the road scene.

## Interaction ownership

Motion handles component reveals and micro-interactions. Pointer movement updates `--cursor-x` and `--cursor-y` for decorative reactions. GSAP ScrollTrigger is confined to `ExperienceJourneySection`, where it pins the desktop stage, scrubs the road reveal, and sequences stops, pins, organization marks, and background doodles.

The experience road combines a bitmap illustration with a matching SVG reveal path. This keeps the hand-drawn road visually rich while preserving deterministic scroll progress. Mobile uses normal flow rather than a pinned scene.

Lenis is initialized only after hydration and is disabled for reduced-motion users. Its scroll callback calls `ScrollTrigger.update()` so smooth scrolling and the GSAP timeline remain synchronized.

## Reduced motion

`MotionConfig` respects the operating-system preference. When reduced motion is active, Lenis is not mounted, the GSAP timeline and pin are skipped, and all experience stops are rendered visible. Native scrolling remains available throughout the page.

## Assets

The Next.js app serves the preserved SVG and PNG artwork from `public/assets/`. `src/data/assets.ts` gives used files semantic names. The complete inventory is documented in `docs/asset-inventory.md`.
