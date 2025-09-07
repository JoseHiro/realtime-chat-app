import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "../../../middleware/middleware";
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (!decodedToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  // if not userId

  try {
    const token = req.cookies.access_token;
    const decodedToken = verifyAuth(token);
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      include: {
        chats: {
          orderBy: { createdAt: "desc" }, // 作成順にソート
          include: {
            message: {
              orderBy: { createdAt: "asc" }, // メッセージも作成順にソート
            },
          },
        },
      },
    });

    if (user.chats) {
      return res.status(200).json({ chats: user.chats });
    }
  } catch (error) {
    res.status(400).json({ error: "" });
  }
};
