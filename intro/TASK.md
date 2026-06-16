# TASK: Fix the filter-count mismatch on the Reading List

> Tier: intro. This is a complete Brief - the spec is finished. Your job is to run
> it through the dinostack workflow and fix the bug, not to author the spec. Read it
> top to bottom, reproduce the bug in the running app, then start the workflow.

## Problem

On the home page (`/`) of the DinoStack Reading Room, the filter-tab badges do not
match the books actually shown. Each tab has a small count badge next to its label,
and that count is supposed to tell you how many books fall under that status. Right
now two of those badges lie.

Reproduce it:

1. From the branch root, run `npm install` (first time only), then `npm run dev`.
2. Open `http://localhost:3000/` in a browser.
3. Look at the filter tabs above the book grid. Click each tab and compare the
   badge number to the number of book cards rendered under it.

Observed (buggy) behavior against the seed library of 9 books:

| Tab | Badge shows | Books actually in the grid when that tab is active |
|---|---|---|
| All | 9 | 9 |
| To Read | 3 | 4 |
| Reading | 4 | 3 |
| Finished | 2 | 2 |

The "To Read" badge reads 3 but four cards render when that tab is active. The
"Reading" badge reads 4 but three cards render. "All" reads 9 and "Finished" reads
2, both of which are correct. The discrepancy is visible in the browser - the badge
count does not match the number of cards you can count on screen.

## Success criteria

- Every tab badge equals the number of books shown under that tab:
  - To Read = 4
  - Reading = 3
  - Finished = 2
  - All = 9
- The book grid for each tab still shows the correct set of books for that status
  (the grid was already correct - do not change what it shows).
- No regression to the other tabs: Finished stays 2 and All stays 9 after the fix.
- The running app shows matching badge-and-grid counts on every tab.

## Non-goals

- No new features.
- No styling or layout changes.
- No changes to the seed data, the components, or the page wiring.

## Constraints

- A single-file fix is expected, in `src/lib/filtering.ts`. The count logic lives
  in `countByStatus`; the per-tab grid is filtered by `filterBooks`, which is
  already correct. The mismatch comes from the count side, not the filter side.
- Do not use em dashes in any prose, comment, or commit message - use a regular
  hyphen.
- Do not add a test file. This repo ships no test runner by design (`package.json`
  has no `test` script); you verify the fix by running the app and reading the
  badges, not by running a suite.

## Verification

- `npm run build` completes cleanly (the bug is a logic error, not a build error,
  so the build was already passing - confirm it still passes after the fix).
- Manual: run `npm run dev`, open `/`, click through every tab, and confirm each
  badge equals the number of cards rendered under it (4 / 3 / 2 / 9).

## How to start this exercise

1. Check out this branch:

   ```bash
   git checkout intro
   ```

2. Reproduce the bug first, so you have seen it with your own eyes before any agent
   touches the code:

   ```bash
   npm install   # first time only
   npm run dev
   ```

   Open `http://localhost:3000/`, click the "To Read" tab, and confirm the badge
   reads 3 while four cards render. Click "Reading" and confirm the badge reads 4
   while three cards render.

3. In your agent, run `/implement-ticket` and point it at this file
   (`intro/TASK.md`) as the ticket. Watch the conductor classify the risk, spawn a
   worker to make the fix, and route the change through a skeptic review to a PR.

4. This is a single-file behavioral fix. Depending on your active risk profile it
   will classify as Low or Elevated - a good chance to watch the conductor reason
   about risk out loud. Either way the outcome is the same: the badges match the
   grid, and the change lands as a reviewed PR.

5. When the PR is open and the badges match the grid on every tab, the exercise is
   done. There is no automated grade - you confirm success by running the app and
   reading the numbers.
