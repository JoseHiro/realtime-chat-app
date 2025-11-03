import React, { useState } from "react";
import { MessageCircle, Target, AlertCircle, TrendingUp } from "lucide-react";

const tabs = [
  { id: "info", label: "Conversation Info", icon: MessageCircle },
  { id: "analysis", label: "Analysis", icon: Target },
  { id: "feedback", label: "Feedback & Corrections", icon: AlertCircle },
  { id: "milestone", label: "Growth Path", icon: TrendingUp },
];

export const SummaryNavigation = ({
  setActiveTab,
  activeTab,
}: {
  setActiveTab: (tabId: string) => void;
  activeTab: string;
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg border border-gray-200 p-2 sticky top-6">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SummaryNavigation;
