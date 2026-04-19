import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import type { MyJwtPayload } from "../../../types/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.access_token;
  const decoded = verifyAuth(token) as MyJwtPayload | null;
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  const userId = decoded.userId;

  if (req.method === "GET") {
    const words = await prisma.practiceWord.findMany({
      where: { userId },
      select: { id: true, jp: true, en: true },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json({ words });
  }

  if (req.method === "POST") {
    const { jp, en } = req.body;
    if (!jp || !en) return res.status(400).json({ error: "jp and en are required" });
    const word = await prisma.practiceWord.create({
      data: { jp, en, userId },
      select: { id: true, jp: true, en: true },
    });
    return res.status(201).json(word);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });
    await prisma.practiceWord.deleteMany({ where: { id, userId } });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
