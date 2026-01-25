import React from "react";
import { ProBadge } from "./ProBadge";

export const Header = ({
  username,
  stats,
}: {
  username: string;
  stats: {
    totalChats: number;
    totalPracticeTime: number;
    chatsThisWeek: number;
  };
}) => {
  return (
    <div className=" border border-gray-200 bg-black p-2 rounded-lg shadow-md flex">
      <div className="flex flex-col text-left p-4 gap-6 w-full">
        <p className="text-white text-xs">Since September 9, 2025</p>
        <div>
          <h1 className="text-2xl text-white">Welcome back, {username}!</h1>
          <p className="text-white text-xs">
            You&apos;ve had {stats.totalChats} conversations this week. Keep up
            the good work!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end pr-4">
        <ProBadge />
      </div>
    </div>
  );
};
