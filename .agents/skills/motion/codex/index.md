# Base Motion documentation and example search

Use the public Motion MCP server for current API documentation and public example discovery before implementing a non-trivial Motion animation.

## Search

Call the base-server search tool:

```text
search-motion-docs({ platform, searchTerm })
```

- `platform` is exactly one of `js`, `react`, or `vue`.
- `searchTerm` names the concept or API, such as `scroll`, `drag`, `useSpring`, `AnimatePresence`, `stagger`, or `shared layout`.
- Search the thing being animated or the API, not the generic word `animation`.

Read each relevant public documentation resource returned by the search. Adapt examples to the host project's design system, accessibility requirements, installed Motion version, and reduced-motion behavior.

If a result describes content whose source is not available through the base server, use the public documentation and self-contained best practices instead. Do not configure or invoke Motion+, request credentials, reconstruct gated source, or add `motion-plus`.

## Implement

- Match the project's existing styling and component conventions.
- Verify package names and versions before changing imports.
- Prefer `motion` or `motion/react` for current Motion code; migrate legacy `framer-motion` only as part of an approved upgrade.
- Install packages only when the user has approved the dependency change.
- Preserve the example's animation structure only when it supports the host content and motion ownership contract.
- Always provide a reduced-motion path and clean up observers, listeners, and animation controls.
