import React, { useMemo, useState } from "react";
import { ChevronDown, Flame } from "lucide-react";
import {
  buildActiveDayKeysFromChats,
  buildDayCells,
  computeStreak,
  formatLocalDateKey,
} from "../../../lib/dashboard/streak";
import { ChatDataType } from "../../../types/types";

type ChatLike = Pick<ChatDataType, "createdAt">;

interface StreakCalendarProps {
  chats?: ChatLike[];
}

export const StreakCalendar = ({ chats }: StreakCalendarProps) => {
  const [monthOpen, setMonthOpen] = useState(false);
  const now = useMemo(() => new Date(), []);

  const active = useMemo(
    () => buildActiveDayKeysFromChats(chats ?? []),
    [chats],
  );

  const streak = useMemo(() => computeStreak(active, now), [active, now]);

  const weekCells = useMemo(
    () => buildDayCells(active, now, 7, "ja-JP"),
    [active, now],
  );

  const monthCells = useMemo(
    () => buildDayCells(active, now, 30, "ja-JP"),
    [active, now],
  );

  const weekActiveCount = weekCells.filter((c) => c.active).length;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {streak === 0 ? "No streak yet" : `${streak}-day streak`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
            {weekActiveCount}/7 this week
          </span>
          <button
            type="button"
            onClick={() => setMonthOpen((o) => !o)}
            className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-expanded={monthOpen}
          >
            <span>30d</span>
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${monthOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {/* Week dots */}
      <div className="flex justify-between gap-1">
        {weekCells.map((cell) => (
          <div
            key={formatLocalDateKey(cell.date)}
            className="flex flex-1 flex-col items-center gap-1 min-w-0"
          >
            <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wide">
              {cell.weekdayShort}
            </span>
            <div
              className={[
                "flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-medium tabular-nums transition-colors",
                cell.active
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500",
                cell.isToday && !cell.active
                  ? "ring-1 ring-gray-400 dark:ring-gray-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {cell.dayOfMonth}
            </div>
          </div>
        ))}
      </div>

      {/* 30-day expand */}
      <div
        className={`grid overflow-hidden transition-all duration-200 ease-out ${
          monthOpen ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid grid-cols-7 gap-1">
            {monthCells.map((cell) => (
              <div
                key={`m-${formatLocalDateKey(cell.date)}`}
                title={`${cell.weekdayShort} ${cell.dayOfMonth}`}
                className={[
                  "aspect-square max-h-6 rounded transition-colors",
                  cell.active
                    ? "bg-gray-900 dark:bg-gray-100"
                    : "bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60",
                  cell.isToday ? "ring-1 ring-gray-400 dark:ring-gray-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
