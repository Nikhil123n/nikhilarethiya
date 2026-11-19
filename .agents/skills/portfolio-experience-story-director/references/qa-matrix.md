# Professional Experience QA Matrix

## Viewports

Verify at minimum:

| Class | Viewport | Expected presentation |
| --- | --- | --- |
| Desktop | 1440 x 900 | Full approved scroll story |
| Compact desktop | 1024 x 768 | Complete story without clipping |
| Desktop boundary | 900px wide | Desktop contract remains coherent |
| Mobile boundary | 899px wide | Natural-flow mobile chronology |
| Mobile | 390 x 844 | Readable stacked story with no overflow |

## Scroll checkpoints

Capture or inspect approximately 0%, 20%, 40%, 60%, 80%, and 100% of the section's progress. At every checkpoint verify:

- the intended stop is the clear focal point
- role, organization, impact, and chronology remain legible
- preceding content recedes without disappearing prematurely
- road, labels, callouts, and focus rings are not clipped
- no horizontal page overflow is introduced
- the final state releases cleanly into the next section

## Interaction and accessibility

- All controls and links work by keyboard and expose a visible focus state.
- DOM and reading order remain chronological and sensible.
- Meaning is not conveyed only by color, position, or animation.
- Decorative SVG and canvas content is hidden appropriately; meaningful diagrams have accessible text equivalents.
- At 200% zoom, essential content remains available without two-dimensional scrolling.

## Reduced motion

- All four experience entries are visible in normal reading order.
- No pinning, scrubbing, parallax, or synthetic pin spacer remains.
- Content is never initialized hidden while waiting for a timeline.
- Keyboard behavior and focus visibility match the default experience.
- Any in-product motion preference can be changed by keyboard and agrees with the system preference behavior.

## Performance and cleanup

- Record a Chrome performance trace for a full pass through the section.
- Check for unexpected layout shifts, long animation frames, repeated forced layout, and excessive paint area.
- Confirm ScrollTriggers, observers, listeners, animation frames, and Lenis integrations are cleaned up on resize, unmount, and navigation.
- Confirm inactive animation work stops when the section is offscreen.
- Confirm the section remains readable if animation initialization fails.

## Automated evidence

- Run relevant unit or component tests when present.
- Run the Professional Experience Playwright flow at desktop, the `900px`/`899px` boundary, mobile, and reduced motion.
- Add regression coverage before fixing a reproducible behavior when practical.
- Keep visual screenshots deterministic and review differences rather than updating snapshots blindly.
