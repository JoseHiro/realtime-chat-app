import React, { useCallback } from "react";
import {
  MessageCircle,
  BarChart3,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

const tabs = [
  { id: "info", label: "Conversation Info", icon: MessageCircle },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "conversation", label: "Refined Responses", icon: MessageSquare },
  { id: "milestone", label: "Growth Path", icon: TrendingUp },
];

export const SummaryNavigation = React.memo(
  ({
    setActiveTab,
    activeTab,
  }: {
    setActiveTab: (tabId: string) => void;
    activeTab: string;
  }) => {
    const handleTabClick = useCallback(
      (tabId: string) => {
        setActiveTab(tabId);
      },
      [setActiveTab]
    );

    return (
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-2 sticky top-6">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleTabClick(tab.id);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
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
  }
);

SummaryNavigation.displayName = "SummaryNavigation";

export default SummaryNavigation;
