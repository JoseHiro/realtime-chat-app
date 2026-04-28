import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";
import { createSession } from "../../../features/practice/createSession";
import type { MyJwtPayload } from "../../../types/types";
import type { Direction, Difficulty } from "../../../features/practice/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = req.cookies.access_token;
  const decoded = verifyAuth(token) as MyJwtPayload | null;
  if (!decoded) return res.status(401).json({ error: "Unauthorized" });

  const wordIds: string[] = Array.isArray(req.body.wordIds) ? req.body.wordIds : [];
  const grammarIds: string[] = Array.isArray(req.body.grammarIds) ? req.body.grammarIds : [];
  const direction: Direction = req.body.direction ?? "jp-to-en";
  const difficulty: Difficulty = ["easy", "medium", "hard"].includes(req.body.difficulty)
    ? req.body.difficulty
    : "medium";

  try {
    const result = await createSession({
      userId: decoded.userId,
      wordIds,
      grammarIds,
      direction,
      difficulty,
    });
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create session.";
    return res.status(400).json({ error: message });
  }
}
