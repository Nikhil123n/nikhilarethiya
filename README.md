# Sketchbook Scroll-Telling Portfolio

A premium Next.js App Router portfolio migrated from the original static sketchbook site. The new app keeps the paper background, spiral notebook navigation, hand-drawn cards, tape, sticky notes, sketch fonts, project cards, education, skills, contact, and avatar reactions while moving the implementation to React components and typed content files.

The previous static site is preserved at `/legacy/` for rollback and visual parity checks.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- CSS variables for sketchbook design tokens
- `next/font` for the sketch font stack
- `next/image` for local image assets
- Motion for component reveals and micro-interactions
- GSAP ScrollTrigger for the Professional Experience journey

## Run Locally

```bash
npm install
npm run dev
```

Then visit:

```text
http://localhost:3000
```

Legacy static parity copy:

```text
http://localhost:3000/legacy/
```

## Validate

```bash
npm run typecheck
npm run build
npm run test:e2e
```

`npm run check` runs typechecking and the production build. The Playwright suite starts the app on port `3100` and verifies the migrated sections, reduced-motion experience, mobile road containment, contact constraints, and `/legacy/` fallback in Chromium.

## Architecture

- `src/app/` owns the App Router entry points, metadata, fonts, and global sketchbook design tokens.
- `src/components/portfolio/` contains the reusable section and interaction components.
- `src/data/` contains typed, serializable portfolio content and semantic asset aliases.
- `public/assets/` contains the artwork used by the Next.js app.
- `public/legacy/` contains the preserved static portfolio for parity checks and rollback.
- `docs/asset-inventory.md` records the migrated asset taxonomy and app usage.

The portfolio still includes Home, About, Toolkit/Skills, Featured Projects, Professional Experience, Education, Contact, the notebook navigation rail, scene avatar, progress rail, and footer. No legacy section was removed during the migration.

## Edit Content

Content is split by section under `src/data/`:

- `site.ts` - display name, metadata, social/contact values from `PUBLIC_*` env vars
- `nav.ts` - notebook navigation and scene avatar captions
- `projects.ts` - featured project cards
- `skills.ts` - toolkit groups and certifications
- `education.ts` - education history
- `experience.ts` - scroll-driven professional journey entries
- `assets.ts` - semantic aliases for reused public assets

All visible text is HTML/JSX text, not generated image text.

Environment-specific contact and social values use the `PUBLIC_*` variables listed in `.env.example`. These values are rendered in the browser and must not contain secrets.

## Animation Responsibilities

- Motion handles section reveals, controls, avatar movement, and small component interactions.
- GSAP ScrollTrigger owns only the Professional Experience chapter: desktop pinning, scrubbed road drawing, stop reveals, map pins, organization marks, and decorative parallax.
- Lenis provides smooth scrolling after hydration and forwards scroll updates to ScrollTrigger.
- Motion and GSAP do not control the same property on the same experience element.

The experience journey uses the illustrated road in `public/assets/artifacts/experience-road/` with an SVG path overlay that reveals it as the page scrolls. Desktop uses a pinned stage; mobile renders a readable stacked journey without pinning.

With `prefers-reduced-motion: reduce`, Motion interactions settle immediately, Lenis is skipped, ScrollTrigger pinning is not created, and the complete road and experience content remain visible in normal document flow. The experience section also includes a local motion toggle for testing and user control.

## Assets

Original assets remain in `assets/` and are copied into `public/assets/` for Next.js serving. See `docs/asset-inventory.md` for the asset inventory and semantic usage notes.

## Deployment

The repository is configured for Vercel as a Next.js project. CI runs `npm ci`, `npm run check`, and the Playwright browser smoke suite for pull requests and pushes to `main`.
