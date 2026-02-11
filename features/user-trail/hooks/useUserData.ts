/**
 * Fetches user data, syncs to UserContext, and derives needPayment / plan.
 * Used by: pages/new.tsx (and can be reused by dashboard, settings).
 */

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../context/UserContext";

export interface UseUserDataOptions {
  /** When true, open payment overlay when user needs to pay (trial ended or pro inactive). */
  setPaymentOverlay?: (open: boolean) => void;
}

export function useUserData(options: UseUserDataOptions = {}) {
  const { setPaymentOverlay } = options;
  const { setUsername, setSubscriptionPlan, setCreditsRemaining } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch trial data");
      }
      return response.json();
    },
    retry: false,
  });

  const needPayment = useMemo(
    () =>
      Boolean(
        data?.trialStatus === "ended" ||
          (data?.user?.subscriptionPlan === "pro" &&
            data?.user?.subscriptionStatus !== "active"),
      ),
    [data],
  );

  const plan = useMemo<"pro" | "trial">(
    () => (data?.user?.subscriptionPlan === "pro" ? "pro" : "trial"),
    [data],
  );

  // Single side effect: sync to context when data loads; optionally open payment overlay.
  useEffect(() => {
    if (!data?.user) return;
    setUsername(data.user.username);
    setSubscriptionPlan(data.user.subscriptionPlan);
    setCreditsRemaining(data.user.creditsRemaining ?? 0);
    if (needPayment && setPaymentOverlay) {
      setPaymentOverlay(true);
    }
  }, [
    data,
    needPayment,
    setPaymentOverlay,
    setUsername,
    setSubscriptionPlan,
    setCreditsRemaining,
  ]);

  return { data, needPayment, plan, isLoading };
}
