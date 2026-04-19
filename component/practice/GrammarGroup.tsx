import { useState } from "react";
import type { GrammarItem } from "../../hooks/practice/useSetupData";

export function GrammarGroup({
  label,
  items,
  selectedIds,
  onToggle,
}: {
  label: string;
  items: GrammarItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 text-left"
      >
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="divide-y divide-gray-100">
          {items.map((g) => (
            <label
              key={g.id}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedIds.has(g.id)}
                onChange={() => onToggle(g.id)}
                className="accent-green-600 w-4 h-4 shrink-0"
              />
              <span className="text-sm font-medium text-gray-800">{g.pattern}</span>
              <span className="text-xs text-gray-400">{g.meaning}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
