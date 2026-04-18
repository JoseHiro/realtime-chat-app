import { prisma } from "../../lib/prisma";
import type { WordProgress, QuestionResult } from "./types";
import { aggregateSession, updateWordProgress } from "./aggregation";

function toWordProgress(row: {
  wordId: string;
  userId: string;
  lifetimeAttempts: number;
  lifetimeCorrect: number;
  recentSessionScores: unknown;
  lastSessionScore: number | null;
  lastSeen: Date | null;
}): WordProgress {
  return {
    wordId: row.wordId,
    userId: row.userId,
    lifetimeAttempts: row.lifetimeAttempts,
    lifetimeCorrect: row.lifetimeCorrect,
    recentSessionScores: Array.isArray(row.recentSessionScores)
      ? (row.recentSessionScores as number[])
      : [],
    lastSessionScore: row.lastSessionScore,
    lastSeen: row.lastSeen,
  };
}

export async function saveSessionProgress(
  userId: string,
  results: QuestionResult[],
): Promise<void> {
  if (results.length === 0) return;

  const sessionStats = aggregateSession(results);
  const wordIds = sessionStats.map((s) => s.wordId);

  const existing = await prisma.practiceWordProgress.findMany({
    where: { userId, wordId: { in: wordIds } },
  });
  const existingMap = new Map(existing.map((r) => [r.wordId, toWordProgress(r)]));

  const now = new Date();
  const updates = sessionStats.map((stats) =>
    updateWordProgress(existingMap.get(stats.wordId) ?? null, stats.wordId, userId, stats, now),
  );

  await prisma.$transaction([
    ...updates.map((p) =>
      prisma.practiceWordProgress.upsert({
        where: { userId_wordId: { userId, wordId: p.wordId } },
        create: {
          userId,
          wordId: p.wordId,
          lifetimeAttempts: p.lifetimeAttempts,
          lifetimeCorrect: p.lifetimeCorrect,
          recentSessionScores: p.recentSessionScores,
          lastSessionScore: p.lastSessionScore,
          lastSeen: p.lastSeen,
        },
        update: {
          lifetimeAttempts: p.lifetimeAttempts,
          lifetimeCorrect: p.lifetimeCorrect,
          recentSessionScores: p.recentSessionScores,
          lastSessionScore: p.lastSessionScore,
          lastSeen: p.lastSeen,
        },
      }),
    ),
    prisma.practiceLog.createMany({
      data: results.map((r) => ({ userId, correct: r.correct })),
    }),
  ]);
}
