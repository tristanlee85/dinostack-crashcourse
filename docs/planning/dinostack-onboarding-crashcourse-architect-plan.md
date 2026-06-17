# Architect Plan: DinoStack Onboarding Crashcourse

> Companion to the Brief at `docs/planning/dinostack-onboarding-crashcourse.md`. Revised after Skeptic round 1 (2 Critical, 4 Major, 3 Minor resolved). Pending Skeptic round-2 sign-off.

## Approach

Build one small Next.js (App Router) + TypeScript app - a personal Reading List / "To-Read" tracker ("DinoStack Reading Room") - on `main`, then fork three independent tier branches (`intro`, `intermediate`, `advanced`) off that base, each carrying exactly one `TASK.md` at a graduated spec level (full Brief / partial Brief / problem statement only). The app concept hosts a visible bug (a broken filter/count in the list UI), a natural feature/integration (enrich a book via the public, no-auth Open Library API), and a credible design-to-code target (a styled "Discover/Browse" screen implementable from committed screenshots, with an optional Figma-MCP enhanced path).

## Codebase context

- The Brief is authoritative. It pre-decides structure (3 branches), archetype->tier mapping, stack, graduated spec model, in-repo `TASK.md` delivery, observation-based success (no autograder), dinostack branding with real command names, and the Figma baseline-plus-optional-MCP rule.
- Overview docs (`docs/overview/vision.md`, `requirements.md`) are unfilled operator-owned stubs; treat the Brief as intent, propose no edits.
- Repo is near-empty greenfield: single commit (the Brief), no git remote, only `main`. `package.json` is a default `npm init` CommonJS stub to be fully rewritten. `.gitignore` already covers `node_modules/`, `.env*`, `.DS_Store`, `.agentic/`. `AGENTS.md` has an empty `## Activation` section - needs `agentic-engineering: opt-in` so the framework activates for a forking engineer.
- dinostack install/workflow verified from source:
  - Install one-liner (from `bootstrap.sh` + `README.md`): `curl -fsSL https://docs.dinostack.ai/install.sh | bash`. Repo is PUBLIC at https://github.com/Space-Dinosaurs/DinoStack; default install dir `DinoStack/`, records path in `~/.agentic/agentic-engineering-config.json`. Requires `git` + `python3`; `node` optional. SSH alternative: `git clone git@github.com:Space-Dinosaurs/DinoStack.git`.
  - Activation: global `opt-out` (default) vs `opt-in` in `~/.claude/agentic-engineering.json`; per-project marker `agentic-engineering: opt-in` in root `AGENTS.md`.
  - Recommended permissions: `bypassPermissions` with documented allow/deny lists.
  - Workflow taught: the `/implement-ticket` loop (the conductor auto-runs `/brief` for planning and `/skeptic` for review based on risk). Conductor/Worker/Skeptic roles and Trivial/Low/Elevated risk classification.
- Tooling target (verified via `npm view` on 2026-06-04): **Next.js 16.2.7** (App Router) + **React 19.2.7** + **TypeScript ^5** (strict) + **Tailwind CSS v4 (4.3.0)** + **ESLint 9.39.4**. Node 20.9+ required (`next@16` `engines.node: ">=20.9.0"`; Node 18 is EOL). Local Node is v24.14.0 / npm 11.9.0, satisfying this. **ESLint is held at the 9.x line on purpose:** `eslint-config-next@16.2.7` is incompatible with ESLint 10.x (its bundled `eslint-plugin-react` calls `context.getFilename()`, removed in ESLint 10 - reproduced as a hard `TypeError` on every lint run), and the eslint-config-next `eslint` peer is `>=9.0.0`. `^9` is the latest-resolving version the chosen Next 16 lint config actually supports; this is not a downgrade-to-make-an-old-command-work, it is matching the config package's real support window.

## Data model

No backend, no database. Local mock data + React state.

