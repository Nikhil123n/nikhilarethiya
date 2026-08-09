# Implementation Notes

## Migration boundary

The Next.js app owns `/`. The original static portfolio remains available under `/legacy/` so visual parity can be checked without restoring old source files. `src/app/legacy/page.tsx` redirects that route to the snapshot at `public/legacy/index.html`. The migration preserves every original section and keeps visible content as HTML/JSX.

The root `index.html`, `css/`, `js/`, `src/content/portfolio.ts`, and `scripts/build-site-config.mjs` are retained as historical migration source. They are not imported by the Next.js app and do not automatically update `public/legacy/`.

## Component and content structure

`PortfolioShell` composes the notebook rail, top bar, progress rail, reactive avatar, page sections, and footer. Each section is an isolated React component under `src/components/portfolio/`. Typed files under `src/data/` are the canonical content source for `/`; components do not duplicate that content.

Global design tokens and the legacy-derived sketch treatments live in `src/app/globals.css`. Tailwind is available for composition, while custom CSS preserves paper textures, imperfect borders, tape, tabs, sticky notes, and the road scene.

`src/app/layout.tsx` loads Kalam, Patrick Hand, Patrick Hand SC, Permanent Marker, Bangers, Comic Neue, Reenie Beanie, Space Grotesk, and Inter through `next/font`. Components consume the semantic font tokens defined in `globals.css` rather than importing fonts themselves.

## Interaction ownership

Motion handles component reveals and micro-interactions. Pointer movement updates `--cursor-x` and `--cursor-y` for decorative reactions. GSAP ScrollTrigger is confined to `ExperienceJourneySection`, where it pins the desktop stage, scrubs the road reveal, and sequences stops, pins, organization marks, and background doodles.

The experience road combines a bitmap illustration with a matching SVG reveal path. This keeps the hand-drawn road visually rich while preserving deterministic scroll progress. Mobile uses normal flow rather than a pinned scene.

Lenis is initialized only after hydration and is disabled for reduced-motion users. Its scroll callback calls `ScrollTrigger.update()` so smooth scrolling and the GSAP timeline remain synchronized.

The experience preference defaults to the operating-system setting. `?motion=full`, `?motion=reduce`, and `?motion=system` provide deterministic QA overrides. The in-page motion button is intentionally rendered only when reduced motion is active or forced.

## Reduced motion

`MotionConfig` respects the operating-system preference. When reduced motion is active, Lenis is not mounted, the GSAP timeline and pin are skipped, and all experience stops are rendered visible. Native scrolling remains available throughout the page.

## Runtime configuration

`src/data/site.ts` reads the browser-visible `PUBLIC_*` values documented in `.env.example`. A missing `PUBLIC_CONTACT_FORM_ENDPOINT` disables form submission. When configured, the browser submits the form directly to that endpoint, so validation, spam protection, and privacy controls belong to the receiving service.

Google Analytics is rendered from `src/app/layout.tsx` with `@next/third-parties/google`. Its current measurement ID is set directly in that file; no analytics environment variable is read.

## Assets

The Next.js app serves the preserved SVG and PNG artwork from `public/assets/`. `src/data/assets.ts` gives used files semantic names. The generated Experience road and project-card composite assets also live there. The complete inventory is documented in `docs/asset-inventory.md`.
