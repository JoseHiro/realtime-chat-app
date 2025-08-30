import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.TEST_STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false, // Stripe needs the raw body
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET! // the webhook signing secret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("session :", session);

        // You likely passed userId in your checkout session creation metadata
        const userId = session.metadata?.userId;
        if (!userId) {
          console.warn("No userId in session metadata — cannot update user.");
          break;
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string | null,
            subscriptionStatus: "active",
            subscriptionPlan: "pro", // or infer from your product/price ID
          },
        });

        console.log(`✅ User ${userId} subscription info updated`);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Error updating user after webhook:", err);
    res.status(500).send("Internal server error");
  }
};
