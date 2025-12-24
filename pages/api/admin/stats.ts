import { NextApiRequest, NextApiResponse } from "next";
import { verifyAdminAuth } from "../../../middleware/adminMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.admin_token;
  const decodedToken = verifyAdminAuth(token);

  if (!decodedToken) {
    return res.status(401).json({ error: "Not authenticated as admin" });
  }

  try {
    const [totalUsers, totalChats, activeSubscriptions, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.chat.count(),
        prisma.user.count({
          where: {
            subscriptionStatus: "active",
          },
        }),
        prisma.user.findMany({
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            subscriptionPlan: true,
          },
        }),
      ]);

    return res.status(200).json({
      totalUsers,
      totalChats,
      activeSubscriptions,
      recentUsers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
