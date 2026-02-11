import React from "react";
import { Eye, EyeOff, Type, Mic, BookOpen, MoreVertical } from "lucide-react";

interface SettingsToolbarProps {
  MessagesTextOpenMode: boolean;
  setMessagesTextOpenMode: (open: boolean) => void;
  textInputMode: boolean;
  setTextInputMode: (mode: boolean) => void;
  hiraganaReading: boolean;
  setHiraganaReading: (enabled: boolean) => void;
  settingsOpen: boolean;
  setSettingOpen: (open: boolean) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  activeColorClass?: string;
  inactiveColorClass?: string;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  activeColorClass = "bg-black text-white",
  inactiveColorClass = "bg-gray-200 text-gray-600 hover:bg-gray-300",
  title,
  children,
}: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
      isActive ? activeColorClass : inactiveColorClass
    }`}
    title={title}
  >
    {children}
  </button>
);

export const SettingsToolbar = ({
  textInputMode,
  setTextInputMode,
  hiraganaReading,
  setHiraganaReading,
  settingsOpen,
  setSettingOpen,
  MessagesTextOpenMode,
  setMessagesTextOpenMode,
}: SettingsToolbarProps) => {
  return (
    <div className="max-w-4xl mx-auto mt-4 flex items-center justify-end gap-2">
      {settingsOpen && (
        <div className="flex items-center gap-2">
          {/* Text Open Toggle */}
          <ToolbarButton
            onClick={() => setMessagesTextOpenMode(!MessagesTextOpenMode)}
            isActive={MessagesTextOpenMode}
            activeColorClass="text-gray-500"
            inactiveColorClass="text-gray-600 hover:bg-gray-300"
            title={MessagesTextOpenMode ? "Hide text" : "Show text"}
          >
            {MessagesTextOpenMode ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </ToolbarButton>

          {/* Text Input Mode Toggle */}
          <ToolbarButton
            onClick={() => setTextInputMode(!textInputMode)}
            isActive={textInputMode}
            activeColorClass="text-green-500"
            inactiveColorClass="bg-gray-100 text-gray-600 hover:bg-gray-300"
            title={textInputMode ? "Text input mode" : "Voice input mode"}
          >
            {textInputMode ? (
              <Type className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </ToolbarButton>

          {/* Hiragana Reading Toggle */}
          <ToolbarButton
            onClick={() => setHiraganaReading(!hiraganaReading)}
            isActive={hiraganaReading}
            activeColorClass="text-green-500"
            inactiveColorClass="bg-gray-100 text-gray-600 hover:bg-gray-300"
            title={
              hiraganaReading
                ? "Hide hiragana reading"
                : "Show hiragana reading"
            }
          >
            <BookOpen className="w-4 h-4" />
          </ToolbarButton>
        </div>
      )}

      {/* Settings Toggle Button */}
      <ToolbarButton
        onClick={() => setSettingOpen(!settingsOpen)}
        isActive={false}
        inactiveColorClass="bg-gray-100 text-gray-600 hover:bg-gray-300"
        title={settingsOpen ? "Hide settings" : "Show settings"}
      >
        <MoreVertical className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};
