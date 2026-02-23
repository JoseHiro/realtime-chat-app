import { NextApiResponse, NextApiRequest } from "next";
import { verifyAuth } from "../../../middleware/auth";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  const { id } = req.query;
  console.log(id);

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid chat id" });
  }

  const token = req.cookies.access_token;

  const decodedToken = verifyAuth(token);
  if (
    !decodedToken ||
    typeof decodedToken === "string" ||
    !("userId" in decodedToken)
  ) {
    return res.status(400).json({ message: "" });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: Number(id),
        userId: (decodedToken as any).userId,
      },
      include: {
        message: {
          orderBy: {
            createdAt: "asc",
          },
        },
        analysis: true,
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const chatWithReadings = {
      ...chat,
      // message: messagesWithReading,
    };

    return res.status(200).json(chatWithReadings);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to fetch chat" });
  }
}
