import React from "react";
import { Flame } from "lucide-react";

interface StreakTrackerProps {
  currentStreak: number;
  last30Days: boolean[];
}

export const StreakTracker = ({
  currentStreak,
  last30Days,
}: StreakTrackerProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-900">
            {currentStreak} Day Streak
          </h2>
          <p className="text-sm text-gray-600">
            Keep practicing to maintain your streak
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Last 30 Days
        </h3>
        <div className="grid grid-cols-10 gap-2">
          {last30Days.map((hasChat, index) => (
            <div
              key={index}
              className={`aspect-square rounded ${
                hasChat ? "bg-black" : "bg-gray-100 border border-gray-200"
              }`}
              title={
                hasChat
                  ? `Activity on ${new Date(
                      Date.now() - (29 - index) * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}`
                  : "No activity"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
