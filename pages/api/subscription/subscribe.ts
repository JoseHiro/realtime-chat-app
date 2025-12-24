import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { verifyAuth } from "../../../middleware/middleware";
import { MyJwtPayload } from "../../../type/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE!);

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
    // Create or retrieve Stripe customer
    // For now, we'll create a checkout session
    // In production, you might want to check if customer exists first

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LIVE!,
          quantity: 1,
        },
      ],
      metadata: { userId: decodedToken.userId },
      mode: "subscription", // Changed from "payment" to "subscription"
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/settings?canceled=true`,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe subscription error:", err);
    return res.status(500).json({ error: err.message });
  }
}
