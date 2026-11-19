---
name: motion
description: Animation guidance for the base, free Motion library and CSS animation. Use when writing or reviewing animations with Motion for JavaScript, React, Vue, Base UI, or Radix; searching public Motion documentation and examples; generating CSS spring or bounce easing; or upgrading from Framer Motion. This repository does not enable Motion+ tools, premium source retrieval, performance scoring, or the visual transition editor.
---

# Motion

Use Motion and CSS animation deliberately, accessibly, and with a single owner for each animated property.

- [Animation best practices](best-practices/index.md): platform-specific guidance for JavaScript, React, Vue, Base UI, and Radix, covering Motion and plain CSS.
- [Public documentation and example search](codex/index.md): search APIs, usage guidance, examples, and public Motion UI listings through the base Motion MCP server.
- [CSS spring and bounce generation](css-spring/index.md): generate and refine CSS `linear()` spring and bounce easing.

## Repository tier policy

Use only the base/free Motion MCP server at `https://mcp.motion.dev` and the self-contained references above. Do not configure, authenticate, call, or recommend the Motion+ MCP server. Do not use premium source retrieval, MotionScore methodology, saved transition tooling, or the visual transition editor. The premium reference modules from the verified source snapshot are intentionally omitted from this repository adaptation.

If a request requires a premium capability, explain that it is out of scope and continue with the strongest base-library or browser-platform approach available. Do not reconstruct gated material.

## Upgrading Motion

Requests such as "upgrade Motion", "migrate from framer-motion", and "upgrade to Motion 12" resolve through public documentation search.

1. Read the installed version from `package.json` first. Check for `motion`, `framer-motion`, or `motion-v`.
2. Search the public documentation for the upgrade guide on the project's platform. Search `migrate from gsap` when that is the actual transition.
3. Read the complete applicable guide and follow it in order.
4. Do not leave both `framer-motion` and `motion/react` imports installed after a completed migration.

## If the Motion MCP server is unavailable

Use `best-practices/` directly; it is self-contained. State which current documentation or search-dependent facts could not be verified. Do not fall back to Motion+.
