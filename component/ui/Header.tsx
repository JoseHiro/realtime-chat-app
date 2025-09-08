import React, { useState, useEffect } from "react";
import {
  // Bot,
  // Clock,
  User,
  UserCheck,
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  Settings,
} from "lucide-react";
import { useSpeech } from "../../context/SpeechContext";
import { SummaryData } from "../../type/types";
import { ChatHeader } from "./Chat/ChatHeader";

export const Header = ({
  summary,
  setOverlayOpened,
  handleCreateSummary,
}: {
  summary: SummaryData | null;
  setOverlayOpened: (open: boolean) => void;
  handleCreateSummary: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(1 * 30);
  const [isActive, setIsActive] = useState(true);
  const { selectedPoliteness, selectedLevel, selectedTheme, customTheme } =
    useSpeech();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            // 時間切れ時の処理（自動で会話終了）
            setOverlayOpened(true);
            handleCreateSummary();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleCreateSummary]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60) return "text-red-500";
    if (timeLeft <= 120) return "text-orange-500";
    return "text-green-600";
  };

  const getTimerBgColor = () => {
    if (timeLeft <= 60) return "bg-red-50 border-red-200";
    if (timeLeft <= 120) return "bg-orange-50 border-orange-200";
    return "bg-green-50 border-green-200";
  };

  // テーマのアイコンとラベルを取得
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

    if (selectedTheme in themeMap) {
      return themeMap[selectedTheme as ThemeKey];
    }
    return { label: selectedTheme, icon: Settings };
  };

  // レベルの表示名を取得
  const getLevelLabel = () => {
    const levelMap = {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    };
    if (selectedLevel in levelMap) {
      return levelMap[selectedLevel as keyof typeof levelMap];
    }
    return selectedLevel;
  };

  // 丁寧語の表示名とアイコンを取得
  const getPolitenessInfo = () => {
    if (selectedPoliteness === "casual") {
      return { label: "Casual", icon: User };
    }
    return { label: "Formal", icon: UserCheck };
  };

  const themeInfo = getThemeInfo();
  const politenessInfo = getPolitenessInfo();
  const ThemeIcon = themeInfo.icon;
  const PolitenessIcon = politenessInfo.icon;

  return (
    <>
      <ChatHeader
        title="Kaiwa Kun"
        level="easy"
        theme="Daily Life"
        politeness="Casual"
      />
      {/* <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex justify-between gap-4 w-full">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white z-10"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Kaiwa Kun
                    </h2>
                    {(selectedLevel ||
                      selectedTheme ||
                      customTheme ||
                      selectedPoliteness) && (
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs">
                        {selectedLevel && (
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 rounded-full font-medium text-xs ${
                              selectedLevel === "easy"
                                ? "bg-green-100 text-green-700"
                                : selectedLevel === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {getLevelLabel()}
                          </span>
                        )}

                        {selectedPoliteness && (
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

                        {(selectedTheme || customTheme) && (
                          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            <ThemeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="font-medium text-xs max-w-12 sm:max-w-20 truncate">
                              {themeInfo.label}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getTimerBgColor()}`}
                >
                  <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                  <span
                    className={`font-mono text-sm font-semibold ${getTimerColor()}`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </div>

                <button
                  className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                    !summary
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 cursor-pointer"
                  }`}
                  disabled={!summary}
                  onClick={() => {
                    if (summary) {
                      setOverlayOpened(true);
                    }
                  }}
                >
                  {summary ? "Summary" : "No Summary"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {timeLeft <= 30 && timeLeft > 0 && (
          <div className="p-2 bg-red-100 border-t border-red-200">
            <p className="text-sm text-red-700 text-center font-medium">
              ⚠️ あと{timeLeft}秒で会話が終了します
            </p>
          </div>
        )}
      </div> */}
    </>
  );
};
