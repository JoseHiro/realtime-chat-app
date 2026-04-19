import React, { useCallback } from "react";
import { MessageCircle, MessageSquare } from "lucide-react";

const tabs = [
  { id: "info", label: "Conversation Info", icon: MessageCircle },
  { id: "conversation", label: "Conversation Review", icon: MessageSquare },
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
      <nav className="flex items-center gap-0.5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          const base = `flex items-center gap-1.5 rounded-md transition-colors ${
            active
              ? "bg-gray-100 text-gray-900 font-medium"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleTabClick(id)}
              className={`${base} px-3 py-1.5 text-sm`}
            >
              <Icon size={14} />
              {label}
            </button>
          );
        })}
      </nav>
    );
  }
);

SummaryNavigation.displayName = "SummaryNavigation";

export default SummaryNavigation;
