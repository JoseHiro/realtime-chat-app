import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import type { MyJwtPayload } from "../../../types/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const token = req.cookies.access_token;
  const decoded = verifyAuth(token) as MyJwtPayload | null;
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  const logs = await prisma.practiceLog.findMany({
    where: { userId: decoded.userId },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Deduplicate by local date string to avoid sending thousands of entries
  const seen = new Set<string>();
  const dates: { createdAt: string }[] = [];
  for (const log of logs) {
    const key = log.createdAt.toISOString().slice(0, 10);
    if (!seen.has(key)) {
      seen.add(key);
      dates.push({ createdAt: log.createdAt.toISOString() });
    }
  }

  return res.status(200).json({ dates });
}