```ts
type ReadingStatus = "to-read" | "reading" | "finished";
interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  coverColor: string;   // deterministic placeholder swatch
  addedAt: string;      // ISO date
}
```

- **Seed: exactly 9 books** in `src/lib/books.ts` (mock, committed; no fetching on base `main`). The distribution across `status` is **fixed and load-bearing for the intro bug to be visible**: **4 `to-read`, 3 `reading`, 2 `finished`**. The bug (planted only on `intro`) is a `countByStatus` status-key swap between `to-read` and `reading`; it is silently invisible unless the seed contains both `to-read` and `reading` books, so this distribution is a binding contract on `main`, not a Worker choice. (See the augmented intro task entry below for the exact pre-fix badge-vs-grid numbers QA scenario 2 verifies.)
- Intermediate tier introduces `OpenLibraryDoc` + a fetch helper (the feature the engineer builds); base `main` does not ship it.
- **Glossary scope decision:** `glossary.md` holds the **app/domain** Ubiquitous Language only - `Book`, `ReadingStatus` (`to-read`/`reading`/`finished`), `Reading Room` (the app), `Tier` (intro/intermediate/advanced), `TASK.md`. The **dinostack-role terms** (`Conductor`, `Worker`, `Skeptic`) and `Discover` (the advanced-tier screen) live in the README mental-model section / route table **by design**, not in `glossary.md`. Rationale: the glossary is the binding domain vocabulary agents use in *this repo's code*; the role terms are methodology vocabulary the README *teaches the reader*, and `Discover` is a screen name documented at its point of use. `glossary.md` carries a one-line pointer: "DinoStack role terms (Conductor / Worker / Skeptic) are defined in the README mental-model section."

## API / interface design (binding contracts)

Base app (`main`) routes (App Router):

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Reading list: status-filter tabs + book grid + per-status counts |
| `/discover` | `src/app/discover/page.tsx` | Placeholder "Discover" screen (advanced-tier design target) |
| layout | `src/app/layout.tsx` | App shell: header "DinoStack Reading Room", nav to `/` and `/discover` |

Base app components (`src/components/`):

```ts
// BookCard.tsx
interface BookCardProps { book: Book; }
export function BookCard(props: BookCardProps): JSX.Element;

// FilterTabs.tsx - status filter + counts
type FilterValue = ReadingStatus | "all";
interface FilterTabsProps {
  active: FilterValue;
  counts: Record<FilterValue, number>;
  onChange: (next: FilterValue) => void;
}
export function FilterTabs(props: FilterTabsProps): JSX.Element;

// BookList.tsx - owns filter state, renders FilterTabs + grid of BookCard
interface BookListProps { books: Book[]; }
export function BookList(props: BookListProps): JSX.Element;
```

Pure helper (the seam the intro bug lives in) - `src/lib/filtering.ts`:

```ts
export type FilterValue = ReadingStatus | "all";

// Returns one bucket per ReadingStatus PLUS an "all" bucket.
// CONTRACT: counts.all MUST be computed by SUMMING the three per-status buckets:
//   counts.all = counts["to-read"] + counts.reading + counts.finished
// (NOT by books.length). This is load-bearing: the intro bug swaps two per-status
// buckets, and summing keeps "all" correct while "to-read"/"reading" go visibly wrong.
export function countByStatus(books: Book[]): Record<FilterValue, number>;

export function filterBooks(books: Book[], filter: FilterValue): Book[];
```

**Binding on `main` (the correct baseline):** `countByStatus` iterates the books, increments the matching per-status bucket for each book, then sets `all` to the sum of the three per-status buckets. On the correct `main` baseline, for the 4/3/2 seed this yields `{ "to-read": 4, "reading": 3, "finished": 2, "all": 9 }`. The `"all"`-by-summation rule is fixed contract, not Worker discretion, precisely so the planted bug on `intro` leaves the "All" tab correct (9) while the "To Read" and "Reading" badges are demonstrably wrong - giving QA a guaranteed-visible discrepancy that does not vanish into a still-correct total.

