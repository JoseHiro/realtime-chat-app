import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyAuth } from "../../../middleware/middleware";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (!decodedToken) {
    return res.status(400).json({ error: "Not authenticated" });
  }
  const { id } = req.body;

  console.log(id);

  if (!id) {
    return res.status(400).json({ error: "No data provided" });
  }

  try {
    const deletedChat = await prisma.chat.delete({
      where: { id: Number(id), userId: decodedToken.userId },
    });

    return res.status(200).json({ message: "Chat deleted", chat: deletedChat });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error deleting chat", details: error.message });
  }
};
