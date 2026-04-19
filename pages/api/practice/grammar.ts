import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import type { MyJwtPayload } from "../../../types/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.access_token;
  const decoded = verifyAuth(token) as MyJwtPayload | null;
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const grammar = await prisma.grammar.findMany({
    select: { id: true, pattern: true, meaning: true, jlptLevel: true, source: true },
    orderBy: { createdAt: "asc" },
  });
  return res.status(200).json(grammar);
}
