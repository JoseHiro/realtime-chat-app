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
    return res.status(400).json({ error: "Not authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.subscriptionStatus === "trialing") {
      const now = new Date();
      console.log(now);

      if (user.trialEndsAt && now > user.trialEndsAt) {
        return res
          .status(403)
          .json({ error: "Trial period ended. Please subscribe." });
      }
      if ((user.trialUsedChats ?? 0) >= 2) {
        return res
          .status(403)
          .json({ error: "Trial limit reached. Please subscribe." });
      }

      // チャット回数をカウント
      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: { trialUsedChats: (user.trialUsedChats ?? 0) + 1 },
      // });
    }
    return res.status(200).json({ message: "" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
