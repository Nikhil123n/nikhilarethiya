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

Requires Node.js `20.9.0` or newer.

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

Install the Chromium test browser once on a new machine:

```bash
npx playwright install --with-deps chromium
```

Then run:

```bash
npm run typecheck
npm run build
npm run test:e2e
```

`npm run check` runs typechecking and the production build. The Playwright suite starts the development server on port `3100` locally; CI uses the production build with `next start`. It verifies the migrated sections, reduced-motion experience, mobile road containment, contact constraints, and `/legacy/` fallback in Chromium.

## Architecture

- `src/app/` owns the App Router entry points, metadata, fonts, and global sketchbook design tokens.
- `src/components/portfolio/` contains the reusable section and interaction components.
- `src/data/` contains typed, serializable portfolio content and semantic asset aliases.
- `tests/e2e/` contains the Playwright browser smoke suite.
- `public/assets/` contains the artwork used by the Next.js app.
- `public/legacy/` contains the preserved static portfolio for parity checks and rollback.
- `docs/asset-inventory.md` records the migrated asset taxonomy and app usage.

The portfolio still includes Home, About, Toolkit/Skills, Featured Projects, Professional Experience, Education, Contact, the notebook navigation rail, scene avatar, progress rail, and footer. No legacy section was removed during the migration.

## Edit Content

Content for the Next.js site at `/` is split by section under `src/data/`:

- `site.ts` - display name, metadata, social/contact values from `PUBLIC_*` env vars
- `nav.ts` - notebook navigation and scene avatar captions
- `projects.ts` - featured project cards
- `skills.ts` - toolkit groups and certifications
- `education.ts` - education history
- `experience.ts` - scroll-driven professional journey entries
- `assets.ts` - semantic aliases for reused public assets

All visible text is HTML/JSX text, not generated image text.

The root static files (`index.html`, `css/`, `js/`, `src/content/portfolio.ts`, and `scripts/build-site-config.mjs`) are retained migration source and are not imported by the Next.js app. The deployed parity copy is the snapshot under `public/legacy/`; it does not synchronize automatically with either `src/data/` or the root static source.

## Configuration

Copy `.env.example` to `.env.local` for local overrides, or set the same variables in Vercel:

- `PUBLIC_SITE_DISPLAY_NAME`, `PUBLIC_SITE_TITLE`, and `PUBLIC_SITE_DESCRIPTION` control identity and metadata.
- `PUBLIC_GITHUB_URL`, `PUBLIC_LINKEDIN_URL`, `PUBLIC_CONTACT_EMAIL`, and `PUBLIC_CONTACT_PHONE` control public links and contact details.
- `PUBLIC_CONTACT_FORM_ENDPOINT` enables the contact submit button. When blank, the button remains disabled.
- `PUBLIC_CONTACT_FORM_METHOD` accepts `get` or `post`; every other value falls back to `post`.

The contact form submits `name`, `email`, and `message` directly from the browser to the configured endpoint. That endpoint is responsible for server-side validation, spam protection, request handling, and applicable privacy controls. Every `PUBLIC_*` value is browser-visible and must not contain secrets.

Google Analytics is enabled independently in `src/app/layout.tsx` through `@next/third-parties/google` with measurement ID `G-JG1Z97Y7FE`. The ID is public configuration; edit or remove the `GoogleAnalytics` component there to change or disable analytics. The app does not currently read a Google Analytics environment variable.

## Animation Responsibilities

- Motion handles section reveals, controls, avatar movement, and small component interactions.
- GSAP ScrollTrigger owns only the Professional Experience chapter: desktop pinning, scrubbed road drawing, stop reveals, map pins, organization marks, and decorative parallax.
- Lenis provides smooth scrolling after hydration and forwards scroll updates to ScrollTrigger.
- Motion and GSAP do not control the same property on the same experience element.

The experience journey uses the illustrated road in `public/assets/artifacts/experience-road/` with an SVG path overlay that reveals it as the page scrolls. Desktop uses a pinned stage; mobile renders a readable stacked journey without pinning.

With `prefers-reduced-motion: reduce`, Motion interactions settle immediately, Lenis is skipped, ScrollTrigger pinning is not created, and the complete road and experience content remain visible in normal document flow. For QA, `?motion=full`, `?motion=reduce`, or `?motion=system` overrides the experience preference. The in-page toggle appears only when reduced motion is active or explicitly forced, allowing the journey to be played without changing the operating-system setting.

## Assets

Original assets remain in `assets/` and are copied into `public/assets/` for Next.js serving. `public/assets/` also contains the generated road candidates used during the experience migration. See `docs/asset-inventory.md` for counts and semantic usage notes.

## Deployment

The repository is configured for Vercel as a Next.js project. CI runs `npm ci`, `npm run check`, and the Playwright browser smoke suite for pull requests and pushes to `main`.
