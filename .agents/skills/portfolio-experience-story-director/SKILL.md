---
name: portfolio-experience-story-director
description: Direct the design, storytelling, motion choreography, implementation planning, and review of this portfolio's Professional Experience road and scroll-story journey. Use for changes to the experience roadmap, road or path animation, experience stops, pinned experience section, mobile experience chronology, reduced-motion fallback, or narrative motion in the Professional Experience section. Do not use for unrelated portfolio sections, dashboards, or generic UI work.
---

# Portfolio Experience Story Director

Direct the Professional Experience road as a coherent documentary story: real career evidence first, one memorable visual idea, and motion that clarifies progression without competing systems.

## Workflow

### 1. Inspect the existing story

Read the live implementation and content before proposing changes. Start with:

- `src/components/portfolio/ExperienceJourneySection.tsx`
- `src/data/experience.ts`
- the relevant experience rules in `src/app/globals.css`
- `tests/e2e/portfolio.spec.ts`

Inspect the rendered section at representative desktop and mobile sizes when browser access is available. Preserve real roles, outcomes, chronology, and the portfolio's established sketchbook identity.

### 2. Classify the request before acting

Treat a request as **major** when it changes any of the following:

- layout or information hierarchy
- the road metaphor or signature visual element
- narrative order or chapter structure
- pinning, scroll distance, or scroll behavior
- animation-library or application dependencies

For a major request, produce exactly three distinct concepts before editing. For each concept, include its thesis, signature element, story beats, desktop scroll behavior, mobile fallback, reduced-motion behavior, and principal performance or accessibility risk. Recommend one concept, explain why it best serves the real content, and stop for explicit user approval. Do not edit code, add dependencies, or combine concepts before approval.

Treat a request as **incremental** when it preserves the approved structure and metaphor while fixing clipping, easing, spacing, accessibility, responsiveness, reduced motion, performance, cleanup, or an existing test. Incremental work may proceed directly through the project's normal test-first workflow.

If classification is genuinely ambiguous, use the major path.

### 3. Build the narrative contract

After concept approval, or immediately for incremental work:

1. Map each experience's real role, impact, tags, and takeaway to a story beat.
2. Storyboard the section at approximately 0%, 20%, 40%, 60%, 80%, and 100% scroll progress.
3. Choose one focal moment and one signature element; keep supporting motion subordinate.
4. Read [art-direction.md](references/art-direction.md), [motion-contract.md](references/motion-contract.md), and [qa-matrix.md](references/qa-matrix.md).
5. Check current platform and framework guidance before relying on version-sensitive behavior.

### 4. Implement with clear ownership

Follow the ownership boundaries in `references/motion-contract.md`. Never let two animation systems control the same property. Keep the desktop scrollytelling experience and the mobile natural-flow experience semantically equivalent, and keep all content available when motion is reduced or JavaScript is unavailable.

Do not add a dependency merely to create novelty. A dependency change remains a major decision and requires approval even after implementation has started.

### 5. Verify the complete experience

Use `references/qa-matrix.md` as the acceptance checklist. Verify boundaries, progress checkpoints, keyboard access, reduced motion, cleanup, visual continuity, and performance. Report observed evidence and any unverified items separately.

## Concept response format

For major work, respond in this order:

1. **Concept A** — thesis, signature element, story beats, behavior, fallback, risks.
2. **Concept B** — the same fields, with a materially different narrative idea.
3. **Concept C** — the same fields, with a materially different narrative idea.
4. **Recommendation** — one choice and the content-based reason.
5. **Approval gate** — state that implementation is paused pending explicit approval.

Do not present minor visual variants as three concepts.

## Scope guardrails

- Invoke implicitly only for the Professional Experience road and directly related scroll-story work.
- Do not activate for unrelated dashboards, product UI, other portfolio sections, or generic animation questions.
- Prefer truthful hierarchy and legibility over spectacle.
- Keep one signature element; remove effects that do not advance the story.
- Never hide essential content behind animation completion.
