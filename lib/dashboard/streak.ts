/** Local calendar date as YYYY-MM-DD (browser timezone). */
export function formatLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function buildActiveDayKeysFromChats(
  chats: { createdAt: string }[],
): Set<string> {
  const set = new Set<string>();
  for (const c of chats) {
    set.add(formatLocalDateKey(new Date(c.createdAt)));
  }
  return set;
}

/**
 * Consecutive days with activity. If today is empty but yesterday counts,
 * streak still runs from yesterday (same-day grace to stay motivated).
 */
export function computeStreak(active: Set<string>, now = new Date()): number {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(start);
  if (!active.has(formatLocalDateKey(d))) {
    d.setDate(d.getDate() - 1);
    if (!active.has(formatLocalDateKey(d))) return 0;
  }
  let count = 0;
  while (active.has(formatLocalDateKey(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

/**
 * Calendar keys (YYYY-MM-DD) that belong to the current streak from `now`
 * backward, using the same anchor rule as {@link computeStreak}.
 * Empty when there is no ongoing streak.
 */
export function buildCurrentStreakDayKeys(
  active: Set<string>,
  now = new Date(),
): Set<string> {
  const keys = new Set<string>();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(start);
  if (!active.has(formatLocalDateKey(d))) {
    d.setDate(d.getDate() - 1);
    if (!active.has(formatLocalDateKey(d))) return keys;
  }
  while (active.has(formatLocalDateKey(d))) {
    keys.add(formatLocalDateKey(d));
    d.setDate(d.getDate() - 1);
  }
  return keys;
}

export type DayCell = {
  date: Date;
  weekdayShort: string;
  dayOfMonth: number;
  active: boolean;
  isToday: boolean;
};

export function buildDayCells(
  active: Set<string>,
  endDate: Date,
  numDays: number,
  weekdayLocale = "en-US",
): DayCell[] {
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );
  const cells: DayCell[] = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const isToday = formatLocalDateKey(d) === formatLocalDateKey(endDate);
    cells.push({
      date: d,
      weekdayShort: d.toLocaleDateString(weekdayLocale, { weekday: "short" }),
      dayOfMonth: d.getDate(),
      active: active.has(formatLocalDateKey(d)),
      isToday,
    });
  }
  return cells;
}
