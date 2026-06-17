# dinostack-crashcourse

DinoStack Reading Room - a small Next.js onboarding app that teaches engineers to use the dinostack framework via three forked tier exercises.

## Activation
agentic-engineering: opt-in

## Decisions
- Stack: Next.js 16 / React 19 / TypeScript 5 (strict) / Tailwind v4 / ESLint 9 (held at 9 because eslint-config-next@16 breaks on ESLint 10).
- Mock-data-only - no backend, no database; local seed data plus React state.
- Three-branch onboarding model: `intro`, `intermediate`, `advanced`, each a tier exercise forked from `main`.

## Tools
- GitHub operations: use `gh` CLI - do not use GitHub MCP

## Docs
- `docs/planning/` - pre-implementation design artifacts
- `docs/research/` - research notes and reference material
- `docs/technical/` - implementation specs and architecture
- `docs/overview/` - high-level summaries and onboarding docs

## Conventions
- **Glossary** - see `glossary.md` for the project's domain terms (Ubiquitous Language).
- Engineer-facing prose uses dinostack branding with the real current command names and no em dashes. The everyday user-typed commands are `/init-project`, `/implement-ticket`, and `/wrap`; `/brief` and `/skeptic` are real commands the conductor auto-runs based on risk (invocable by hand but rarely needed), so frame them as framework-run, not as routine commands the learner types.

## Session start
- On the first interaction of a new session, silently check that `/init-project` scaffolding exists. Check each item only if its precondition holds:
  - Root `AGENTS.md` has required sections (`## Tools`, `## Docs`, `## Conventions`, `## Session start`) - always check.
  - `.claude/settings.json` - always check.
  - `docs/{planning,research,technical,overview}/` - always check.
  - `docs/overview/vision.md` and `docs/overview/requirements.md` - always check.
  - Seeded `MEMORY.md` at `<cwd>/.agentic/memory/MEMORY.md` - always check.
  - `.agentic/qa.md` (or legacy `.claude/qa.md`) - only if this project has a web UI.
  - `.agentic/deploy.md` (or legacy `.claude/deploy.md`) - only if release signals apply to this project.
  - `.agentic/tracking.md` (or legacy `.claude/tracking.md`) - only if a tracker was confirmed during `/init-project`.
  - `.agentic/learnings.md` - always check.
- Filesystem existence only - no LLM reasoning pass. Per-track scaffolds are out of scope for this session-start check - do not flag them.
- Do NOT include `.agentic/preferences.json` or `.claude/settings.local.json` in the "missing" list. Both are gitignored per-developer files; their absence on a fresh checkout is expected.
- If `.agentic/preferences.json` exists and contains `"skipScaffoldingCheck": true`, skip the check entirely.
- If anything is missing, prompt the user ONCE per session on one line: `Scaffolding check: missing [list]. Re-run /init-project to fix? [y/N/never]`. `y` runs it; `N` or Enter defers; `never` does a read-modify-write on `.agentic/preferences.json` setting `skipScaffoldingCheck: true` without clobbering other keys.
