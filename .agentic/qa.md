# QA Notes - DinoStack Reading Room

Project-specific knowledge for QA runs. Read this before booting the app.

## Dev server
- Boot with an ISOLATED port: `npx next dev -p 3479` (or any free port). Port 3000 is frequently occupied by an unrelated project on this machine - do not assume 3000 is the app.
- Wait until the chosen port responds (curl-until-ready) before driving the browser.
- No build step needed for QA; `next dev` is sufficient. `npm install` first in a fresh worktree.

## Environment
- No `.env` file is required. The app uses mock seed data only (`src/lib/books.ts`) - env preflight is a no-op.
- App hydrates synchronously from in-memory seed data; `networkidle` fires quickly, no extra wait needed.

## Triggers (what to verify when these change)
- Home page `/` reading list: the filter tabs (All / To Read / Reading / Finished) and their badge counts. On the correct baseline (4/3/2 seed) badges read All=9, To Read=4, Reading=3, Finished=2, and each active tab's badge must equal the number of cards shown.
- `/discover`: on `main` and most branches this is an intentionally bare, unstyled placeholder (it is the advanced-tier design exercise). "Unstyled" is expected there, NOT a styleless-build regression.
- Tailwind v4 styling: the home page must look styled (badge pills, colored cover swatches, card borders, dark active-tab). Bare black-on-white HTML on `/` is a FAIL.

## Branch-specific expectations
- `intro` branch: the filter-count bug is INTENDED to be visible - the "To Read" badge reads 3 but 4 cards show (and "Reading" reads 4 but shows 3), while "All" reads 9. On `intro`, that mismatch is the exercise, NOT a QA failure to fix; QA confirms the bug reproduces.
- `intermediate` branch: home page includes collapsible **Add a book** panel (Open Library search). QA verifies search, pick-result add flow, loading/empty/error states, and that the nine seeded books still appear with baseline badge counts (4/3/2) before any adds. After adding a book, counts should include the new `to-read` row.
- `advanced` branch: `/discover` stays the bare placeholder - QA confirms it loads.
