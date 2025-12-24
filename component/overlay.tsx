import React, { useState } from "react";
import { startStripeSession } from "../lib/stripe/startSession";
import { CircleX, Sparkles, Crown, Loader2 } from "lucide-react";

type OverlayProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Overlay: React.FC<OverlayProps> = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  bg-opacity-20 backdrop-blur-sm bg-trans"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-xl border border-gray-200 max-w-[80%] w-full max-h-[80vh] p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute rounded text-gray-400 hover:text-black transition top-3 right-3 z-100"
        >
          <CircleX />
        </button>
        {children}
      </div>
    </div>
  );
};

export const BlockUseOverlay = ({ plan }: { plan: string }) => {
  const [loading, setLoading] = useState(false);
  const isProPlan = plan === "pro";

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await startStripeSession();
    } catch (error) {
      console.error("Error starting Stripe session:", error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md pt-20">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-100">
        {/* Gradient Header */}
        <div className="bg-green-400 px-8 py-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              {isProPlan ? (
                <Crown className="w-8 h-8 text-white" />
              ) : (
                <Sparkles className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isProPlan ? "Subscription Required" : "Trial Period Ended"}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 text-center">
          <p className="text-gray-700 text-base leading-relaxed mb-2">
            {isProPlan
              ? "Your subscription is not currently active. Please complete your subscription to continue using all features."
              : "Your free trial has ended. Subscribe to continue your Japanese learning journey!"}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Unlock unlimited conversations and advanced features
          </p>

          {/* Action Button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-gray-700 font-semibold border border-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
              loading ? "cursor-wait" : "cursor-pointer"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Crown className="w-5 h-5" />
                <span>Subscribe Now</span>
              </>
            )}
          </button>

          {/* Additional Info */}
          <p className="text-xs text-gray-400 mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};
