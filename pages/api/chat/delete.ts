import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "../../../middleware/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (!decodedToken || typeof decodedToken === "string" || !("userId" in decodedToken)) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "No data provided" });
  }

  try {
    const deletedChat = await prisma.chat.delete({
      where: { id: Number(id), userId: (decodedToken as any).userId },
    });

    return res.status(200).json({ message: "Chat deleted", chat: deletedChat });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error deleting chat", details: error.message });
  }
}
