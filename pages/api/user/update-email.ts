import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/auth";
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
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser && existingUser.id !== decodedToken.userId) {
      return res.status(400).json({ error: "Email already taken" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: decodedToken.userId },
      data: { email: email.trim().toLowerCase() },
      select: {
        email: true,
      },
    });

    return res.status(200).json({
      message: "Email updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update email error:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already taken" });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
}
