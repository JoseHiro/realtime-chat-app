import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe (you'll need your publishable key)
const stripePromise = loadStripe(process.env.NEXT_TEST_NEXT_PUBLIC_STRIPE_KEY!);

const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Call your API to create checkout session
      const response = await fetch("/api/stripe/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_TEST_STRIPE_PRICE_ID_KEY,
          quantity: 1,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Premium Course</h2>
        <p className="text-gray-600 mb-2">Learn Advanced React & Next.js</p>
        <p className="text-3xl font-bold text-green-600 mb-6">$14.99</p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? "Loading..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
