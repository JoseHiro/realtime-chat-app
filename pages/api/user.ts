import { NextApiRequest, NextApiResponse } from "next";
import { verifyAuth } from "../../middleware/middleware";
import { PrismaClient } from "@prisma/client";

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

  try {
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        username: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        trialUsedChats: true,
        trialEndsAt: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    let trialStatus: "active" | "ended" | null = null;
    if (user.subscriptionStatus === "trialing") {
      const now = new Date();
      if (user.trialEndsAt && now > user.trialEndsAt) {
        trialStatus = "ended";
      } else if ((user.trialUsedChats ?? 0) >= 2) {
        trialStatus = "ended";
      } else {
        trialStatus = "active";
      }
    }

    return res.status(200).json({
      user: {
        username: user.username,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        createdAt: user.createdAt,
      },
      trialStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
