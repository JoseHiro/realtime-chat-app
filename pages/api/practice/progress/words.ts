import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../../middleware/auth";
import { prisma } from "../../../../lib/prisma";
import { getMastery } from "../../../../features/practice/aggregation";
import type { MyJwtPayload } from "../../../../types/types";
import type { WordProgressSummary } from "../../../../features/practice/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.access_token;
  const decoded = verifyAuth(token) as MyJwtPayload | null;
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const rows = await prisma.practiceWordProgress.findMany({
    where: { userId: decoded.userId },
  });

  const result: WordProgressSummary[] = rows.map((row) => ({
    wordId: row.wordId,
    mastery: getMastery({
      wordId: row.wordId,
      userId: row.userId,
      lifetimeAttempts: row.lifetimeAttempts,
      lifetimeCorrect: row.lifetimeCorrect,
      recentSessionScores: Array.isArray(row.recentSessionScores)
        ? (row.recentSessionScores as number[])
        : [],
      lastSessionScore: row.lastSessionScore,
      lastSeen: row.lastSeen,
    }),
    lifetimeAttempts: row.lifetimeAttempts,
    lifetimeCorrect: row.lifetimeCorrect,
    lastSeen: row.lastSeen?.toISOString() ?? null,
  }));

  return res.status(200).json(result);
}
