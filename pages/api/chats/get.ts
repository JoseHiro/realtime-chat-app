import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "../../../middleware/auth";
import { MyJwtPayload } from "../../../types/types";
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token) as MyJwtPayload | null
  if (!decodedToken || !decodedToken.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  // if not userId

  try {
    const token = req.cookies.access_token;
    const decodedToken = verifyAuth(token) as MyJwtPayload | null;
    if (!decodedToken || typeof decodedToken !== "object" || !("userId" in decodedToken)) {
      return res.status(401).json({ error: "Not authenticated" });
    }
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

    if (user && user.chats) {
      return res.status(200).json({ chats: user.chats });
    }
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
