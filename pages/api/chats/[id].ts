import { NextApiResponse, NextApiRequest } from "next";
import { verifyAuth } from "../../../middleware/middleware";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { convertHira } from "../../../lib/convertHira";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  const { id } = req.query;
  const token = req.cookies.access_token;

  const decodedToken = verifyAuth(token);
  if (!decodedToken) {
    return res.status(400).json({ message: "" });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id), // convert string to number
        userId: decodedToken.userId,
      },
      include: {
        message: {
          orderBy: {
            createdAt: "asc", // or "desc" if you want newest first
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const messagesWithReading = await Promise.all(
      chat.message.map(async (msg) => ({
        ...msg,
        reading: await convertHira(msg.message),
      }))
    );

    const chatWithReadings = {
      ...chat,
      message: messagesWithReading,
    };

    return res.status(200).json(chatWithReadings);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Failed to fetch chat" });
  }
};
