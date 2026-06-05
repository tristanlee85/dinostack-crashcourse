# Intermediate exercise: Add a book via Open Library search

This is the **intermediate** tier of the Iridium Reading Room crashcourse. It exercises the
**feature / integration** flow: you take a real third-party API, wire it into the existing app,
and ship the feature behind a spec you finish authoring yourself.

This `TASK.md` is a **partial Brief**. The sections under "Brief (given)" are filled in for you -
they are the binding parts of the spec. The section under "You decide (author this part of the spec)"
lists the gaps you must close before you implement. Closing those gaps is the point of this tier:
you practice spec-first planning on a feature that is realistic but small.

> New to the workflow? Read the root `README.md` first. It covers iridium install, activation,
> and the `/brief` -> `/implement-ticket` -> `/skeptic` loop. Then come back here.

---

## Brief (given)

### Problem

Right now the Reading Room only shows the nine seeded books in `src/lib/books.ts`. A reader cannot
add a book of their own, and typing full metadata (title, author, year) by hand is tedious and
error-prone. We want an "Add a book" flow: the reader searches Open Library by title, picks a result,
and the book joins their reading list with author and publish year auto-filled - no manual typing of
metadata.

### The integration contract (given to you - implement exactly this seam)

Open Library exposes a public search endpoint. It needs **no API key, no auth**, and it is CORS-open,
so you can call it directly from the browser:

```
GET https://openlibrary.org/search.json?title=<q>&limit=5
```

`<q>` is the URL-encoded search title. The response is a JSON object with a `docs` array; each entry
carries (among other fields) `title`, `author_name`, `first_publish_year`, and `cover_i`.

Create a new module at `src/lib/openlibrary.ts` that exposes exactly this surface:

```ts
interface OpenLibraryDoc {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export async function searchOpenLibrary(title: string): Promise<OpenLibraryDoc[]>;
```

`searchOpenLibrary` calls the endpoint above, parses the response, and returns up to 5 `OpenLibraryDoc`
results (the `limit=5` already bounds this server-side). The fields are optional on purpose - real
Open Library records are missing `author_name`, `first_publish_year`, or `cover_i` more often than you
would expect, so your mapping into the app's `Book` shape must tolerate their absence.

For reference, the app's existing book shape (you will map a selected `OpenLibraryDoc` into this) lives
in `src/lib/types.ts`:

```ts
type ReadingStatus = "to-read" | "reading" | "finished";
interface Book {
  id: string;
  title: string;
  author: string;
  status: ReadingStatus;
  coverColor: string; // deterministic placeholder swatch
  addedAt: string;    // ISO date
}
```

### Success criteria (happy path - this much is fixed)

- The reader can search for a book by title and see up to 5 matching results.
- The reader can pick one result.
- The picked book appears in the reading list with:
  - status `to-read`,
  - `author` filled from `author_name` (join the array; fall back gracefully when it is absent),
  - publish year derived from `first_publish_year` where present.
- The nine seeded books still render correctly alongside any books the reader adds.

### Module-manifest constraint (binding)

`src/lib/openlibrary.ts` performs a network call, so it is a **side-effecting network-I/O module**.
Per this project's convention (see `content/rules/module-manifest.md` in the iridium install, and the
existing manifest header at the top of `src/lib/filtering.ts` for the house style), this file **must
carry a six-field module-manifest header**:

1. **Purpose** - one sentence on what the module does and why it exists.
2. **Public API** - the exported surface a caller uses (`searchOpenLibrary` and `OpenLibraryDoc`).
3. **Upstream dependencies** - what it consumes that it does not own (the Open Library endpoint, `fetch`).
4. **Downstream consumers** - who imports it (the Add-a-book UI you build).
5. **Failure modes** - how it fails, what the caller must do about it, and whether it is safe to retry.
6. **Performance** - the network round-trip cost a caller should expect.

This is exactly the network-call case the manifest rule targets. A Skeptic reviewing your PR will
check for it, so write the manifest as you build the module, not after.

---

## You decide (author this part of the spec)

These are deliberate gaps. Before you implement, decide each one and write it into your own Brief
(running `/brief` is the recommended way to author it). There is no single correct answer - pick a
defensible option, state it, and build to it. The Skeptic will hold you to the spec you wrote, not to
a hidden answer key.

- **Loading state.** What does the UI show while a search request is in flight?
- **Empty-results state.** What does the reader see when Open Library returns no matches for their query?
- **Network-error handling.** What happens when the fetch fails or Open Library is down? Decide how
  `searchOpenLibrary` signals failure (throw vs return empty) and how the UI surfaces it - and make
  the manifest's "Failure modes" field match the choice you make.
- **Entry point placement.** Where does the "Add a book" control live in the UI - a button in the
  header, a panel on the home page, a separate route? Decide and justify against the existing layout.
- **Debounce vs explicit submit.** Does the search fire as the reader types (debounced), or only on an
  explicit submit (button / Enter)? Either is acceptable; commit to one.
- **Persistence across reload.** Do added books survive a page reload, or is in-memory state for the
  session acceptable? In-memory is acceptable for this exercise - but decide it on purpose and say so.

---

## How to start this exercise

1. Check out this branch and read this file:
   ```bash
   git checkout intermediate
   ```
   Then read `intermediate/TASK.md` (this file) in full.
2. Get the app running so you can see your baseline:
   ```bash
   npm install
   npm run dev
   ```
   Open the URL it prints (http://localhost:3000 by default). You should see the nine seeded books with
   working filter tabs - this is your clean starting point. No Add-a-book feature exists yet; building it
   is your job.
3. Close the gaps. Decide each item under "You decide" above. The recommended path is to run `/brief`
   and let it interview you into a finished spec that fills in the partial Brief - that is the spec-first
   habit this tier is teaching.
4. Implement it:
   ```
   /implement-ticket
   ```
   Build `src/lib/openlibrary.ts` (with its module manifest) and the Add-a-book UI you specified, then
   let the workflow run its Skeptic review.

You are done when the happy path works against your own spec: search by title, pick a result, and watch
it land in the reading list as `to-read` with author and year auto-filled - and your decisions for the
loading, empty, error, placement, debounce, and persistence gaps are all reflected in what you shipped.
There is no autograder; you judge the result.
