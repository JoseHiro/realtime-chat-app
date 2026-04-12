import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { MyJwtPayload } from "../../../types/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token) as MyJwtPayload | null;
  if (!decodedToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const {
    level,
    theme,
    politeness,
    characterName = "Sakura",
    time = 3,
  } = req.body;

  try {
    const newChat = await prisma.chat.create({
      data: {
        userId: decodedToken.userId,
        title: "Free chat",
        theme: theme,
        politeness: politeness,
        level: level,
        characterName: characterName,
        time: time,
      },
    });

    return res.status(200).json(newChat);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Failed to generate conversation" });
  }
}
