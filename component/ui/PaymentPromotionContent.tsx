import React from "react";

export const PaymentPromotionContent = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  return (
    <div className="text-center py-4">
      {/* Header Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-green-400 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        🎯 Trial Limit Reached!
      </h2>

      {/* Message */}
      <p className="text-gray-600 mb-2 text-lg">
       {"You've used all "}
        <span className="font-semibold text-green-600">
          2 free conversations
        </span>
      </p>
      <p className="text-gray-500 mb-6">
        Ready to unlock unlimited Japanese learning?
      </p>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          ✨ Upgrade to Premium
        </h3>
        {/* <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-green-700">
            <span className="mr-2">🚀</span>
            Unlimited conversations
          </div>
          <div className="flex items-center text-blue-700">
            <span className="mr-2">🎯</span>
            All difficulty levels
          </div>
          <div className="flex items-center text-purple-700">
            <span className="mr-2">📊</span>
            Progress tracking
          </div>
          <div className="flex items-center text-indigo-700">
            <span className="mr-2">🗣️</span>
            Voice practice
          </div>
        </div> */}
      </div>

      {/* Pricing */}
      <div className="bg-white border-2 border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl font-bold text-gray-900">14.99usd</span>
          <span className="text-gray-500 ml-2">/month</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          // onClick={onUpgrade}
          className="cursor-pointer w-full bg-green-400 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
        >
          🇯🇵 Start Learning Now!
        </button>

        <button
          onClick={onClose}
          className="cursor-pointer w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm"
        >
          Maybe later
        </button>
      </div>

      {/* Trust indicators */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secure Payment
          </div>
          <span>•</span>
          <div>No Hidden Fees</div>
          <span>•</span>
          <div>Cancel Anytime</div>
        </div>
      </div>
    </div>
  );
};
