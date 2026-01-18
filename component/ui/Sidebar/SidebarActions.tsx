import React, { useMemo } from "react";
import { Settings, Volume2, VolumeX } from "lucide-react";

interface SidebarActionsProps {
  isCollapsed: boolean;
  isMuted: boolean;
  onSettingsClick: () => void;
  onMuteToggle: () => void;
}

const SidebarActionsComponent: React.FC<SidebarActionsProps> = ({
  isCollapsed,
  isMuted,
  onSettingsClick,
  onMuteToggle,
}) => {
  // Memoize icon component to prevent unnecessary re-renders
  const VolumeIcon = useMemo(
    () => (isMuted ? VolumeX : Volume2),
    [isMuted]
  );

  const muteButtonTitle = useMemo(
    () => (isCollapsed ? (isMuted ? "Muted" : "Sound") : ""),
    [isCollapsed, isMuted]
  );

  return (
    <div className={`flex gap-2 ${isCollapsed ? "flex-col" : ""}`}>
      <button
        onClick={onSettingsClick}
        className={`
          cursor-pointer flex items-center justify-center gap-2 rounded-lg text-gray-600 hover:text-gray-900 transition-colors
          ${
            isCollapsed
              ? "w-full hover:text-gray-600"
              : "flex-1 p-3 hover:bg-gray-50"
          }
        `}
        title={isCollapsed ? "Settings" : ""}
      >
        <Settings className="w-4 h-4" />
        {!isCollapsed && <span className="text-xs font-medium">Settings</span>}
      </button>
      <button
        onClick={onMuteToggle}
        className={`
          cursor-pointer flex items-center justify-center gap-2 rounded-lg transition-colors
          ${
            isCollapsed
              ? "w-full mt-1 hover:text-gray-600"
              : "flex-1 p-3 hover:bg-gray-50"
          }
          ${
            isMuted
              ? "text-red-600 bg-red-50 border border-red-200"
              : "text-gray-600 hover:text-gray-900"
          }
        `}
        title={muteButtonTitle}
      >
        <VolumeIcon className="w-4 h-4" />
        {!isCollapsed && (
          <span className="text-xs font-medium">{isMuted ? "Muted" : "Sound"}</span>
        )}
      </button>
    </div>
  );
};

SidebarActionsComponent.displayName = "SidebarActions";

export const SidebarActions = React.memo(SidebarActionsComponent);
