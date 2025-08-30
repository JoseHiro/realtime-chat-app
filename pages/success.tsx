import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const PaymentSuccess = ({ username }: { username: string }) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Auto redirect to chat after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/chat");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto">
        {/* Success Animation Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

          {/* Animated Success Icon */}
          <div className="relative mb-6">
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
            {/* Floating particles effect */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-ping animation-delay-300"></div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Payment Successful!
          </h1>

          {/* Personalized Welcome */}
          {username ? (
            <h2 className="text-xl text-green-600 font-semibold mb-4">
              Welcome to Kaiwa AI, {username}!
            </h2>
          ) : (
            <h2 className="text-xl text-green-600 font-semibold mb-4">
              Welcome to Kaiwa AI!
            </h2>
          )}

          <p className="text-gray-600 mb-6 leading-relaxed">
            {`Thank you for subscribing! You now have unlimited access to
                AI-powered Japanese conversations. Let's start your learning
                journey! 🚀`}
          </p>

          {/* Session ID (if needed) */}
          {/* {session_id && (
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
              <p className="text-sm font-mono text-gray-700">{session_id}</p>
            </div>
          )} */}

          {/* What's Next Section */}
          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">{`What's next?`}</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✨ Start unlimited conversations</li>
              <li>📊 Track your progress</li>
              <li>🎯 Choose your difficulty level</li>
              <li>🗣️ Practice with voice mode</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/chat"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg inline-block"
            >
              Start Learning Japanese Now! 🇯🇵
            </Link>

            {/* <div className="flex space-x-3">
              <Link
                href="/"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
              >
                Home
              </Link>
              <Link
                href="/profile"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 inline-block"
              >
                Profile
              </Link>
            </div> */}
          </div>

          {/* Auto-redirect notice */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Automatically redirecting to chat in {countdown} seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div
                className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? Contact our{" "}
            <Link
              href="/support"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              support team
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 300ms;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
