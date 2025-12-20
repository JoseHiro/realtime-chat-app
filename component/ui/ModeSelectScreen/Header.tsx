import React from "react";

type HeaderProps = {
  username: string;
  subscriptionPlan: string;
};

export const Header = ({ username, subscriptionPlan }: HeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-md font-medium text-gray-900">
          Hello {username}!
        </div>

        <div className="text-right">
          <div className="flex text-sm font-medium text-gray-700 border border-gray-300 px-2 py-1 rounded-full items-center gap-2">
            <span className="text-gray-500">Subscription Plan:</span>{" "}
            <p className="border rounded-full px-2 py-1 bg-black text-white">
              {subscriptionPlan === "pro" ? "Pro" : "Trial"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Japanese Conversation Practice
        </h1>
        <p className="text-gray-600 text-xs">
          Choose your level, conversation theme, and speaking style to get
          started
        </p>
      </div>
    </>
  );
};
