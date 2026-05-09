# Sketchbook Scroll-Telling Portfolio

A complete static website codebase for a hand-drawn, sketchbook-style Software Engineer portfolio. It uses the separated SVG/PNG assets generated from the design sheet and avatar package.

## What is included

- `index.html` - complete single-page portfolio
- `css/styles.css` - design system, layout, responsive styling, animation states
- `js/main.js` - scroll-telling state changes, active navigation, cursor-reactive motion, hover tilt
- `assets/avatars/` - separated avatar illustrations with transparent PNG backgrounds
- `assets/artifacts/` - all deconstructed icons, doodles, UI elements, cards, textures, typography, nav tabs, and source crops
- `docs/implementation-notes.md` - developer notes and customization guidance

## Run locally

Open `index.html` directly in a browser, or run a local static server:

```bash
npm run build
python scripts/dev_server.py --port 5173
```

Then visit:

```text
http://localhost:5173
```

You can also use the npm script:

```bash
npm run dev
```

No package installation is required.

On macOS or Linux, use `python3 scripts/dev_server.py --port 5173` if `python` is not available.

## Validate changes

Before opening a pull request or pushing to `main`, run:

```bash
npm run check
```

This regenerates the public site config and verifies the local Python dev server parses correctly.

## Public contact configuration

Direct contact details and social URLs are generated into `js/site-config.js` from environment variables. That generated file is ignored by Git so personal details do not live in repository source.

Copy `.env.example` to your local environment or set these values in your hosting provider:

- `PUBLIC_SITE_DISPLAY_NAME`
- `PUBLIC_SITE_TITLE`
- `PUBLIC_SITE_DESCRIPTION`
- `PUBLIC_GITHUB_URL`
- `PUBLIC_LINKEDIN_URL`
- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_CONTACT_PHONE`
- `PUBLIC_CONTACT_FORM_ENDPOINT`
- `PUBLIC_CONTACT_FORM_METHOD`

These values are intentionally prefixed with `PUBLIC_`: if they appear on the deployed static website, visitors can inspect them in the browser. Use a form endpoint or serverless function if you need to receive messages without publishing an email address.

For Vercel or Netlify, use:

- Build command: `npm run build`
- Publish/output directory: `.`

## GitHub workflow

This repo includes GitHub Actions CI, Dependabot, pull request templates, and issue templates.

- CI runs `npm run check` on pushes to `main` and pull requests into `main`.
- Dependabot checks monthly and groups GitHub Actions updates into one pull request.
- Use pull requests for focused changes and include screenshots for visual updates.

See `docs/github-workflow.md` for branch protection, secrets, and release guidance.

## Customize

Edit project details and section copy in `index.html`. Keep contact/social values in environment variables. Update animation behavior in `js/main.js`. Update visual tokens in `css/styles.css` under the `:root` block.
