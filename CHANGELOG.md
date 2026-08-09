# Changelog

All notable changes to this portfolio are tracked here.

## Unreleased

- Migrated the portfolio root to Next.js App Router, React, TypeScript, and Tailwind CSS while preserving the static site at `/legacy/`.
- Rebuilt Home, About, Toolkit, Projects, Experience, Education, Contact, navigation, progress, avatar, and footer as reusable components backed by typed data files.
- Added Motion micro-interactions, Lenis smooth scrolling, and a reduced-motion-safe GSAP ScrollTrigger Professional Experience road journey.
- Preserved and inventoried the sketchbook artwork under `public/assets/` with semantic aliases for app usage.
- Updated CI to install lockfile dependencies, typecheck, build, and run Playwright browser smoke tests for the Next.js application.
- Added Dependabot configuration for monthly GitHub Actions updates.
- Added pull request and issue templates.
- Documented the recommended GitHub workflow, branch protection, secrets, and release process.
- Reduced Dependabot noise by grouping GitHub Actions updates into one monthly pull request.
