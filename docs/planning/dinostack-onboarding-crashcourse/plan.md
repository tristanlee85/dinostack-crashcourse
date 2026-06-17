# Plan: DinoStack Onboarding Crashcourse

Plan-tier (11 Elevated units, single track). Assembled from Skeptic-approved upstream artifacts plus three conductor-authored coverage docs. Pending assembled-Plan Skeptic sign-off before the first engineer spawn.

## Components
- **Brief:** `../dinostack-onboarding-crashcourse.md` (operator-confirmed, committed)
- **Architect plan:** `../dinostack-onboarding-crashcourse-architect-plan.md` (Skeptic-approved, 2 rounds, committed)
- **Orchestration:** `./orchestration.jsonl` (11-unit DAG, 5 waves, merge order, Skeptic strategy)
- **Risk register:** `./risk-register.md`
- **Rollback:** `./rollback.md`
- **Verification gate:** `./verification-gate.md`

## One-screen summary
Build the "DinoStack Reading Room" Next.js app on `main` (U1-U7), finalize `main`, fork three standalone tier branches from the finalized-`main` SHA (`intro`/`intermediate`/`advanced`, U8-U10), then certify the README against shipped reality (U11). Observation-based onboarding course; no autograder. Stack: Next 16 / React 19 / TS 5 / Tailwind v4 / ESLint 9 (versions verified, ESLint held at 9 because eslint-config-next@16 breaks on ESLint 10).

## Hard barriers (sequencing invariants)
1. **U1 merges before W2.** U2/U3 cannot build without installed deps + config.
2. **`main` finalized before W4.** Record the finalized-`main` commit SHA; every W4 branch forks from THAT SHA, never from a sibling tier branch or the conductor working branch.
3. **All three tier branches exist before U11.** U11 certifies per-tier README claims against the actually-forked branches.

## Waves
- W1 (parallel): U1, U5, U6
- W2 (parallel, after U1 merged): U2, U3
- W3 (parallel): U4 (closes QA 1+5), U7 -> finalize `main`
- W4 (parallel, fork from finalized `main`): U8, U9, U10
- W5: U11

## Skeptic strategy
- Per-unit: U1, U5, U6, U7, U8, U9, U10
- Integration (one Skeptic over combined diff): U2+U3+U4 base-app render path
- Integration (doc-sync brief): U11
- Concurrent QA (browser): U4, U8, U9, U10
- No multi-dimensional / security-auditor pass (no auth/secrets/PII; Open Library ships only as a documented contract in `intermediate/TASK.md`, not live code).
