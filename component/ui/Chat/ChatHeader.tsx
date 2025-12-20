import React, { useState } from "react";
import { Pen, User, FileText, FileX } from "lucide-react";
import { StopWatch } from "./StopWatch";
import { SummaryContent } from "../SummaryContent";
import { useSpeech } from "../../../context/SpeechContext";
import {
  UserCheck,
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  Settings,
} from "lucide-react";
import { Overlay } from "../../overlay";
import { Summary } from "../Summary";
import { apiRequest } from "../../../lib/apiRequest";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const ChatHeader = ({
  title,
  theme,
  level,
  politeness,
  customTheme,
  chatPage,
  history,
  analysis,
  id,
}: {
  title: string;
  theme?: string;
  level?: string;
  politeness?: string;
  customTheme?: string;
  chatPage?: boolean;
  history?: any;
  analysis?: any;
  id?: string;
}) => {
  const [overlayOpened, setOverlayOpened] = useState(false);
  const [summaryOpened, setSummaryOpened] = useState<boolean>(false);
  const [isEditingChatTitle, setIsEditingChatTitle] = useState(false);
  const queryClient = useQueryClient();
  const {
    summaryFetchLoading,
    summary,
    selectedLevel,
    selectedPoliteness,
    selectedTheme,
  } = useSpeech();

  const getLevelLabel = () => {
    const levelMap = {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    };
    if (level) {
      if (level in levelMap) {
        return levelMap[level as keyof typeof levelMap];
      }
    } else {
      if (selectedLevel in levelMap) {
        return levelMap[selectedLevel as keyof typeof levelMap];
      }
    }

    return level;
  };

  const getPolitenessInfo = () => {
    if ((politeness ?? selectedPoliteness) === "casual") {
      return { label: "Casual", icon: User };
    }
    return { label: "Formal", icon: UserCheck };
  };

  const getThemeInfo = () => {
    if (customTheme) {
      return { label: customTheme, icon: Settings };
    }

    const themeMap = {
      daily: { label: "Daily Life", icon: Coffee },
      business: { label: "Business", icon: Briefcase },
      travel: { label: "Travel", icon: Plane },
      culture: { label: "Culture", icon: BookOpen },
      social: { label: "Social", icon: Users },
    };

    type ThemeKey = keyof typeof themeMap;

    if (theme) {
      if (theme in themeMap) {
        return themeMap[theme as ThemeKey];
      }
    } else {
      if (selectedTheme in themeMap) {
        return themeMap[selectedTheme as ThemeKey];
      }
    }
    return { label: theme, icon: Settings };
  };

  const themeInfo = getThemeInfo();
  const politenessInfo = getPolitenessInfo();
  const ThemeIcon = themeInfo.icon;
  const PolitenessIcon = politenessInfo.icon;

  // edit chat title
  const handleSaveNewChatTitle = async (value: string) => {
    const newTitle = value.trim();
    if (newTitle.length === 0) {
      toast.error("You need to set title");
      return;
    }

    try {
      await apiRequest("/api/chat/edit-title", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: Number(id),
          newTitle: newTitle,
        }),
      });

      toast.success("You have changed the chat title");
      setIsEditingChatTitle(false);
      queryClient.invalidateQueries({ queryKey: ["chat", id] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    } catch (error) {
      toast.error("We couldn't change the title");
      console.log(error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-10">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">AI</span>
          </div>
          <div className="space-y-1">
            {isEditingChatTitle ? (
              <div className="flex items-center space-x-2">
                <input
                  className="border rounded-md px-2 py-1 text-sm w-48 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  defaultValue={title}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleSaveNewChatTitle(
                        (e.target as HTMLInputElement).value
                      );
                  }}
                />
                <button
                  onClick={() =>
                    handleSaveNewChatTitle(
                      (document.querySelector("input") as HTMLInputElement)
                        ?.value || ""
                    )
                  }
                  className="cursor-pointer px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                {id && (
                  <button
                    onClick={() => setIsEditingChatTitle(true)}
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Edit title"
                  >
                    <Pen className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-2 text-sm text-gray-600 flex-wrap">
              {(theme || customTheme || selectedTheme) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                  <ThemeIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="font-medium text-xs max-w-20 truncate">
                    {themeInfo.label}
                  </span>
                </div>
              )}
              {(level || selectedLevel) && (
                <span
                  className={`px-2.5 py-1 rounded-md font-medium text-xs border ${
                    (level || selectedLevel) === "easy"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : (level || selectedLevel) === "medium"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {getLevelLabel()}
                </span>
              )}
              {(politeness || selectedPoliteness) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                  <PolitenessIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="font-medium text-xs hidden sm:inline">
                    {politenessInfo.label}
                  </span>
                  <span className="font-medium text-xs sm:hidden">
                    {politenessInfo.label.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 items-center">
          {chatPage && (
            <StopWatch history={history} setOverlayOpened={setOverlayOpened} />
          )}
          {analysis || summary ? (
            <button
              onClick={() => setOverlayOpened(true)}
              className="p-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              title="View Summary"
            >
              <FileText className="w-5 h-5" />
            </button>
          ) : (
            <div
              className="p-2.5 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
              title="No Summary Available"
            >
              <FileX className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {!chatPage && overlayOpened && (
        <Overlay onClose={() => setOverlayOpened(false)}>
          <Summary summary={analysis} />
        </Overlay>
      )}

      {chatPage && overlayOpened && (
        <Overlay
          onClose={() => {
            setOverlayOpened(false);
            setSummaryOpened(false);
          }}
        >
          <SummaryContent
            summaryOpened={summaryOpened}
            setSummaryOpened={setSummaryOpened}
            summary={summary}
            summaryFetchLoading={summaryFetchLoading}
          />
        </Overlay>
      )}
    </div>
  );
};
