import type { FilterValue, ReadingStatus } from "@/lib/types";

/**
 * Purpose: Single source of truth for the human-readable labels of each
 *          reading status and the "all" filter, so the card badge and the
 *          filter tabs never drift apart.
 *
 * Public API: STATUS_LABELS (per-status labels), FILTER_LABELS (status labels
 *   plus the "all" filter label).
 *
 * Upstream deps: @/lib/types (ReadingStatus, FilterValue). No I/O.
 *
 * Downstream consumers: src/components/BookCard.tsx,
 *   src/components/FilterTabs.tsx.
 *
 * Failure modes: plain constant maps; nothing to throw or retry.
 *
 * Performance: standard.
 */
export const STATUS_LABELS: Record<ReadingStatus, string> = {
  "to-read": "To Read",
  reading: "Reading",
  finished: "Finished",
};

export const FILTER_LABELS: Record<FilterValue, string> = {
  all: "All",
  ...STATUS_LABELS,
};
