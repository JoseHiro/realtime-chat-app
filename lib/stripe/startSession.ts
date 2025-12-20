import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "../apiRequest";

// Initialize Stripe (you'll need your publishable key)
const stripePromise = loadStripe(
  // process.env.NEXT_PUBLIC_TEST_NEXT_PUBLIC_STRIPE_KEY!
  process.env.NEXT_PUBLIC_STRIPE_KEY_LIVE!
);

export const startStripeSession = async () => {
  try {
    // Call your API to create checkout session
    const response = await fetch("/api/stripe/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        // priceId: process.env.NEXT_PUBLIC_TEST_STRIPE_PRICE_ID_KEY,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LIVE,
        quantity: 1,
      }),
    });

    const data = await response.json();
    // console.log("Session response:", data);
    const { sessionId } = data;
    // console.log("sessionId", sessionId);

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe.js failed to load.");
      return;
    }
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      console.error("Stripe checkout error:", error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
