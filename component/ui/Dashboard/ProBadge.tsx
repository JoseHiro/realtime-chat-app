import React from "react";
import { Crown } from "lucide-react";

export const ProBadge = () => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-300 shadow-sm">
      <Crown className="w-4 h-4 text-gray-900" />
      <span className="text-sm font-medium text-gray-900">Pro</span>
    </div>
  );
};
