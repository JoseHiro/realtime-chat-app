import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { verifyAuth } from "../../../middleware/middleware";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (!decodedToken) {
    return res.status(400).json({ error: "Not authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
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
};
