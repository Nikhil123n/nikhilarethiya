# Using These Assets in a Website

Recommended usage pattern:

```html
<img src="03-icons-doodles/svg/lightbulb.svg" alt="Idea" class="doodle-icon" />
<img src="04-hand-drawn-ui-elements/svg/sticky-note-blank.svg" alt="Sticky note" class="sticky-note" />
<img src="09-buttons-nav-tabs/svg/nav-tab-projects.svg" alt="Projects tab" />
```

Suggested CSS:

```css
:root {
  --paper: #F8F2E7;
  --ink: #242423;
  --blue: #2B7FFB;
  --red: #E55539;
  --green: #1BAB72;
  --orange: #F1A108;
  --yellow-note: #F6D982;
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: Inter, system-ui, sans-serif;
}

.doodle-icon {
  width: 48px;
  height: 48px;
  color: var(--ink);
}

.sketch-card {
  background: #FAF6EE;
  border: 2px solid var(--ink);
  box-shadow: 4px 4px 0 #E7DCC8;
  transform: rotate(-0.5deg);
}
```
