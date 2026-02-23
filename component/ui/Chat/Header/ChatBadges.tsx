import React from "react";
import type { LucideIcon } from "lucide-react";

interface ChatBadgesProps {
  themeLabel: string;
  levelLabel?: string;
  levelValue?: string;
  politenessLabel: string;
  ThemeIcon: LucideIcon;
  PolitenessIcon: LucideIcon;
  showTheme: boolean;
  showLevel: boolean;
  showPoliteness: boolean;
}

export const ChatBadges = ({
  themeLabel,
  levelLabel,
  levelValue,
  politenessLabel,
  ThemeIcon,
  PolitenessIcon,
  showTheme,
  showLevel,
  showPoliteness,
}: ChatBadgesProps) => {
  const levelStyle =
    levelValue === "easy"
      ? "bg-green-50 text-green-700 border-green-100"
      : levelValue === "medium"
        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
        : "bg-red-50 text-red-700 border-red-100";

  return (
    <div className="flex gap-2 text-sm text-gray-600 flex-wrap">
      {showTheme && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
          <ThemeIcon className="w-3 h-3 flex-shrink-0" />
          <span className="font-medium text-xs max-w-20 truncate">
            {themeLabel}
          </span>
        </div>
      )}
      {showLevel && levelLabel && (
        <span
          className={`px-2.5 py-1 rounded-md font-medium text-xs border ${levelStyle}`}
        >
          {levelLabel}
        </span>
      )}
      {showPoliteness && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
          <PolitenessIcon className="w-3 h-3 flex-shrink-0" />
          <span className="font-medium text-xs hidden sm:inline">
            {politenessLabel}
          </span>
          <span className="font-medium text-xs sm:hidden">
            {politenessLabel.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
};
