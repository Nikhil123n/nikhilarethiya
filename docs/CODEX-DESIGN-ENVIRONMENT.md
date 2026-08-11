# Repository-scoped design and motion environment

This repository carries a reviewable Codex environment for the Professional Experience road. It adds design, animation, accessibility, platform-guidance, and documentation capabilities without changing the application, npm dependencies, user-level Codex configuration, `.claude`, `.cursor`, or `.mcp.json`.

## Installed skills

All skills live under `.agents/skills` and remain pinned until a deliberate review upgrades them.

| Local skill | Upstream repository or source | Reviewed revision | Local adaptation |
| --- | --- | --- | --- |
| `portfolio-experience-story-director` | Repository-authored | 2026-08-09 | Custom narrative gate, art direction, motion ownership, and QA matrix. |
| `gsap-core` | `greensock/gsap-skills` | `aed9cfd3277740755f6bfc1155c7aa645403b760` | None. |
| `gsap-timeline` | `greensock/gsap-skills` | `aed9cfd3277740755f6bfc1155c7aa645403b760` | None. |
| `gsap-scrolltrigger` | `greensock/gsap-skills` | `aed9cfd3277740755f6bfc1155c7aa645403b760` | None. |
| `gsap-react` | `greensock/gsap-skills` | `aed9cfd3277740755f6bfc1155c7aa645403b760` | None. |
| `gsap-performance` | `greensock/gsap-skills` | `aed9cfd3277740755f6bfc1155c7aa645403b760` | None. |
| `motion-design` | `LottieFiles/motion-design-skill` | `f9a8a041b85185ee4881b3471d3415e939aac772` | None. |
| `modern-web-guidance` | `GoogleChrome/modern-web-guidance` | `684ab9d7c6b78fc2cd5677912d874397cb2e5dfa` | Runtime commands and bundled cross-references pin `modern-web-guidance@0.0.180`; executable commands use `npx.cmd` on Windows and set `DISABLE_TELEMETRY=1` in the child process for every query. |
| `better-ui` | `jakubkrehel/skills` | `d01493b0a7b976a74bfcedc80c783d60c7995910` | None. |
| `better-layout` | `jakubkrehel/skills` | `d01493b0a7b976a74bfcedc80c783d60c7995910` | None. |
| `better-typography` | `jakubkrehel/skills` | `d01493b0a7b976a74bfcedc80c783d60c7995910` | None. |
| `better-accessibility` | `jakubkrehel/skills` | `d01493b0a7b976a74bfcedc80c783d60c7995910` | None. `better-interface` is intentionally omitted because its coordinating dependencies are not installed. |
| `web-design-guidelines` | `vercel-labs/agent-skills` | `7c180d9044c9ae2b442b567aad4e42a28dd5ed62` | The mutable guidelines URL is replaced with `vercel-labs/web-interface-guidelines` revision `4e799d45c17aec1498c269287a83b9dba22b966b`. |
| `motion` | Identical local snapshots in `.claude/skills/motion` and `.cursor/skills/motion` | Source `SKILL.md` SHA-256 `E9E9B884AFE14B07C3C71FE707A5FA2407B2D645C75686402927496DD7E596F3` | Removed unsupported top-level `argument-hint`, added Codex UI metadata, rewrote routing for the base/free server, and omitted the two Motion+ modules (`performance-audit` and `transition-preview`). No Motion+ behavior or credential flow is enabled. |

The custom director invokes implicitly only for the Professional Experience road and related scroll-story work. Major changes to layout, metaphor, narrative order, pinning, or dependencies must return three materially distinct concepts and pause for approval. Incremental clipping, easing, accessibility, responsive, reduced-motion, cleanup, performance, and regression fixes may proceed directly.

## MCP servers

Project configuration is in `.codex/config.toml`:

