# Implementation Notes

## Design direction

This website follows the hand-drawn sketchbook direction from the provided reference: paper background, left notebook tabs, hand-drawn icons, sticky notes, doodles, taped cards, colored annotations, and separated avatar reactions.

## Scroll-telling behavior

Each major section uses a `data-scene` attribute. `js/main.js` observes those sections and updates:

- the active left-side navigation tab
- the scroll progress rail
- the floating avatar reaction card
- the current scene label and caption

## Cursor behavior

The root element receives `--cursor-x` and `--cursor-y` CSS variables as the pointer moves. Decorative doodles and the hero desk illustration respond to these values for a subtle reactive feel.

## Assets

The website uses scalable SVGs for icons, doodles, tech badges, UI marks, textures, nav tabs, and decorative elements. Avatar illustrations are PNG exports with transparent backgrounds.

## Performance

The page is dependency-free. Images are lazy-loaded where possible. Motion respects `prefers-reduced-motion`.
