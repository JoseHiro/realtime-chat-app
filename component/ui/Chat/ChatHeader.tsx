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

export const ChatHeader = ({
  title,
  theme,
  level,
  politeness,
  customTheme,
  chatPage,
  history,
  analysis,
}: {
  title: string;
  theme: string;
  level: string;
  politeness: string;
  customTheme?: string;
  chatPage?: boolean;
  history: any;
  analysis: any;
}) => {
  const [overlayOpened, setOverlayOpened] = useState(false);
  const [summaryOpened, setSummaryOpened] = useState<boolean>(false);
  const { summaryFetchLoading, summary } = useSpeech();
  console.log(summary, analysis);

  const getLevelLabel = () => {
    const levelMap = {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    };
    if (level in levelMap) {
      return levelMap[level as keyof typeof levelMap];
    }
    return level;
  };

  const getPolitenessInfo = () => {
    if (politeness === "casual") {
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

    if (theme in themeMap) {
      return themeMap[theme as ThemeKey];
    }
    return { label: theme, icon: Settings };
  };

  const themeInfo = getThemeInfo();
  const politenessInfo = getPolitenessInfo();
  const ThemeIcon = themeInfo.icon;
  const PolitenessIcon = politenessInfo.icon;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <div className="space-y-1">
            <div className="flex space-x-2">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <Pen className="w-4 h-4 text-gray-400 hover:text-gray-500 cursor-pointer" />
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              {(theme || customTheme) && (
                <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  <ThemeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="font-medium text-xs max-w-12 sm:max-w-20 truncate">
                    {themeInfo.label}
                  </span>
                </div>
              )}
              {level && (
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full font-medium text-xs ${
                    level === "easy"
                      ? "bg-green-100 text-green-700"
                      : level === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {getLevelLabel()}
                </span>
              )}
              {politeness && (
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

        <div className="flex space-x-4">
          {chatPage && (
            <StopWatch history={history} setOverlayOpened={setOverlayOpened} />
          )}
          {analysis ? (
            <SummaryButton
              summary={analysis}
              onClick={() => setOverlayOpened(true)}
            />
          ) : (
            <p className="border py-1 px-2 border-gray-200 rounded text-gray-400 text-xs">
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
