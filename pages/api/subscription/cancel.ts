import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { verifyAuth } from "../../../middleware/auth";
import { MyJwtPayload } from "../../../types/types";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE!);
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token) as MyJwtPayload | null;

  if (!decodedToken) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        stripeSubscriptionId: true,
        subscriptionStatus: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: "No active subscription found" });
    }

    // Cancel the subscription at period end (don't cancel immediately)
    // This allows users to continue using the service until the end of their billing period
    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update user status in database
    await prisma.user.update({
      where: { id: decodedToken.userId },
      data: {
        subscriptionStatus: "canceled", // Will be active until period end
      },
    });

    return res.status(200).json({
      message: "Subscription will be canceled at the end of the billing period",
      cancelAt: subscription.cancel_at,
      currentPeriodEnd: subscription.current_period_end,
    });
  } catch (err: any) {
    console.error("Stripe cancel subscription error:", err);
    return res.status(500).json({ error: err.message });
  }
}
