import React from "react";
import { ProBadge } from "./ProBadge";
import { User } from "lucide-react";
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
    <div className="border border-gray-200 bg-black h-[200px] p-2 rounded-lg shadow-md flex">
      <div className="flex flex-col justify-between text-left p-8 gap-6 h-full w-full ">
        <p className="text-white text-xs">Since September 9, 2025</p>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl text-white">Welcome back, {username}!</h1>
          <p className="text-white text-xs">
            You&apos;ve had {stats.totalChats} conversations this week. Keep up
            the good work!
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start pr-4 gap-2">
        <ProBadge />
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-black" />
        </div>
      </div>
    </div>
  );
};
