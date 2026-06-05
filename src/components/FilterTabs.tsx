import type { FilterValue } from "@/lib/types";
import { FILTER_LABELS } from "@/lib/labels";

interface FilterTabsProps {
  active: FilterValue;
  counts: Record<FilterValue, number>;
  onChange: (next: FilterValue) => void;
}

// Fixed tab order is a binding contract: All, To Read, Reading, Finished.
const TAB_ORDER: FilterValue[] = ["all", "to-read", "reading", "finished"];

export function FilterTabs({ active, counts, onChange }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter books by reading status"
      className="flex flex-wrap gap-2"
    >
      {TAB_ORDER.map((value) => {
        const isActive = value === active;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            <span>{FILTER_LABELS[value]}</span>
            <span
              className={`inline-flex min-w-5 justify-center rounded-full px-1.5 text-xs font-semibold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {counts[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
