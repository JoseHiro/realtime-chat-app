import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe (you'll need your publishable key)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_TEST_NEXT_PUBLIC_STRIPE_KEY!
);
export const startStripeSession = async (userId: string) => {
  console.log(
    process.env.NEXT_TEST_STRIPE_PRICE_ID_KEY,
    process.env.NEXT_PUBLIC_TEST_STRIPE_PRICE_ID_KEY
  );

  console.log(userId);

  try {
    // Call your API to create checkout session
    const response = await fetch("/api/stripe/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_TEST_STRIPE_PRICE_ID_KEY, // Replace with your actual Stripe Price ID
        quantity: 1,
        userId: userId,
      }),
    });

    const { sessionId } = await response.json();
    console.log(sessionId);

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
