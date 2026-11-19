# Motion Ownership Contract

## Single owner per behavior

Assign each behavior to exactly one system:

- **GSAP** owns the Professional Experience scroll timeline: ScrollTrigger progress, pinning, road drawing, chapter sequencing, and progress-bound transitions.
- **Motion** owns local component-state and gesture microinteractions that are independent of the scroll timeline.
- **CSS** owns passive effects: hover and focus transitions, simple state styling, and non-orchestrated ambient details.
- **Lenis** owns the scroll clock. Integrate other systems with that clock; do not introduce a second smooth-scroll controller.

Never let two systems animate the same property on the same element. Document ownership when a component contains more than one animation system.

## Scroll behavior

- Use scrubbed timelines only when progress communicates narrative position.
- Do not hijack wheel or touch input, force scroll snapping, or trap users in the section.
- Keep a clear entrance, four readable experience beats, and an intentional exit state.
- Recalculate geometry at responsive changes and clean up triggers on resize, unmount, and navigation.
- Use GSAP React context or equivalent scoped cleanup for component-owned animations.

## Responsive contract

- At `900px` and wider, the approved concept may use a pinned scrollytelling layout.
- At `899px` and narrower, use a natural document-flow chronology without pinning or a synthetic scroll distance.
- Treat both sides of the boundary as first-class layouts; do not merely shrink the desktop canvas.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- disable pinning, scrubbing, parallax, and long spatial transitions
- render all experience content in normal reading order
- avoid pin spacers and content whose visibility depends on timeline progress
- retain keyboard focus, active-state meaning, and clear chronology
- use instant state changes or brief opacity changes only when needed for comprehension

## Performance contract

- Prefer transforms and opacity for animated visual movement.
- Avoid per-frame layout reads and writes, especially mixed measurement and mutation.
- Keep `will-change` temporary and narrowly scoped.
- Do not animate large filters, shadows, masks, or background blurs continuously.
- Batch measurements, cache stable geometry, and invalidate deliberately.
- Keep the signature element lightweight; do not add a 3D runtime or animation dependency without approval.

Follow current Next.js guidance in the repository's installed documentation before changing framework-sensitive code.
