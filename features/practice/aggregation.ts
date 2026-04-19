import type { WordProgress, QuestionResult, WordSessionStats, MasteryState } from "./types";

const RECENT_SCORES_WINDOW = 10;

export function aggregateSession(results: QuestionResult[]): WordSessionStats[] {
  const byWord = new Map<string, { attempts: number; correct: number }>();
  for (const { wordId, correct } of results) {
    const entry = byWord.get(wordId) ?? { attempts: 0, correct: 0 };
    entry.attempts += 1;
    if (correct) entry.correct += 1;
    byWord.set(wordId, entry);
  }
  return Array.from(byWord.entries()).map(([wordId, { attempts, correct }]) => ({
    wordId,
    attempts,
    correct,
    score: attempts > 0 ? correct / attempts : 0,
  }));
}

export function updateWordProgress(
  existing: WordProgress | null,
  wordId: string,
  userId: string,
  stats: WordSessionStats,
  now: Date = new Date(),
): WordProgress {
  const base: WordProgress = existing ?? {
    wordId,
    userId,
    lifetimeAttempts: 0,
    lifetimeCorrect: 0,
    recentSessionScores: [],
    lastSessionScore: null,
    lastSeen: null,
  };
  const recentSessionScores = [...base.recentSessionScores, stats.score];
  if (recentSessionScores.length > RECENT_SCORES_WINDOW) recentSessionScores.shift();
  return {
    ...base,
    lifetimeAttempts: base.lifetimeAttempts + stats.attempts,
    lifetimeCorrect: base.lifetimeCorrect + stats.correct,
    recentSessionScores,
    lastSessionScore: stats.score,
    lastSeen: now,
  };
}

export function getMastery(progress: WordProgress): MasteryState {
  const sessions = progress.recentSessionScores.length;
  if (sessions === 0) return "new";
  if (sessions < 3) return "learning";
  const recentAvg = progress.recentSessionScores.reduce((s, n) => s + n, 0) / sessions;
  if (sessions >= 8 && recentAvg >= 0.9) return "mastered";
  if (sessions >= 5 && recentAvg >= 0.8) return "strong";
  if (recentAvg >= 0.6) return "familiar";
  return "learning";
}
