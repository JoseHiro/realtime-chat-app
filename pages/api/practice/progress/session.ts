import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../../middleware/auth";
import { prisma } from "../../../../lib/prisma";
import { saveSessionProgress } from "../../../../features/practice/progressService";
import type { MyJwtPayload } from "../../../../types/types";
import type { QuestionResult } from "../../../../features/practice/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = req.cookies.access_token;
  const decoded = verifyAuth(token) as MyJwtPayload | null;
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  const results: QuestionResult[] = Array.isArray(req.body.results) ? req.body.results : [];
  if (results.length === 0) return res.status(400).json({ error: "results is required" });

  const userId = decoded.userId;
  await saveSessionProgress(userId, results);

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayCount = await prisma.practiceLog.count({
    where: { userId, createdAt: { gte: todayStart } },
  });

  return res.status(200).json({ ok: true, todayCount });
}
