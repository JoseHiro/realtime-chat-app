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
    const decks = await prisma.practiceWordDeck.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json(
      decks.map((d) => ({
        id: d.id,
        name: d.name,
        wordIds: Array.isArray(d.wordIds) ? d.wordIds : [],
      })),
    );
  }

  if (req.method === "POST") {
    const { name, wordIds = [] } = req.body;
    if (!name) return res.status(400).json({ error: "name is required" });
    const existing = await prisma.practiceWordDeck.count({ where: { userId } });
    if (existing >= 1) return res.status(400).json({ error: "Only one deck is allowed" });
    const deck = await prisma.practiceWordDeck.create({
      data: { userId, name, wordIds },
    });
    return res.status(201).json(deck);
  }

  if (req.method === "PATCH") {
    const { id, wordIds } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });
    const deck = await prisma.practiceWordDeck.updateMany({
      where: { id, userId },
      data: { wordIds: Array.isArray(wordIds) ? wordIds : [] },
    });
    if (deck.count === 0) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id is required" });
    await prisma.practiceWordDeck.deleteMany({ where: { id, userId } });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
