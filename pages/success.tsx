import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { RoundedButton } from "../component/shared/button";

const PaymentSuccess = () => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  type PaymentStatus = {
    subscriptionStatus: "active" | "trialing" | "canceled" | "pending";
    subscriptionPlan: string;
  };

  const {
    data: payment,
    isLoading,
    error,
  } = useQuery<PaymentStatus>({
    queryKey: ["payment"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/status");
      if (!res.ok) throw new Error("Failed to fetch payment status");
      return res.json();
    },
    refetchInterval: (query) => {
      // 型安全にアクセス
      if (query.state.status === "success" && query.state.data) {
        const data = query.state.data as PaymentStatus;
        return data.subscriptionStatus === "active" ? false : 3000;
      }
      return 3000;
    },
    // retry: 6,
    // onSuccess: (data) => {
    //   console.log("Payment data:", data);
    //   if (data?.subscriptionStatus === "active") {
    //     // 2秒後にリダイレクト
    //     setTimeout(() => {
    //       setIsRedirecting(true);
    //       router.push("/new");
    //     }, 2000);
    //   }
    // },
  });

  console.log(payment);

  // 手動でチャットに移動
  const handleStartNow = () => {
    if (payment?.subscriptionStatus === "active") {
      setIsRedirecting(true);
      router.push("/new");
    }
  };

  // ローディング状態
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

          {/* Dynamic Icon Based on State */}
          <div className="relative mb-6">
            {isLoading ? (
              // Loading state
              <div className="w-24 h-24 mx-auto border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            ) : error ? (
              // Error state
              <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            ) : payment?.subscriptionStatus !== "active" ? (
              // Processing state
              <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-yellow-300 rounded-full animate-pulse"></div>
                <svg
                  className="w-12 h-12 text-yellow-600 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            ) : (
              // Success state
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg
                  className="w-12 h-12 text-white animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            {/* Floating particles effect - only show on success */}
            {!isLoading &&
              !error &&
              payment?.subscriptionStatus === "active" && (
                <>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-ping animation-delay-300"></div>
                </>
              )}
          </div>

          {/* Dynamic Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLoading
              ? "Verifying Payment..."
              : error
                ? "Verification Failed"
                : payment?.subscriptionStatus !== "active"
                  ? "Setting Up Account..."
                  : "🎉 Welcome to Kaiwa Kun!"}
          </h1>

          {/* Dynamic Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {isLoading
              ? "Please wait while we confirm your subscription and prepare your account."
              : error
                ? "We encountered an issue verifying your payment. Please try again."
                : payment?.subscriptionStatus !== "active"
                  ? "Payment received! We're now activating your subscription and preparing your Japanese learning experience."
                  : "Your subscription is now active! You have unlimited access to AI-powered Japanese conversations. Let's start your learning journey! 🚀"}
          </p>

          {/* Dynamic Content Based on State */}
          {isLoading && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-blue-700">
                This usually takes just a moment
              </p>
            </div>
          )}

          {error && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 mb-4"
            >
              Try Again
            </button>
          )}

          {!isLoading && !error && payment?.subscriptionStatus !== "active" && (
            <div className="bg-yellow-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">
                {`What's happening:`}
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>✅ Payment confirmed</li>
                <li>🔄 Activating subscription...</li>
                <li>⏳ Setting up your profile</li>
                <li>🚀 Almost ready!</li>
              </ul>
            </div>
          )}

          {/* Action Button - Always show but change behavior */}
          <RoundedButton
            onClick={error ? () => window.location.reload() : handleStartNow}
            disabled={
              isRedirecting ||
              (payment?.subscriptionStatus !== "active" && !error)
            }
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:scale-100 mb-4"
          >
            {isRedirecting ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Redirecting...
              </span>
            ) : error ? (
              "Try Again"
            ) : payment?.subscriptionStatus !== "active" ? (
              "Please wait..."
            ) : (
              "Start Learning Japanese Now! 🇯🇵"
            )}
          </RoundedButton>

          {/* Dynamic Footer Message */}
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-6">
          {/* <p className="text-sm text-gray-500">
            {!isRedirecting && !error && (
              <p className="text-sm text-gray-500">
                {payment?.subscriptionStatus === "active"
                  ? "You'll be automatically redirected in a moment, or click the button above to start now."
                  : "Please don't refresh the page while we set up your account."}
              </p>
            )}
          </p> */}
        </div>
      </div>

      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
