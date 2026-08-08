# GitHub Workflow

This repository is a Next.js App Router portfolio. Every change must install from the lockfile, pass TypeScript validation, produce a successful production build, and pass the browser smoke suite.

## Daily Development

1. Create a branch from `main`.
2. Make focused changes.
3. Run `npm run check` and `npm run test:e2e`.
4. Open a pull request into `main`.
5. Include screenshots for visual or responsive changes.

## CI

The CI workflow lives in `.github/workflows/ci.yml`.

It runs on:

- pushes to `main`
- pull requests targeting `main`
- manual workflow dispatch

The validation job:

- checks out the repository
- configures Node.js 20 with the npm cache
- installs dependencies with `npm ci`
- runs `npm run check`
- installs Chromium for Playwright
- runs `npm run test:e2e`

## Dependency Updates

Dependabot is configured in `.github/dependabot.yml` for:

- GitHub Actions updates

It checks monthly and groups all GitHub Actions updates into one pull request to avoid noisy one-line PRs.

## Recommended Branch Protection

Enable these in GitHub repository settings for `main`:

- Require a pull request before merging
- Require status checks to pass before merging
- Select the `Build and Validate` status check
- Require branches to be up to date before merging
- Block force pushes
- Block deletions

These are GitHub repository settings, not files that can be fully enforced from the codebase.

## Secrets

Do not commit `.env`, personal emails, phone numbers, API tokens, or deployment tokens.

Use GitHub repository secrets for CI/CD secrets and hosting-provider environment variables for public site config. The `PUBLIC_*` values are browser-visible configuration, not a place for private credentials.

## Releases

For meaningful milestones:

1. Update `CHANGELOG.md`.
2. Merge through a pull request.
3. Tag the commit, for example `v1.1.0`.
4. Create a GitHub Release from the tag.
