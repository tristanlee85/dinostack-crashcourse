# Risk Register: DinoStack Onboarding Crashcourse

Greenfield repo, no production or shared state, fully reversible (every unit is a branch). The dominant risks are toolchain-correctness and sequencing, not data or availability.

| # | Risk | Likelihood | Impact | Mitigation | Owner unit(s) |
|---|---|---|---|---|---|
| R1 | Fork from a pre-finalize `main` ships an incomplete app on a tier branch | Medium | High | Conductor records the finalized-`main` SHA after W3 and passes it explicitly in each W4 `git worktree add ... <SHA>` command. W4 engineers do NOT resolve their own base. | U8, U9, U10 |
| R2 | Tailwind v4 wired with v3 muscle memory -> silently styleless build that still renders structure | Medium | High | Plan pins `@tailwindcss/postcss` plugin + `@import "tailwindcss";`; integration Skeptic explicitly verifies styles apply; QA scenario 1 screenshot shows a styled grid, not bare HTML. | U2, U4 |
| R3 | ESLint upgraded to 10 -> `getFilename` TypeError breaks every lint run | Medium | High | `eslint@^9` pinned with in-plan rationale + a Trade-offs watch-out; U1 gate fails loudly if the TypeError appears (the canary). | U1 |
| R4 | Intro bug seeded such that it is not visible (no reading-status books) | Low (now) | High | Seed pinned to 4/3/2 as a binding contract; `countByStatus` "all" = sum-of-buckets; exact pre-fix numbers stated; QA scenario 2 verifies the concrete discrepancy. | U3, U8 |
| R5 | README asserts counts/paths/commands that the branches do not ship (post-fork drift) | Medium | Medium | U11 reality-check certifies every README claim against shipped artifacts after all branches exist; doc-sync Skeptic gates it. | U7, U11 |
| R6 | `eslint-config-next` major drifts from `next` major -> flat-config resolution fails | Low | Medium | Both pinned to ^16; rule "config-next major == next major" stated in plan + watch-out. | U1 |
| R7 | Next 16 / React 19 / Tailwind v4 currency churn (a pinned version yanked or a peer mismatch) | Low | Medium | Versions verified live via `npm view` on 2026-06-04; caret ranges allow patch/minor pickup; U1 gate catches install/build failure immediately. | U1 |
| R8 | A tier branch accidentally merged into `main` or a sibling (branches must stay standalone) | Low | Medium | Plan states W4 branches do NOT merge into `main` or each other; conductor pushes each as its own branch. | U8, U9, U10 |

No security/auth/secrets/PII risk: mock data only; Open Library appears solely as a documented contract in `intermediate/TASK.md`, never as live shipped code. No production deploy, no data migration, no external-service write path.
