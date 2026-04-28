import React from "react";

type HeaderProps = {
  username: string;
  subscriptionPlan: string;
  creditsRemaining: number;
};

export const Header = ({
  subscriptionPlan,
  creditsRemaining,
}: HeaderProps) => {
  const showCredits =
    subscriptionPlan === "pro" || subscriptionPlan === "premium";

  return (
    <>
      <div className="flex justify-between items-center">
        {/* <div className="text-sm text-gray-900">Hello {username}!</div> */}
        <div className="mt-6 mb-5">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Japanese Conversation Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Choose your level, conversation theme, and speaking style to get
            started
          </p>
        </div>
        <div className="flex items-center gap-3">
          {showCredits && (
            <div className="flex text-sm font-medium text-gray-700 dark:text-gray-300 border border-green-300 dark:border-green-700 px-3 py-1.5 rounded-full items-center gap-2 bg-green-50 dark:bg-green-950">
              <span className="text-gray-600 dark:text-gray-400">Credits:</span>
              <span className="font-semibold text-green-700 dark:text-green-400">
                {creditsRemaining}
              </span>
            </div>
          )}
          <div className="flex text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 px-2 py-1 rounded-full items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Subscription Plan:</span>{" "}
            <p className="border rounded-full px-2 py-1 bg-black dark:bg-gray-200 text-white dark:text-gray-900">
              {subscriptionPlan === "pro"
                ? "Pro"
                : subscriptionPlan === "premium"
                  ? "Premium"
                  : "Trial"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
