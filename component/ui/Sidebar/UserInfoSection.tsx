import React, { useMemo } from "react";
import { User } from "lucide-react";

interface UserInfoSectionProps {
  username: string | null;
  subscriptionPlan: string | null;
  creditsRemaining: number;
  isCollapsed: boolean;
}

const UserInfoSectionComponent: React.FC<UserInfoSectionProps> = ({
  username,
  subscriptionPlan,
  creditsRemaining,
  isCollapsed,
}) => {
  // Memoize computed values
  const userInitial = useMemo(
    () => (username ? username.charAt(0).toUpperCase() : null),
    [username]
  );

  const planDisplayText = useMemo(() => {
    if (!subscriptionPlan) return "No plan";
    return `${subscriptionPlan.charAt(0).toUpperCase()}${subscriptionPlan.slice(1)} plan`;
  }, [subscriptionPlan]);

  const showCredits = useMemo(
    () =>
      subscriptionPlan &&
      (subscriptionPlan === "pro" || subscriptionPlan === "premium"),
    [subscriptionPlan]
  );

  return (
    <div
      className={`
        flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50
        ${isCollapsed ? "justify-center bg-transparent" : ""}
      `}
    >
      <div
        className={`
          rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0
          ${isCollapsed ? "w-6 h-6" : "w-10 h-10"}
          ${subscriptionPlan === "pro" ? "bg-black" : "bg-gray-400"}
        `}
        title={isCollapsed ? username || "User" : ""}
      >
        {userInitial ? userInitial : <User className="w-5 h-5" />}
      </div>
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {username || "User"}
          </p>
          <p
            className={`text-xs mt-0.5 truncate ${
              subscriptionPlan === "pro"
                ? "text-yellow-600 font-medium"
                : "text-gray-500"
            }`}
          >
            {planDisplayText}
          </p>
          {showCredits && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {creditsRemaining} credits
            </p>
          )}
        </div>
      )}
    </div>
  );
};

UserInfoSectionComponent.displayName = "UserInfoSection";

export const UserInfoSection = React.memo(UserInfoSectionComponent);
