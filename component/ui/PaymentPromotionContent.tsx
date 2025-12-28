import React from "react";
import { startStripeSession } from "../../lib/stripe/startSession";
import { Lock, Shield, X } from "lucide-react";

export const PaymentPromotionContent = ({
  onClose,
  isPro = false,
}: {
  onClose: () => void;
  isPro?: boolean;
}) => {
  const display = [
    {
      title: "Trial Limit Reached",
      messageFirst: "You've used all ",
      messageSecond: "2 free conversations",
    },
    {
      title: "Subscription Inactive",
      messageFirst: "Finish payment to unlock ",
      messageSecond: "all Pro features",
    },
  ];

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-gray-900 rounded-lg flex items-center justify-center">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          {isPro ? display[1].title : display[0].title}
        </h2>
        <p className="text-sm text-gray-600">
          {isPro ? display[1].messageFirst : display[0].messageFirst}
          <span className="font-medium text-gray-900">
            {isPro ? display[1].messageSecond : display[0].messageSecond}
          </span>
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3 text-sm">
          Upgrade to Premium
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Unlimited conversations</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>All themes & characters</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Grammar correction mode</span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white border-2 border-gray-900 rounded-lg p-5 mb-6">
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-semibold text-gray-900">$14.99</span>
          <span className="text-gray-500 ml-2 text-sm">/month</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => startStripeSession()}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 px-6 rounded-lg transition-colors"
        >
          Start Learning Now
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm"
        >
          Maybe later
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Secure Payment</span>
          </div>
          <span className="text-gray-300">•</span>
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
};
