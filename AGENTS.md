# iridium-crashcourse

<!-- TODO: Add one-paragraph description -->

## Activation
<!--
  agentic-engineering governs how work is done in this project.
  Run /agentic-status to see the resolved mode, profile, and whether it is active here.

  This project is ACTIVE by default. To turn it off for this project only,
  uncomment the marker line just below this block.
-->
<!-- agentic-engineering: opt-out -->

<!--
  Optional review strictness: relaxed | default | strict.
  Uncomment the line below to override the global setting for this project.
-->
<!-- agentic-engineering-profile: default -->

## Decisions
- <!-- Resolved architecture decisions as brief bullets - fill in as the project takes shape. -->

## Tools
- GitHub operations: use `gh` CLI - do not use GitHub MCP

## Docs
- `docs/planning/` - pre-implementation design artifacts
- `docs/research/` - research notes and reference material
- `docs/technical/` - implementation specs and architecture
- `docs/overview/` - high-level summaries and onboarding docs

## Conventions
- **Glossary** - see `glossary.md` for the project's domain terms (Ubiquitous Language).
- <!-- TODO: Add project conventions as they emerge -->

## PR Workflow
# Uncomment and fill in Reviewers: only if you have NO CODEOWNERS file and want
# automatic reviewer assignment when /implement-ticket marks a PR ready for review.
# CODEOWNERS (at .github/CODEOWNERS, docs/CODEOWNERS, or repo root) takes precedence.
# Reviewers: github-user-1, github-user-2

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
