import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarAppName } from "../AppName";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onGoToSelectMode: () => void;
}

const SidebarHeaderComponent: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  onGoToSelectMode,
}) => {
  return (
    <div
      className={`
        flex items-start border-gray-200
        ${isCollapsed ? "justify-center p-2" : "justify-between p-4"}
      `}
    >
      {!isCollapsed && <SidebarAppName onClick={onGoToSelectMode} />}
      <div className="flex items-center gap-2">
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

SidebarHeaderComponent.displayName = "SidebarHeader";

export const SidebarHeader = React.memo(SidebarHeaderComponent);
