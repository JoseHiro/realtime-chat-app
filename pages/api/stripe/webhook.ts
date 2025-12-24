import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE!);

export const config = {
  api: {
    bodyParser: false, // Stripe needs the raw body
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  console.log("Called");

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
    console.error("Webhook signature verification failed:");
    console.error("Error object:", err); // full error object
    console.error("Error message:", err.message); // error message only
    console.error("Raw Stripe Signature header:", sig);

    // optional: write the raw body to inspect it
    const rawBody = (await buffer(req)).toString("utf8");
    console.error("Raw body:", rawBody);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

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
            subscriptionPlan: "pro",
          },
        });
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Find user by subscription ID
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status === "active" && !subscription.cancel_at_period_end
                ? "active"
                : subscription.cancel_at_period_end
                ? "canceled"
                : subscription.status,
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Find user by subscription ID
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: "canceled",
              subscriptionPlan: null,
            },
          });
        }
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
}
