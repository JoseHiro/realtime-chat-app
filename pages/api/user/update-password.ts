import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../../middleware/middleware";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decodedToken.userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
