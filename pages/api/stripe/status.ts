import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { verifyAuth } from "../../../middleware/middleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);

  // Ensure decodedToken is an object and has userId
  const userId =
    typeof decodedToken === "object" &&
    decodedToken !== null &&
    "userId" in decodedToken
      ? (decodedToken as { userId: string }).userId
      : null;

  if (!userId) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionStatus: true,
        subscriptionPlan: true,
        stripeCustomerId: true,
        trialEndsAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Failed to generate conversation" });
  }
}
