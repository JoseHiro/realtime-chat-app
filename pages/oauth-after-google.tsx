import { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthHeader } from "../component/ui/LandingPage/LandingHeader";
import { startStripeSession } from "../lib/stripe/startSession";

/**
 * After Google signup with Pro, start Stripe checkout (same as email signup flow).
 */
export default function OauthAfterGoogle() {
  const router = useRouter();
  const { plan } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    if (plan === "pro") {
      void startStripeSession();
      return;
    }
    router.replace("/chat");
  }, [router, plan]);

  return (
    <>
      <AuthHeader />
      <div className="min-h-screen flex items-center justify-center bg-white px-4 mt-16">
        <p className="text-gray-600 text-center">
          Redirecting to checkout…
        </p>
      </div>
    </>
  );
}
