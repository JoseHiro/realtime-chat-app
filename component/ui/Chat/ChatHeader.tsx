import React, { useState } from "react";
import { Pen, User } from "lucide-react";
import { StopWatch } from "./StopWatch";
import { SummaryButton } from "../../button";
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
    <div className="bg-white px-6 rounded-4xl py-4 m-3 shadow-sm">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
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
                  <Pen
                    onClick={() => setIsEditingChatTitle(true)}
                    className="w-3 h-3 text-gray-500 hover:text-gray-500 cursor-pointer"
                  />
                )}
              </div>
            )}

            <div className="flex gap-4 text-sm text-gray-600">
              {(theme || customTheme || selectedTheme) && (
                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  <ThemeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="font-medium text-xs max-w-12 sm:max-w-20 truncate">
                    {themeInfo.label}
                  </span>
                </div>
              )}
              {(level || selectedLevel) && (
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full font-medium text-xs ${
                    (level || selectedLevel) === "easy"
                      ? "bg-green-100 text-green-700"
                      : (level || selectedLevel) === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {getLevelLabel()}
                </span>
              )}
              {(politeness || selectedPoliteness) && (
                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  <PolitenessIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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

        <div className="flex space-x-4 items-center">
          {chatPage && (
            <StopWatch history={history} setOverlayOpened={setOverlayOpened} />
          )}
          {analysis || summary ? (
            <SummaryButton
              summary={analysis || summary}
              onClick={() => setOverlayOpened(true)}
            />
          ) : (
            <p className="border h-8 px-3 border-gray-200 rounded text-gray-400 text-xs flex items-center justify-center">
              No Summary
            </p>
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
