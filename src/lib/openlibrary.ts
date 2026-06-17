/**
 * Purpose: Thin client for the Open Library title search endpoint. Given a
 *          title query it returns up to 5 narrowed result docs for the add-book
 *          flow, with no API key and no auth (CORS-open, called from the browser).
 *
 * Public API:
 *   OpenLibraryDoc (the narrowed result shape)
 *   searchOpenLibrary(title: string): Promise<OpenLibraryDoc[]>
 *
 * Upstream deps: the public Open Library endpoint
 *   GET https://openlibrary.org/search.json?title=<q>&limit=5 (via global fetch).
 *   No React, no component, and no @/lib/types import - this module is UI-agnostic.
 *
 * Downstream consumers: src/components/AddBookPanel.tsx.
 *
 * Failure modes: REJECTS (the promise throws) on a network failure (fetch
 *   rejects and the rejection propagates uncaught), on a non-OK HTTP status
 *   (throws "Open Library search failed: <status>"), on invalid JSON (response
 *   .json() rejects and propagates), and on an unexpected response shape - a body
 *   missing a `docs` array (throws "...unexpected response shape"). A successful
 *   response whose `docs` array is empty RESOLVES with [] - that is a legitimate
 *   "no matches", NOT an error. The call is side-effect-free and safe to retry:
 *   each invocation issues one independent GET.
 *
 * Performance: one network round-trip per call; the public endpoint typically
 *   responds in a few hundred ms. Results are capped at 5 docs and lightly
 *   narrowed, so post-fetch work is negligible.
 */

export interface OpenLibraryDoc {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function toDoc(raw: unknown): OpenLibraryDoc {
  const source =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};

  const doc: OpenLibraryDoc = {
    title: typeof source.title === "string" ? source.title : "",
  };

  if (isStringArray(source.author_name)) {
    doc.author_name = source.author_name;
  }
  if (typeof source.first_publish_year === "number") {
    doc.first_publish_year = source.first_publish_year;
  }
  if (typeof source.cover_i === "number") {
    doc.cover_i = source.cover_i;
  }

  return doc;
}

export async function searchOpenLibrary(
  title: string,
): Promise<OpenLibraryDoc[]> {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=5`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open Library search failed: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !Array.isArray((data as { docs?: unknown }).docs)
  ) {
    throw new Error("Open Library search returned an unexpected response shape");
  }

  const docs = (data as { docs: unknown[] }).docs;
  return docs.slice(0, 5).map(toDoc);
}
