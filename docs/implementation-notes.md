# Implementation Notes

## Migration boundary

The Next.js app owns `/`. The original static portfolio remains available under `/legacy/` so visual parity can be checked without restoring old source files. `src/app/legacy/page.tsx` redirects that route to the snapshot at `public/legacy/index.html`. The migration preserves every original section and keeps visible content as HTML/JSX.

The root `index.html`, `css/`, `js/`, `src/content/portfolio.ts`, and `scripts/build-site-config.mjs` are retained as historical migration source. They are not imported by the Next.js app and do not automatically update `public/legacy/`.

## Component and content structure

`PortfolioShell` composes the notebook rail, top bar, progress rail, reactive avatar, page sections, and footer. Each section is an isolated React component under `src/components/portfolio/`. Typed files under `src/data/` are the canonical content source for `/`; components do not duplicate that content.

Global design tokens and the legacy-derived sketch treatments live in `src/app/globals.css`. Tailwind is available for composition, while custom CSS preserves paper textures, imperfect borders, tape, tabs, sticky notes, and the road scene.

`src/app/layout.tsx` loads Kalam, Patrick Hand, Patrick Hand SC, Permanent Marker, Bangers, Comic Neue, Reenie Beanie, Space Grotesk, and Inter through `next/font`. Components consume the semantic font tokens defined in `globals.css` rather than importing fonts themselves.

## Interaction ownership

Motion handles component reveals and micro-interactions. Pointer movement updates `--cursor-x` and `--cursor-y` for decorative reactions. GSAP ScrollTrigger is confined to `ExperienceJourneySection`, where it owns the optional wide-screen scroll narrative.

The experience road combines one bitmap illustration with one SVG reveal window. GSAP expands the window from top to bottom with a hard, flat growth front and no low-opacity preview. Because the reveal spans the raster's full width, wide bends and their numbered stations cannot be trimmed by a narrow path mask, and nearby future bends cannot bleed through early. The decorative raster stays hidden until hydration to prevent a completed-road flash before GSAP establishes the 0% state; the semantic chronology remains complete without JavaScript. The hand-drawn road therefore reads as one artifact being constructed by scroll rather than uncovered by a circular spotlight. Mobile uses normal flow rather than a pinned scene.

Lenis is initialized only after hydration and is disabled for reduced-motion users. Its scroll callback calls `ScrollTrigger.update()` so smooth scrolling and the GSAP timeline remain synchronized.

The experience preference defaults to the operating-system setting. `?motion=full`, `?motion=reduce`, and `?motion=system` provide deterministic QA overrides. The persistent in-page control switches only the Experience story between full and reduced motion and reports its state with `aria-pressed`.

## Living Systems Road

The Professional Experience section uses progressive enhancement. Its default HTML and CSS are a complete chronological document: every role exposes its date, organization, role, truthful metric, impact, technologies, and takeaway. The overlapping May 2025 roles remain truthful through their visible date ranges without adding a second road, branch, or ambiguous “parallel work” annotation. The route and four small system diagrams are decorative equivalents of adjacent text, not alternate sources of meaning.

At viewports of at least `1200px × 860px`, and only when reduced motion is not active, GSAP enhances the section into a single pinned story. Its labeled sequence is `intro → nic → sndl → un → hive → synthesis`; the scroll distance is derived from viewport height and clamped between 3400px and 4600px. The route, active evidence, and active station are the only simultaneous motion groups. Timeline progress updates `data-active-chapter` only when a chapter boundary changes.

Below that wide-canvas threshold, the same content stays in natural flow: two columns where space permits and one column on compact screens. There is no tablet/mobile pin, scrub, parallax, or synthetic section height. Reduced motion also uses this completed, unpinned chronology. If JavaScript or GSAP initialization fails, the static-first DOM remains readable.

The route is the section's single signature element. One opaque road grows continuously from an empty origin to the completed synthesis—public systems → reliable infrastructure → trusted data → human-centered research tooling. The raster already contains its lane markings, so no duplicate centerline is drawn. Future stations remain hidden until the road reaches them, and the HIVE stop sits on the lower trunk instead of a separate branch. GSAP owns scroll sequencing, CSS owns passive surface treatment, and the existing Lenis provider remains the sole smooth-scroll clock.

Verification covers full content and semantic availability, a visually empty 0% road mask, one masked artifact with no ghost/branch/duplicate centerline, partial and complete growth checkpoints, hidden future stations, one 1440×900 desktop pin, four active chapters and synthesis, 1280×800 and 1024/900/899/390 natural layouts, horizontal overflow and chapter intersection, system reduced motion, no-JavaScript content, and keyboard operation of the motion preference control.

## Reduced motion

`MotionConfig` respects the operating-system preference. When reduced motion is active, Lenis is not mounted, the GSAP timeline and pin are skipped, and all experience stops are rendered visible. Native scrolling remains available throughout the page.

## Runtime configuration

`src/data/site.ts` reads the browser-visible `PUBLIC_*` values documented in `.env.example`. A missing `PUBLIC_CONTACT_FORM_ENDPOINT` disables form submission. When configured, the browser submits the form directly to that endpoint, so validation, spam protection, and privacy controls belong to the receiving service.

Google Analytics is rendered from `src/app/layout.tsx` with `@next/third-parties/google`. Its current measurement ID is set directly in that file; no analytics environment variable is read.

## Assets

The Next.js app serves the preserved SVG and PNG artwork from `public/assets/`. `src/data/assets.ts` gives used files semantic names. The generated Experience road and project-card composite assets also live there. The complete inventory is documented in `docs/asset-inventory.md`.
