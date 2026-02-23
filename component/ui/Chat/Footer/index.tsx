import React, { useState } from "react";
import { VoiceStatus } from "./VoiceStatus";
import { InputArea } from "./InputArea";
import { SettingsToolbar } from "./SettingsToolbar";

interface ChatFooterProps {
  MessagesTextOpenMode: boolean;
  setMessagesTextOpenMode: (open: boolean) => void;
  textInputMode: boolean;
  setTextInputMode: (mode: boolean) => void;
  hiraganaReading: boolean;
  setHiraganaReading: (enabled: boolean) => void;
  sendTextMessage?: (message: string) => void;
}

export const ChatFooter = ({
  setMessagesTextOpenMode,
  MessagesTextOpenMode,
  textInputMode,
  setTextInputMode,
  hiraganaReading,
  setHiraganaReading,
  sendTextMessage,
}: ChatFooterProps) => {
  const [settingsOpen, setSettingOpen] = useState(false);

  return (
    <div
      className={`p-4 lg:p-6 bg-white border-t border-gray-200 transition-all duration-300 ${
        settingsOpen ? "pb-8" : ""
      }`}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-4 justify-center">
          {textInputMode ? (
            <InputArea sendTextMessage={sendTextMessage} />
          ) : (
            <VoiceStatus />
          )}
        </div>
      </div>

      <SettingsToolbar
        MessagesTextOpenMode={MessagesTextOpenMode}
        setMessagesTextOpenMode={setMessagesTextOpenMode}
        textInputMode={textInputMode}
        setTextInputMode={setTextInputMode}
        hiraganaReading={hiraganaReading}
        setHiraganaReading={setHiraganaReading}
        settingsOpen={settingsOpen}
        setSettingOpen={setSettingOpen}
      />
    </div>
  );
};
