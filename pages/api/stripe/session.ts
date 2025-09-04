import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { verifyAuth } from "../../../middleware/middleware";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const stripe = new Stripe(process.env.TEST_STRIPE_SECRET_KEY!);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const token = req.cookies.access_token;
  const decodedToken = verifyAuth(token);
  if (!decodedToken) {
    return res.status(401).json({ error: "Not Authenticated" });
  }

  try {
    const { priceId, quantity = 1, userId } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      metadata: { userId: decodedToken.userId},
      mode: "subscription",
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cancel`,
    });

    // case subscription only month
    res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
};
