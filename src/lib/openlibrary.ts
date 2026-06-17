/**
 * Purpose: Search Open Library by title from the browser so readers can pick a
 *          book to add without typing full metadata.
 *
 * Public API:
 *   - OpenLibraryDoc (interface)
 *   - searchOpenLibrary(title: string): Promise<OpenLibraryDoc[]>
 *
 * Upstream dependencies: `fetch`, public GET
 *   `https://openlibrary.org/search.json?title=<encoded>&limit=5` (no auth,
 *   CORS-open). Response JSON `docs` array shape varies; mapping tolerates
 *   missing fields.
 *
 * Downstream consumers: AddBookPanel (or any UI that imports this module).
 *
 * Failure modes: Throws on network errors, non-OK HTTP status, or invalid JSON.
 *   Callers should catch and show UI-level error copy. Safe to retry the same
 *   query after a transient failure (idempotent read).
 *
 * Performance: One network round-trip per call; typically ~200-800ms depending
 *   on latency and Open Library load.
 */

export interface OpenLibraryDoc {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

type OpenLibrarySearchResponse = {
  docs?: unknown[];
};

function pickTitle(raw: unknown): string {
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
    return raw[0].trim() || "Untitled";
  }
  return "Untitled";
}

function mapDoc(raw: unknown): OpenLibraryDoc | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const d = raw as Record<string, unknown>;
  const title = pickTitle(d.title);
  const author_name = Array.isArray(d.author_name)
    ? d.author_name.filter((a): a is string => typeof a === "string")
    : undefined;
  const first_publish_year =
    typeof d.first_publish_year === "number" ? d.first_publish_year : undefined;
  const cover_i = typeof d.cover_i === "number" ? d.cover_i : undefined;
  return { title, author_name, first_publish_year, cover_i };
}

export async function searchOpenLibrary(
  title: string,
): Promise<OpenLibraryDoc[]> {
  const q = title.trim();
  if (!q) {
    return [];
  }

  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=5`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error while contacting Open Library.");
  }

  if (!response.ok) {
    throw new Error(`Open Library returned HTTP ${response.status}.`);
  }

  let data: OpenLibrarySearchResponse;
  try {
    data = (await response.json()) as OpenLibrarySearchResponse;
  } catch {
    throw new Error("Could not parse Open Library response.");
  }

  const docs = Array.isArray(data.docs) ? data.docs : [];
  const mapped: OpenLibraryDoc[] = [];
  for (const raw of docs) {
    const doc = mapDoc(raw);
    if (doc) {
      mapped.push(doc);
    }
    if (mapped.length >= 5) {
      break;
    }
  }
  return mapped;
}
