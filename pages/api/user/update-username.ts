import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/middleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);

  if (
    !decodedToken ||
    typeof decodedToken !== "object" ||
    !("userId" in decodedToken)
  ) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (username.length > 50) {
      return res.status(400).json({ error: "Username must be 50 characters or less" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: decodedToken.userId },
      data: { username: username.trim() },
      select: {
        username: true,
      },
    });

    return res.status(200).json({
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update username error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