Fixed: the route table, the three component prop shapes, the two helper signatures, the `"all"`-by-summation contract, and "home page is a client component owning filter state". Worker discretion: Tailwind class choices, copy beyond what TASK.md/README quote, internal `src/lib/` organization.

Intermediate tier added contract (engineer builds; base does NOT ship) - `src/lib/openlibrary.ts`:

```ts
interface OpenLibraryDoc { title: string; author_name?: string[]; first_publish_year?: number; cover_i?: number; }
// GET https://openlibrary.org/search.json?title=<q>&limit=5  (public, no auth, CORS-open)
export async function searchOpenLibrary(title: string): Promise<OpenLibraryDoc[]>;
```

`openlibrary.ts` is a side-effecting network-I/O module; per project convention (`content/rules/module-manifest.md`) the engineer who builds it on `intermediate` **must add a module manifest header** (Purpose / Public API / Upstream deps / Downstream consumers / Failure modes / Performance) - exactly the network-call case the manifest rule targets. The intermediate `TASK.md` states this as an explicit constraint so the forking engineer carries the obligation.

## Implementation steps (dependency-ordered)

1. **Rewrite `package.json` for the verified stack and add config files.** Exact dependency targets (verified 2026-06-04):
   - `dependencies`: `next@^16` (resolves 16.2.7), `react@^19` (19.2.7), `react-dom@^19` (19.2.7).
   - `devDependencies`: `typescript@^5`, `@types/node@^20`, `@types/react@^19`, `@types/react-dom@^19`, `eslint@^9` (resolves 9.39.4 - do NOT use `^10`, see note), `eslint-config-next@^16` (must match the `next` major exactly -> 16.2.7), `tailwindcss@^4` (4.3.0), `@tailwindcss/postcss@^4` (4.3.0).
   - **Scripts** (binding, end-to-end consistent):
     ```jsonc
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "eslint . --max-warnings 0",
       "typecheck": "tsc --noEmit"
     }
     ```
     `lint` uses the **ESLint flat-config CLI** (`eslint .`), NOT `next lint` (removed in Next 16).
   - **`eslint.config.mjs`** (flat config; `eslint-config-next`'s subpath exports are **arrays** of flat-config objects under Next 16 - spread them):
     ```js
     import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
     import nextTypeScript from "eslint-config-next/typescript";

     /** @type {import("eslint").Linter.Config[]} */
     const config = [
       ...nextCoreWebVitals,
       ...nextTypeScript,
       { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },
     ];

     export default config;
     ```
     (Verified: under `eslint-config-next@16.2.7`, `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` each `export default` an array; `next`, `react`, `react-dom` must be installed for these subpaths to resolve.)
   - **`postcss.config.mjs`**: Tailwind v4 - uses the `@tailwindcss/postcss` plugin (see step 2).
   - Also add `next.config.ts`, `tsconfig.json` (strict).
   - **Gate:** `npm install && npm run lint && npm run typecheck && npm run build` all clean on shell before U1 is accepted. `npm run lint` must complete without the `getFilename` TypeError (the canary that proves the ESLint major is correct).
2. **Scaffold base app on `main`**: `layout.tsx`, `page.tsx`, `discover/page.tsx`, `globals.css`, plus the **Tailwind v4 PostCSS wiring** (do NOT use v3 patterns):
   - `postcss.config.mjs`:
     ```js
     const config = { plugins: { "@tailwindcss/postcss": {} } };
     export default config;
     ```
     Use the `@tailwindcss/postcss` plugin - NOT `tailwindcss` as a PostCSS plugin (v3 shape -> styleless build under v4).
   - `globals.css` first line: `@import "tailwindcss";` (v4) - NOT the v3 `@tailwind base/components/utilities` triplet.
   - Keep the dinostack button base-layer fix: `@layer base { button, [role="button"] { cursor: pointer; } }`.
   - `next.config.ts`: disable `devIndicators`.
3. Domain + data: `types.ts`, `books.ts` (seed = fixed 4/3/2 distribution), `filtering.ts` (manifest recommended; `all`-by-summation contract above).
4. Components: `BookCard`, `FilterTabs`, `BookList` (manifest recommended) per contracts.
5. Wire home page; verify build/dev clean, filtering + counts correct on `main`.
6. Rewrite root `AGENTS.md` (lean root, <~40 lines): `## Activation` = `agentic-engineering: opt-in`; `## Decisions` (stack, mock-data-only, three-branch model); keep Tools/Docs/Conventions/Session start; conventions note -> `glossary.md`, dinostack branding + real command names + no em dashes.
7. Replace `glossary.md` stub with real Ubiquitous Language (domain terms only; role-term pointer line).
8. Update `.gitignore`: add `/.next/`, `/out/`, `next-env.d.ts`, `*.tsbuildinfo`.
9. Author `README.md` (comprehensive self-contained guide - outline below).
10. Commit and finalize `main`.
11. Fork `intro` from `main`: plant the bug + `intro/TASK.md` (complete Brief). Bug is the only behavioral delta.
12. Fork `intermediate` from `main`: add `intermediate/TASK.md` (partial Brief). No app-code change.
13. Fork `advanced` from `main`: add `advanced/design/` assets + `advanced/TASK.md` (problem statement). `/discover` stays placeholder.

Per-tier branch deltas:

| Branch | Delta from `main` |
|---|---|
| `intro` | One planted bug in `src/lib/filtering.ts` (`countByStatus` to-read/reading bucket swap) + `intro/TASK.md` (full Brief). Nothing else. |
| `intermediate` | `intermediate/TASK.md` (partial Brief) only. App code unchanged (clean start). |
| `advanced` | `advanced/design/` assets (screenshots + spec) + `advanced/TASK.md` (problem statement). `/discover` left as placeholder. |

`filtering.ts` has exactly one importer (`BookList.tsx`), so no shared-utility / 5+-importer per-consumer-impact-table trigger fires. The planted `intro` bug is a single-file, single-consumer change with no blast radius beyond the home page.

## The three concrete tasks

**`intro`** - fix a visible bug to a PR (complete Brief ships). Planted bug: in `src/lib/filtering.ts`, `countByStatus` swaps the `"to-read"` and `"reading"` per-status buckets (increments the `reading` bucket for `to-read` books and vice versa), while `"all"` still correctly sums the three per-status buckets. Against the fixed 4/3/2 seed:

| Tab | Badge shown PRE-FIX (buggy) | Books actually in grid when tab active | Correct value (post-fix) |
|---|---|---|---|
| All | 9 (correct - sum unaffected) | 9 | 9 |
| To Read | 3 (wrong - shows reading's count) | 4 | 4 |
| Reading | 4 (wrong - shows to-read's count) | 3 | 3 |
| Finished | 2 (correct) | 2 | 2 |

The defect is observable in the running UI, not a hidden test failure: the "To Read" badge reads 3 but the grid shows 4 books when that tab is active (and "Reading" reads 4 but shows 3). `intro/TASK.md` = complete Brief stating exactly these pre-fix numbers as the repro, so QA scenario 2 has a concrete, guaranteed-visible discrepancy to confirm. Success criteria: every badge equals the count of books shown under its tab (incl. "All" = 9); filtered grid matches the active tab; no regressions. Non-goals: no new features/styling. Constraints: single-file fix in `filtering.ts`; no em dashes. Verification: `npm run build` clean; manual - each badge equals its tab's grid count. **`main` (and therefore `intro`) ships NO test suite and NO test runner** (`package.json` has no `test` script), so the Brief's "do not ship a failing test on `intro`" is automatically satisfied - there is no test infrastructure to fail, and the engineer verifies the fix by running the app and reading the badges. The TASK.md states this plainly.

**`intermediate`** - feature/integration (partial Brief ships). Feature: an "Add a book" flow that searches Open Library (`https://openlibrary.org/search.json?title=<q>&limit=5`, no auth, CORS-open) and lets the user pick a result to add with author/year auto-filled. FILLED IN: Problem, endpoint + `OpenLibraryDoc`/`searchOpenLibrary` contract, happy-path Success criteria, and the `openlibrary.ts` module-manifest constraint. LEFT AS GAPS (under a "You decide (author this part of the spec)" heading): loading/empty/error states, UI placement of the Add entry point, debounce vs submit, persistence across reload.

**`advanced`** - design-to-code (problem statement only ships). Target: restyle `/discover` into a polished "Browse / Discover Books" layout (hero/search header, responsive card grid with cover/title/author + category chips). Committed screenshots + written spec are the source of truth. No specific Figma Community file hard-named (URL rot risk); optional MCP path = "use any public reading-app/book-discovery Community file of your choice" with search-term guidance. `advanced/design/` contains `discover-desktop.png`, `discover-mobile.png` (mockups; annotated placeholders acceptable until real mockups exist), `spec.md` (hex values, spacing, typography, grid columns per breakpoint, component inventory, copy), `README.md` (how to read assets + optional Figma-MCP path). TASK.md = single Problem paragraph + "How to start" (checkout advanced, read spec + screenshots, then `/implement-ticket` - which opens planning to author your own Brief (`/brief` available as an explicit option)).

## README outline (16 sections)

1. Title + one-paragraph orientation (what/who/paired-programming observation-based framing). 2. The core lesson: spec-first planning. 3. What you will build (the Reading Room, mock-data-only). 4. **Prerequisites** - **Node 20.9+** (current LTS; required by `next@16`, and Node 18 is EOL - do NOT state "Node 18+"), npm 10+ (bundled with Node 20+), Claude Code or a supported adapter tool, `git`, `python3`. Link the adapter list. Stays aligned with the U1 stack decision; if the Next major changes, this prerequisite changes with it. 5. Install dinostack (real `bootstrap.sh` steps, SSH fallback, `AE_DEST_DIR`, config path; callout that install pulls from agentic-engineering until rename). 6. Activate for this project (opt-out vs opt-in; this repo's AGENTS.md carries opt-in; confirm with `/agentic-status`). 7. Recommended permissions (`bypassPermissions` rationale). 8. The mental model (conductor/worker/skeptic at onboarding depth - this is where the role terms are defined). 9. Risk classification briefly (Trivial/Low/Elevated, one table). 10. The command workflow (two tiers - commands you type: `/implement-ticket`, `/init-project`, `/wrap`; framework-run: `/brief`, `/skeptic`; worked micro-example). 11. How the exercises work (3 branches, graduated spec, any order, independent off `main`). 12. Per-tier "how to start" (intro/intermediate/advanced subsections). 13. Running the app (`npm install`, `npm run dev`, build/lint/typecheck - script names must match `package.json` exactly). 14. A note on "done" (observation-based, no grade). 15. Fork and clone (`[PLACEHOLDER: GITHUB_REPO_URL]`, hosting pending). 16. Where to learn more (dinostack docs + framework README).

README authoring is Elevated (new file, public-facing, decision-driving) - Worker + Skeptic. Its reality-asserting claims are certified in U11.

## QA criteria

```yaml
qa_criteria:
  qa_skip: null
  viewport: [mobile, desktop]
  scenarios:
    - id: 1
      description: On main the Reading Room app builds and the home page loads with the book grid and filter tabs visible.
      method: browser
      evidence: Screenshot of the running app at / on main with the book grid and filter tabs rendered.
    - id: 2
      description: On the intro branch the documented filter-count bug is reproducible before any fix - the "To Read" badge reads 3 but 4 books render under it (and "Reading" reads 4 but shows 3), while "All" reads 9.
      method: browser
      evidence: Screenshot at / on the intro branch showing the "To Read" badge=3 next to 4 rendered books, matching the repro table in intro/TASK.md.
    - id: 3
      description: On the intermediate branch the app builds and loads as a clean starting point (no feature yet, no console errors).
      method: browser
      evidence: Screenshot at / on the intermediate branch showing the clean base app and a clean browser console.
    - id: 4
      description: On the advanced branch the app builds and the /discover placeholder screen loads as the design-to-code starting point.
      method: browser
      evidence: Screenshot at /discover on the advanced branch showing the unstyled placeholder.
    - id: 5
      description: The filter tabs change the visible book set and each tab badge equals the count of books in that status on main (correct baseline - To Read=4, Reading=3, Finished=2, All=9).
      method: browser
      evidence: Screenshots of two filter states on main showing badge counts matching the rendered book set.
  manual_smoke: >
    A reviewer with no prior context forks the repo, clones it, follows the root README from
    zero (including dinostack install and the opt-in activation step), checks out each tier branch
    in turn, and confirms each exercise is startable unaided and the README renders as a complete
    standalone guide. Acceptance is the reviewer's judgment that the onboarding path is followable;
    there is no automated grade.
```

`accessibility` deliberately omitted as a hard scenario (teaching fixture; visual polish is itself the advanced exercise); Brief's own qa_criteria set only `browser`. `theme_aware`/`perceptual_diff_enabled`/`motion_aware`/`storybook_enabled` all default false (no `.agentic/config.json`). No `visual_conformance` required: the only visual spec is `advanced/design/spec.md`, which is the learner's target, not a repo-build acceptance contract.

## Trade-offs

Alternatives rejected: Task/Todo app (contrived filter-bug cliche), Weather/dashboard (API key needed; Open Library needs none), E-commerce (too large), three separate apps (triples maintenance), GitHub Issues (do not fork), hard-named Figma file (URL rot), Pages Router (App Router is current default).

Watch-outs:
- Branches drift from base if base changes post-fork (fork after `main` is final; note snapshots in commit messages).
- The intro bug must stay visibly broken (NO failing test shipped on `intro`; `main` ships no test runner at all).
- Advanced screenshots are themselves build output (spec.md authoritative until real mockups).
- GitHub URL is a placeholder everywhere; dinostack-vs-agentic-engineering naming seam stated explicitly in README.
- **ESLint major is pinned at `^9` on purpose.** Upgrading to `eslint@^10` breaks the lint toolchain: `eslint-config-next@16`'s bundled `eslint-plugin-react` calls `context.getFilename()`, removed in ESLint 10, throwing `TypeError: contextOrFilename.getFilename is not a function` on every `eslint .` run (reproduced live, 2026-06-04). Do not modernize ESLint past 9 until `eslint-config-next` ships an ESLint-10-compatible release. `eslint-config-next` major must always equal the `next` major.
- **Tailwind v4, not v3.** PostCSS plugin is `@tailwindcss/postcss`; CSS entry is `@import "tailwindcss";`. The v3 muscle-memory shapes silently produce a styleless build under v4.

## Open questions (operator-owned, non-blocking; defaults baked in)

1. GitHub hosting location - default: `[PLACEHOLDER: GITHUB_REPO_URL]` + pending note; operator swaps real URL later. Does not gate any build unit. (Certified by U11 once a real URL lands.)
2. Hard-name a specific Figma Community file for advanced's optional path - default: keep committed assets authoritative, MCP path = "any public reading-app file of your choice" + search terms. Operator may supply a URL to feature.

## Suggested unit decomposition

Single-track repo (one root `AGENTS.md`, no depth-1 sub-`AGENTS.md`). Plan-tier (>6 Elevated units). Promotion comes from unit count, not track span.

| # | Unit | Risk | Depends on | Notes |
|---|---|---|---|---|
| U1 | `package.json` rewrite + TS/ESLint(flat,^9)/Tailwind-v4/Next-16 config | Elevated | - | Foundation. Gate: `npm install && npm run lint && npm run typecheck && npm run build` clean (lint runs without the `getFilename` TypeError). |
| U2 | Base app shell + routes (`layout`, `/`, `/discover` placeholder, `globals.css`) + Tailwind v4 PostCSS wiring | Elevated | U1 | App Router scaffolding. |
| U3 | Domain + data + filtering (`types.ts`, `books.ts` [4/3/2 seed], `filtering.ts` [`all`-by-sum]) | Elevated | U1 | `filtering.ts` manifest. Pure logic. |
| U4 | Components (`BookCard`, `FilterTabs`, `BookList`) + wire home page | Elevated | U2, U3 | `BookList.tsx` manifest. Closes QA 1 + 5. |
| U5 | Root `AGENTS.md` rewrite (opt-in marker, lean-root, decisions, conventions) | Elevated | - | Parallel to U1-U4. |
| U6 | `glossary.md` Ubiquitous Language (domain terms + role-term pointer) + `.gitignore` Next.js additions | Elevated | - | Parallel. Multi-file. |
| U7 | `README.md` comprehensive guide | Elevated | U2, U5 | Largest writing unit; public-facing. Written here, certified in U11. |
| U8 | `intro` branch: plant `countByStatus` swap + `intro/TASK.md` (full Brief, exact pre-fix numbers) | Elevated | U4 final on `main` | Fork after `main`. Closes QA 2. No failing test. |
| U9 | `intermediate` branch: `intermediate/TASK.md` (partial Brief) + `searchOpenLibrary` contract + manifest constraint documented | Elevated | `main` final | Fork after `main`. App code unchanged (QA 3). |
| U10 | `advanced` branch: `advanced/design/` (spec + screenshots/placeholders) + `advanced/TASK.md` (problem statement) | Elevated | `main` final | Fork after `main`. Closes QA 4. Figma-MCP path, no URL. |
| U11 | **README reality-check** - mechanically cross-check every reality-asserting README claim against what `main` (U1-U7) and the three tier branches (U8-U10) actually shipped | Elevated | U7, U8, U9, U10 | Final integration gate. Runs AFTER all branches are forked. Closes the post-fork drift gap. |

**U11 scope (binding) - claim-by-claim cross-check:** route list (README vs actual `src/app/` routes); the "three branches" claim (vs actual branch set); the install one-liner (verbatim vs real `bootstrap.sh` URL); the opt-in activation step (vs this repo's `AGENTS.md`); per-tier "how to start" (vs each branch's actual `TASK.md` path + spec level); any stated counts ("9 books", "three exercises", "three tiers"); `npm` script names the README tells the reader to run (vs `package.json` exactly - in particular README must NOT instruct `npm run lint` to invoke `next lint`); Node prerequisite (vs U1 engines floor, Node 20.9+). **Skeptic instruction for U11:** treat any README-vs-reality drift as a doc-sync finding (per `content/references/doc-sync-obligation.md`) - Major if it would mislead a reader following the guide (wrong command, wrong branch name, wrong route, wrong Node floor), Minor for cosmetic count mismatches.

**Waves:** W1 (parallel) U1, U5, U6. W2 U2, U3 (after U1). W3 U4 (after U2, U3); U7 starts after U2+U5, finalizes after U4. W4 (parallel, all fork from finalized `main`) U8, U9, U10 - each base + one delta. **W5 U11** (README reality-check; after U7 + U8 + U9 + U10). Critical: all three branch units must branch their worktree from the finalized `main`, not from a sibling branch. U11 cannot start until all three tier branches exist, because it certifies the README's per-tier and per-branch claims against the actually-forked branches.
