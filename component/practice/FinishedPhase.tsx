import { useState, useEffect, useMemo } from "react";
import { ProgressBar } from "./ProgressBar";
import type { SessionQuestion, MasteryState, WordProgressSummary } from "../../features/practice/types";
import type { QuestionResult } from "../../hooks/practice/usePractice";

const STREAK_MIN = 10;

const masteryColors: Record<MasteryState, string> = {
  new:      "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  learning: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
  familiar: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
  strong:   "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
  mastered: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400",
};

const masteryLabel: Record<MasteryState, string> = {
  new: "New", learning: "Learning", familiar: "Familiar", strong: "Strong", mastered: "Mastered",
};

interface FinishedPhaseProps {
  session: SessionQuestion[];
  results: (QuestionResult | null)[];
  retryCounts: Map<string, number>;
  progressMap: Record<string, WordProgressSummary>;
  updatedProgressMap: Record<string, WordProgressSummary> | null;
  todayCount: number | null;
  onTryAgain: () => void;
  onFinish: () => void;
}

type LevelUpPhase = "before" | "spinning" | "after";

export function FinishedPhase({
  session, results, retryCounts, progressMap, updatedProgressMap, todayCount,
  onTryAgain, onFinish,
}: FinishedPhaseProps) {
  const [levelUpPhase, setLevelUpPhase] = useState<LevelUpPhase>("before");

  const totalCorrect = results.filter((r) => r?.correct).length;
  const pct = Math.round((totalCorrect / Math.max(session.length, 1)) * 100);
  const streakComplete = todayCount !== null ? todayCount >= STREAK_MIN : null;
  const streakRemaining = todayCount !== null ? Math.max(0, STREAK_MIN - todayCount) : STREAK_MIN - session.length;

  const uniqueWords = useMemo(() => {
    const seen = new Set<string>();
    const list: SessionQuestion["wordUsed"][] = [];
    for (const q of session) {
      if (!seen.has(q.wordUsed.id)) { seen.add(q.wordUsed.id); list.push(q.wordUsed); }
    }
    return list;
  }, [session]);

  const leveledUpIds = useMemo(() => {
    if (!updatedProgressMap) return new Set<string>();
    return new Set(
      uniqueWords
        .filter((w) => {
          const before = progressMap[w.id]?.mastery ?? "new";
          const after = updatedProgressMap[w.id]?.mastery;
          return after && after !== before;
        })
        .map((w) => w.id),
    );
  }, [updatedProgressMap, uniqueWords, progressMap]);

  useEffect(() => {
    if (leveledUpIds.size === 0) return;
    setLevelUpPhase("before");
    const t1 = setTimeout(() => setLevelUpPhase("spinning"), 600);
    const t2 = setTimeout(() => setLevelUpPhase("after"), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [leveledUpIds]);

  return (
    <div className="space-y-8">
      {/* Score */}
      <div className="text-center space-y-3">
        <p className="text-5xl font-bold text-gray-900 dark:text-gray-100">
          {totalCorrect}
          <span className="text-2xl font-normal text-gray-400 dark:text-gray-500"> / {session.length}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{pct}% correct</p>
        <div className="max-w-xs mx-auto">
          <ProgressBar value={totalCorrect} total={session.length} color="score" />
        </div>
      </div>

      {/* Streak banner */}
      {streakComplete === null ? null : streakComplete ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">Day practice complete!</p>
            <p className="text-xs text-orange-600 dark:text-orange-400">Your streak has been updated.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <span className="text-xl">🔥</span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {streakRemaining} more {streakRemaining === 1 ? "question" : "questions"} to complete today&apos;s streak.
          </p>
        </div>
      )}

      {/* Sentences practiced */}
      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Sentences practiced</p>
        <div className="space-y-2">
          {session.map((q, i) => {
            const r = results[i];
            return (
              <div
                key={`${q.id}-${i}`}
                className={`p-3 rounded-xl border text-sm ${
                  r?.correct
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 font-semibold shrink-0 ${r?.correct ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                    {r?.correct ? "✓" : "✗"}
                  </span>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-gray-800 dark:text-gray-200">{q.sentence}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">{q.translation}</p>
                    {r && !r.correct && (
                      <div className="pt-1 space-y-0.5">
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Your answer: <span className="italic">{r.answer}</span>
                        </p>
                        {r.feedback && (
                          <p className="text-xs text-red-700 dark:text-red-400">{r.feedback}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Word status */}
      <div>
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Word status</p>
        <div className="rounded-lg border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {uniqueWords.map((word) => {
            const retries = retryCounts.get(word.id) ?? 0;
            const beforeMastery = progressMap[word.id]?.mastery ?? "new";
            const afterMastery = updatedProgressMap?.[word.id]?.mastery ?? null;
            const didLevelUp = leveledUpIds.has(word.id);
            const masteryChanged = afterMastery && afterMastery !== beforeMastery;

            const wordResults = session
              .map((q, i) => q.wordUsed.id === word.id ? results[i] : null)
              .filter(Boolean) as QuestionResult[];
            const finalCorrect = wordResults[wordResults.length - 1]?.correct ?? false;

            return (
              <div key={word.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{word.jp}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{word.en}</span>
                  {retries > 0 && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 shrink-0">
                      ↻{retries}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {didLevelUp && masteryChanged ? (
                    <div className="flex items-center gap-1">
                      {levelUpPhase === "before" && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${masteryColors[beforeMastery]}`}>
                          {masteryLabel[beforeMastery]}
                        </span>
                      )}
                      {levelUpPhase === "spinning" && (
                        <>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${masteryColors[beforeMastery]}`}>
                            {masteryLabel[beforeMastery]}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">→</span>
                          <span className="inline-block animate-spin text-base leading-none">🌀</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">→</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium opacity-40 ${masteryColors[afterMastery]}`}>
                            {masteryLabel[afterMastery]}
                          </span>
                        </>
                      )}
                      {levelUpPhase === "after" && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium animate-bounce ${masteryColors[afterMastery]}`}>
                          {masteryLabel[afterMastery]} ⬆
                        </span>
                      )}
                    </div>
                  ) : masteryChanged ? (
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${masteryColors[beforeMastery]}`}>
                        {masteryLabel[beforeMastery]}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">→</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${masteryColors[afterMastery]}`}>
                        {masteryLabel[afterMastery]}
                      </span>
                    </div>
                  ) : (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${masteryColors[afterMastery ?? beforeMastery]}`}>
                      {masteryLabel[afterMastery ?? beforeMastery]}
                    </span>
                  )}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    finalCorrect
                      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                  }`}>
                    {finalCorrect ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {!updatedProgressMap && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 animate-pulse">Updating mastery…</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onTryAgain}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Try again
        </button>
        <button
          onClick={onFinish}
          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
