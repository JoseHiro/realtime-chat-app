import React, { useState } from "react";
import { toast } from "sonner";

import { SummaryContent } from "../../SummaryContent";
import { Summary } from "../../Summary";
import { Overlay } from "../../../overlay";
import { useChatSession } from "../../../../context/ChatSessionContext";
import { useSummary } from "../../../../context/SummaryContext";
import { apiRequest } from "../../../../lib/apiRequest";
import { useQueryClient } from "@tanstack/react-query";

import { CharacterAvatar } from "./CharacterAvatar";
import { ChatBadges } from "./ChatBadges";
import { TitleSection } from "./TitleSection";
import { HeaderActions } from "./HeaderActions";
import {
  getLevelLabel,
  getThemeInfo,
  getPolitenessInfo,
} from "./helpers/helpers";
import type { ChatHeaderProps } from "./types";

export type { ChatHeaderProps } from "./types";

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
  characterName,
  overlayOpened: overlayOpenedProp,
  setOverlayOpened: setOverlayOpenedProp,
}: ChatHeaderProps) => {
  const [localOverlayOpened, setLocalOverlayOpened] = useState(false);
  const overlayOpened = overlayOpenedProp ?? localOverlayOpened;
  const setOverlayOpened = setOverlayOpenedProp ?? setLocalOverlayOpened;
  const [summaryOpened, setSummaryOpened] = useState(false);
  const [isEditingChatTitle, setIsEditingChatTitle] = useState(false);
  const queryClient = useQueryClient();
  const { selectedLevel, selectedPoliteness, selectedTheme, selectedTime } =
    useChatSession();
  const { summaryFetchLoading, summary } = useSummary();

  const themeInfo = getThemeInfo(theme, selectedTheme, customTheme);
  const politenessInfo = getPolitenessInfo(politeness, selectedPoliteness);
  const levelLabel = getLevelLabel(level, selectedLevel);
  const levelValue = level ?? selectedLevel;

  const handleSaveNewChatTitle = async (value: string) => {
    const newTitle = value.trim();
    if (!newTitle.length) {
      toast.error("You need to set title");
      return;
    }
    try {
      await apiRequest("/api/chat/edit-title", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: Number(id), newTitle }),
      });
      toast.success("You have changed the chat title");
      setIsEditingChatTitle(false);
      queryClient.invalidateQueries({ queryKey: ["chat", id] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    } catch (error) {
      toast.error("We couldn't change the title");
      console.error(error);
    }
  };

  return (
    <div className="bg-white border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-10">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <CharacterAvatar characterName={characterName} />
          <div className="space-y-1">
            <TitleSection
              title={title}
              id={id}
              isEditing={isEditingChatTitle}
              onStartEdit={() => setIsEditingChatTitle(true)}
              onSave={handleSaveNewChatTitle}
            />
            <ChatBadges
              themeLabel={themeInfo.label}
              levelLabel={levelLabel}
              levelValue={levelValue}
              politenessLabel={politenessInfo.label}
              ThemeIcon={themeInfo.icon}
              PolitenessIcon={politenessInfo.icon}
              showTheme={Boolean(theme || customTheme || selectedTheme)}
              showLevel={Boolean(level || selectedLevel)}
              showPoliteness={Boolean(politeness || selectedPoliteness)}
            />
          </div>
        </div>

        <HeaderActions
          chatPage={chatPage}
          history={history}
          setOverlayOpened={setOverlayOpened}
          selectedTime={(selectedTime ?? 3) as number}
          summaryFetchLoading={summaryFetchLoading}
          analysis={analysis}
          summary={summary}
        />
      </div>

      {!chatPage && overlayOpened && (
        <Overlay onClose={() => setOverlayOpened(false)}>
          <Summary summary={analysis} characterName={characterName} />
        </Overlay>
      )}

      {chatPage && overlayOpened && setOverlayOpenedProp == null && (
        <Overlay
          onClose={() => {
            if (summaryFetchLoading) {
              toast.info("Summary generation in progress", {
                description: "We'll notify you when your summary is ready.",
                position: "top-center",
              });
            }
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
