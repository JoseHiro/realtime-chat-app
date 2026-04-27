import React, { useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import {
  buildActiveDayKeysFromChats,
  buildCurrentStreakDayKeys,
  buildDayCells,
  computeStreak,
  formatLocalDateKey,
} from "../../../lib/dashboard/streak";

interface StreakCalendarProps {
  activities?: { createdAt: string }[];
}

const MILESTONES = [3, 7, 14, 30, 60, 100, 365];

function getNextMilestone(streak: number): number {
  return MILESTONES.find((m) => m > streak) ?? MILESTONES[MILESTONES.length - 1];
}

function getMotivationalMessage(streak: number, nextMilestone: number): string {
  const remaining = nextMilestone - streak;
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "Great start! Come back tomorrow.";
  if (streak < 3) return `${remaining} day${remaining > 1 ? "s" : ""} to your first milestone!`;
  if (streak === 3) return "3 days — you're building a habit! 🌱";
  if (streak < 7) return `${remaining} day${remaining > 1 ? "s" : ""} until one week!`;
  if (streak === 7) return "One week streak! Keep the fire burning 🔥";
  if (streak < 14) return `${remaining} day${remaining > 1 ? "s" : ""} to two weeks!`;
  if (streak === 14) return "Two weeks! You're on a roll 🚀";
  if (streak < 30) return `${remaining} day${remaining > 1 ? "s" : ""} to one month!`;
  if (streak === 30) return "One whole month! Incredible 🏆";
  if (streak < 60) return `${remaining} day${remaining > 1 ? "s" : ""} to 60 days!`;
  if (streak === 60) return "60 days strong — you're unstoppable 🌟";
  if (streak < 100) return `${remaining} day${remaining > 1 ? "s" : ""} to 100 days!`;
  if (streak === 100) return "100 day streak! Legendary 🎌";
  return `${streak} days and counting. Legendary 🎌`;
}

export const StreakCalendar = ({ activities }: StreakCalendarProps) => {
  const [monthOpen, setMonthOpen] = useState(false);
  const now = useMemo(() => new Date(), []);

  const active = useMemo(
    () => buildActiveDayKeysFromChats(activities ?? []),
    [activities],
  );

  const streak = useMemo(() => computeStreak(active, now), [active, now]);

  const streakDayKeys = useMemo(
    () => buildCurrentStreakDayKeys(active, now),
    [active, now],
  );

  const weekCells = useMemo(
    () => buildDayCells(active, now, 7, "en-US"),
    [active, now],
  );

  const monthCells = useMemo(
    () => buildDayCells(active, now, 30, "en-US"),
    [active, now],
  );

  const monthGridCells = useMemo(() => {
    if (monthCells.length === 0) return [];
    const firstDate = monthCells[0].date;
    const lastDate = monthCells[monthCells.length - 1].date;
    const start = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      firstDate.getDate() - firstDate.getDay(),
    );
    const cellMap = new Map(monthCells.map((c) => [formatLocalDateKey(c.date), c]));
    const result: (typeof monthCells[0] | null)[] = [];
    const d = new Date(start);
    while (d <= lastDate || result.length % 7 !== 0) {
      result.push(cellMap.get(formatLocalDateKey(d)) ?? null);
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [monthCells]);

  const monthRangeLabel = useMemo(() => {
    if (monthCells.length === 0) return "";
    const start = monthCells[0].date;
    const end = monthCells[monthCells.length - 1].date;
    const sameMonthYear = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonthYear) {
      return `${start.toLocaleDateString("en-US", { month: "long", year: "numeric" })} — ${start.getDate()}–${end.getDate()}`;
    }
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }, [monthCells]);

  const nextMilestone = getNextMilestone(streak);
  const milestoneProgress = streak > 0 ? Math.min(streak / nextMilestone, 1) : 0;
  const prevMilestone = MILESTONES.filter((m) => m <= streak).pop() ?? 0;
  const progressFromPrev = streak - prevMilestone;
  const rangeTotal = nextMilestone - prevMilestone;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">

      {/* Streak hero */}
      <div className={`px-5 py-5 ${streak > 0 ? "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border-b border-orange-100 dark:border-orange-900/30" : "border-b border-gray-100 dark:border-gray-800"}`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100 tabular-nums leading-none">
                {streak > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-3xl leading-none">🔥</span>
                    {streak}
                  </span>
                ) : (
                  <span className="text-2xl leading-none opacity-30">🔥</span>
                )}
              </span>
              {streak > 0 && (
                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  day streak
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {getMotivationalMessage(streak, nextMilestone)}
            </p>
          </div>

          {/* Milestone badge */}
          {streak > 0 && (
            <div className="shrink-0 text-right">
              <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Next</p>
              <div className="flex items-center gap-1">
                <span className="text-xl leading-none">🎯</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{nextMilestone}d</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {streak > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-1.5">
              <span>{prevMilestone > 0 ? `${prevMilestone}d` : "Start"}</span>
              <span>{progressFromPrev}/{rangeTotal} days</span>
              <span>{nextMilestone}d</span>
            </div>
            <div className="h-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-500 dark:to-amber-400 transition-all duration-500"
                style={{ width: `${(progressFromPrev / rangeTotal) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Week calendar */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">This week</p>
          <button
            type="button"
            onClick={() => setMonthOpen((o) => !o)}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-expanded={monthOpen}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-[10px]">30 days</span>
            <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${monthOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="flex justify-between gap-1">
          {weekCells.map((cell) => {
            const key = formatLocalDateKey(cell.date);
            const inStreak = streakDayKeys.has(key);
            return (
              <div key={key} className="flex flex-1 flex-col items-center gap-1 min-w-0">
                <span className={[
                  "text-[10px] uppercase tracking-wide",
                  cell.isToday
                    ? "font-semibold text-orange-500 dark:text-orange-400"
                    : "text-gray-400 dark:text-gray-600",
                ].join(" ")}>
                  {cell.weekdayShort}
                </span>
                <div className={[
                  "flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-semibold tabular-nums transition-all",
                  inStreak
                    ? "bg-orange-400 dark:bg-orange-500 text-white shadow-sm shadow-orange-200 dark:shadow-orange-900"
                    : cell.active
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600",
                  cell.isToday
                    ? "ring-2 ring-orange-400 dark:ring-orange-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                    : "",
                ].filter(Boolean).join(" ")}>
                  {inStreak ? "🔥" : cell.dayOfMonth}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-day expand */}
      <div className={`grid overflow-hidden transition-all duration-200 ease-out ${
        monthOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}>
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 pt-0 border-t border-gray-100 dark:border-gray-800">
            <div className="mb-2 mt-3 space-y-0.5">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-100">{monthRangeLabel}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug">
                Sun–Sat · oldest top-left → today bottom-right
              </p>
            </div>
            <div className="grid grid-cols-7 gap-1 justify-items-center">
              {(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const).map((d) => (
                <div key={d} className="flex h-7 w-7 items-center justify-center text-[9px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {d}
                </div>
              ))}
              {monthGridCells.map((cell, idx) => {
                if (!cell) return <div key={`empty-${idx}`} className="h-7 w-7 rounded bg-transparent" aria-hidden />;
                const key = formatLocalDateKey(cell.date);
                const inStreak = streakDayKeys.has(key);
                const monthShort = cell.date.toLocaleDateString("en-US", { month: "short" });
                const cellIdx = monthCells.indexOf(cell);
                const prev = cellIdx > 0 ? monthCells[cellIdx - 1] : null;
                const showMonthChip = !prev || cell.date.getMonth() !== prev.date.getMonth() || cell.date.getFullYear() !== prev.date.getFullYear();
                return (
                  <div
                    key={`m-${key}`}
                    title={`${cell.weekdayShort} ${monthShort} ${cell.dayOfMonth}${inStreak ? " 🔥" : cell.active ? " · past activity" : ""}`}
                    className={[
                      "flex h-7 w-7 flex-col items-center justify-center rounded-lg text-[11px] font-medium tabular-nums leading-none transition-colors",
                      inStreak
                        ? "bg-orange-400 dark:bg-orange-500 text-white"
                        : cell.active
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                          : "bg-gray-100 text-gray-300 dark:bg-gray-800 dark:text-gray-600",
                      cell.isToday ? "ring-2 ring-orange-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" : "",
                    ].filter(Boolean).join(" ")}
                  >
                    <span>{cell.dayOfMonth}</span>
                    {showMonthChip && (
                      <span className={["mt-0.5 max-w-full truncate text-[7px] font-medium uppercase tracking-wide", inStreak ? "text-white/80" : "text-gray-400 dark:text-gray-500"].join(" ")}>
                        {monthShort}
                      </span>
                    )}
                    {!showMonthChip && <span className="mt-0.5 h-[9px]" aria-hidden />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
