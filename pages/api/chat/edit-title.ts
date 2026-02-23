import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "../../../middleware/auth";
import { MyJwtPayload } from "../../../types/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token) as MyJwtPayload | null;
  if (!decodedToken) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  const { chatId, newTitle } = req.body;

  if (!chatId || newTitle === "") {
    return res.status(400).json({ error: "chatId and newTitle are required" });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: decodedToken.userId,
      },
    });

    if (!chat) {
      return res
        .status(404)
        .json({ error: "Chat not found or not owned by user" });
    }

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title: newTitle },
    });

    return res.status(200).json({ success: true, chat: updatedChat });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
