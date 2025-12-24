import React, { useState, useEffect } from "react";
import {
  Crown,
  Edit2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";
import { Sidebar } from "../../component/ui/Sidebar";
import { RoundedButton } from "../../component/button";
import { apiRequest } from "../../lib/apiRequest";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY_LIVE!);

interface UserData {
  user: {
    username: string | null;
    email: string;
    subscriptionStatus: string | null;
    subscriptionPlan: string | null;
    createdAt: string;
    totalChats: number;
  };
  trialStatus: string | null;
}

const BillingSettings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = (await apiRequest("/api/user", {
        method: "GET",
      })) as UserData;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = (await apiRequest("/api/subscription/subscribe", {
        method: "POST",
      })) as { sessionId: string };

      const stripe = await stripePromise;
      if (!stripe) {
        toast.error("Stripe failed to initialize");
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });

      if (error) {
        toast.error(error.message || "Failed to redirect to checkout");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to start subscription");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = (await apiRequest("/api/subscription/portal", {
        method: "POST",
      })) as { url: string };
      window.location.href = response.url;
    } catch (error: any) {
      toast.error(error.message || "Failed to open billing portal");
    }
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      await apiRequest("/api/subscription/cancel", {
        method: "POST",
      });
      toast.success(
        "Subscription will be canceled at the end of the billing period"
      );
      setShowUnsubscribeModal(false);
      fetchUserData(); // Refresh user data
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel subscription");
    } finally {
      setCanceling(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "trialing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "canceled":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "ended":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const isProUser =
    userData?.user.subscriptionStatus === "active" ||
    userData?.user.subscriptionPlan === "pro";

  if (loading) {
    return (
      <div className="relative w-full h-screen flex">
        <Sidebar />
        <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="relative w-full h-screen flex">
        <Sidebar />
        <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full flex items-center justify-center">
          <p className="text-gray-600">Failed to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />
      <div className="min-h-screen bg-gradient-to-br pt-5 from-gray-50 to-green-50 overflow-auto w-full">
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.push("/settings")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Subscription & Billing
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your subscription plan and billing information
                </p>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Current Plan
                      </h3>
                      <p className="text-sm text-gray-600">
                        {userData.user.subscriptionPlan
                          ? `${userData.user.subscriptionPlan.charAt(0).toUpperCase()}${userData.user.subscriptionPlan.slice(1)} Plan`
                          : "Free Plan"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full border capitalize font-medium ${getStatusColor(
                      userData.user.subscriptionStatus
                    )}`}
                  >
                    {userData.user.subscriptionStatus || "Inactive"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Conversations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userData.user.totalChats}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(userData.user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pro Features List */}
              {isProUser && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Your Pro Benefits
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Unlimited conversations
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Advanced grammar correction
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      All Pro features unlocked
                    </li>
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isProUser ? (
                  <RoundedButton
                    onClick={handleSubscribe}
                    className="flex-1 px-6 py-3 bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2 font-semibold"
                  >
                    <Crown className="w-5 h-5" />
                    Upgrade to Pro
                  </RoundedButton>
                ) : (
                  <>
                    <RoundedButton
                      onClick={handleManageSubscription}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-5 h-5" />
                      Manage Subscription
                    </RoundedButton>
                    <RoundedButton
                      onClick={() => setShowUnsubscribeModal(true)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      Cancel Subscription
                    </RoundedButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unsubscribe Modal */}
      {showUnsubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Cancel Subscription?
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                We&apos;re sorry to see you go! Your subscription will remain
                active until the end of your current billing period.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  You&apos;ll lose access to:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Unlimited conversations
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    Advanced grammar correction
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    All Pro features
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>
                    You&apos;ve had {userData.user.totalChats} conversations
                  </strong>{" "}
                  - that&apos;s great progress! Consider pausing instead of
                  canceling to keep your learning momentum.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <RoundedButton
                onClick={() => setShowUnsubscribeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={canceling}
              >
                Keep Subscription
              </RoundedButton>
              <RoundedButton
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {canceling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </RoundedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingSettings;
