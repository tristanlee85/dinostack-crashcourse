# Verification Gate: DinoStack Onboarding Crashcourse

Every QA scenario and quality gate maps to a concrete closing unit. No "cannot specify" entries.

## QA scenario -> closing unit
| QA scenario | What it verifies | Closing unit | Method |
|---|---|---|---|
| 1 | On `main` the home page builds and loads with book grid + filter tabs visible (and styled, not bare HTML) | U4 | browser (concurrent with integration Skeptic) |
| 2 | On `intro` the filter-count bug reproduces pre-fix: "To Read" badge=3 over 4 rendered books, "Reading" badge=4 over 3, "All"=9 | U8 | browser |
| 3 | On `intermediate` the app builds and loads as a clean base (no feature, no console errors) | U9 | browser |
| 4 | On `advanced` the `/discover` placeholder loads as the design-to-code starting point | U10 | browser |
| 5 | On `main` filter tabs change the visible set and each badge equals its tab's grid count (4/3/2, All 9) | U4 | browser |

## Build / quality gates
| Gate | Closing unit | Pass condition |
|---|---|---|
| Toolchain gate | U1 | `npm install && npm run lint && npm run typecheck && npm run build` all clean; `npm run lint` runs WITHOUT the `getFilename` TypeError (proves ESLint major is 9, not 10) |
| Lint / typecheck (per code-shipping unit) | U2, U3, U4 | `npm run lint` + `npm run typecheck` clean after each merges; no new warnings |
| Module manifests | U3 (`filtering.ts`), U4 (`BookList.tsx`) | Manifest headers present and accurate (Skeptic: missing = Minor, stale = Major) |
| Intent-layer correctness | U5, U6 | `AGENTS.md` carries `agentic-engineering: opt-in`; glossary scoped to domain terms; no em dashes |
| README doc-sync | U11 | Every reality-asserting README claim (routes, branch set, install one-liner, opt-in step, per-tier how-to-start, counts, npm script names, Node 20.9+ floor) matches shipped reality; no Major doc-sync drift |

## Observation-based learner success (explicitly NOT a build gate)
The course itself has no autograder. The QA scenarios above verify the REPO is built correctly and onboard-ready; they do not grade a learner's exercise output. Learner success is the paired-programming judgment that the outcome is acceptable, per the Brief. This distinction is intentional and must not be "fixed" into a learner-grading gate.

## Manual smoke (repo-level acceptance)
A zero-context reviewer forks, clones, follows the README from zero (install + opt-in activation), checks out each tier branch, and confirms each exercise is startable unaided. Judgment-based; the only repo-level acceptance that cannot be mechanized (and is not claimed to be).
