import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { verifyAuth } from "../../../middleware/middleware";
import { MyJwtPayload } from "../../../type/types";
import { PrismaClient } from "@prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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
        stripeCustomerId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "No Stripe customer found" });
    }

    // Create a billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${BASE_URL}/settings`,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return res.status(500).json({ error: err.message });
  }
}