| Identifier | Endpoint | Policy |
| --- | --- | --- |
| `context7` | `https://mcp.context7.com/mcp` | Enabled, optional, anonymous, and allowlisted to `resolve-library-id` plus `query-docs`. |
| `motion` | `https://mcp.motion.dev` | Enabled, optional, base/free, and allowlisted to `search-motion-docs` plus `generate-css-easing`. |

No bearer token, API key, OAuth setting, environment credential, or user-level configuration is added. `motion-plus` is deliberately absent. Existing user-level servers continue to merge with this trusted project configuration.

Context7 is supplementary community-contributed documentation. Prefer the framework's installed or official documentation when it conflicts with Context7 or when exact version behavior matters.

## Upgrade procedure

Do not update an imported skill from a branch name or `latest` tag.

1. Choose an immutable upstream commit and record it here.
2. Inspect the complete diff from the current pin, including every script, executable, symlink, network endpoint, tool instruction, and license change.
3. Install the candidate into a temporary clean directory with the Codex Skill Installer; never overwrite the reviewed copy in place.
4. Reapply and re-review the local adaptations documented in the table.
5. Run `quick_validate.py` for every repository skill, inventory file types and links, and repeat the relevant read-only smoke and forward tests.
6. Replace the vendored directory only after the review passes, then update this document with the new pin and adaptations.

For Modern Web Guidance, update the repository revision and the runtime npm version independently and test both. For Vercel guidelines, review and pin the guidelines-content revision separately from the skill revision. For Motion, compare both local source snapshots, retain only base/free routes, and do not add Motion+ without explicit approval.

## Verification expectations

- All 14 skill roots pass the Codex skill validator.
- Skill trees contain reviewed Markdown/YAML resources only, with no executable files or symlinks.
- `.codex/config.toml` parses and `codex mcp list` shows `context7` and `motion` alongside user-level servers.
- `motion-plus` remains absent from the project config and effective MCP list.
- Fresh-task smoke tests cover version-specific Next.js retrieval, anonymous base Motion search, and Modern Web Guidance with telemetry disabled.
- Story-director forward tests cover a major redesign, an incremental reduced-motion or clipping fix, and an unrelated dashboard request.

Repository skills and configuration should be checked into version control deliberately, but this setup process does not stage or commit them automatically.

## Verification record: 2026-08-09

- `quick_validate.py` passed all 14 skill roots under Python UTF-8 mode. The trees contain 203 files, all `.md` or `.yaml`, with no executables, symlinks, or reparse points.
- TOML parsing confirmed only the two intended project MCP entries and their read-only tool allowlists. `codex mcp list` showed `context7` and `motion` alongside the existing `chrome-devtools`, `node_repl`, `github`, `openaiDeveloperDocs`, and `vercel` servers; `motion-plus` was absent.
- An anonymous Context7 MCP handshake, tool listing, `resolve-library-id`, and `query-docs` call succeeded. The installed Next.js version was `16.3.0`, the resolved library was `/vercel/next.js`, and the response confirmed the Next.js 16.3 agent workflow and bundled `node_modules/next/dist/docs/` guidance.
- An anonymous base Motion MCP handshake, `search-motion-docs` call, and resource read succeeded for `motion://docs/react/react-use-scroll`. No credentials or premium server were configured.
- Modern Web Guidance `0.0.180` returned `parallax-scroll-effects`, `scrollytelling`, `scroll-progress-indicator`, `scroll-entry-exit-effects`, and `carousel-slide-effects`. `DISABLE_TELEMETRY` was absent from the parent environment both before and after the child process.
- Three isolated read-only forward tests passed: a major redesign returned three concepts and stopped for approval; clipping plus reduced-motion work was classified incremental with no concept gate; an unrelated analytics dashboard did not activate the custom director.
- A true `codex exec` fresh-task MCP smoke remains blocked by the installed Codex CLI (`0.133.0`): its model catalog is incompatible with the current backend and the process later aborts during startup. The endpoints were therefore exercised directly at the MCP protocol layer. No CLI, app, user configuration, or credentials were changed to work around that external tooling issue.
