import React, { useState } from "react";
import { VoiceStatus } from "./VoiceStatus";
import { InputArea } from "./InputArea";
import { SettingsToolbar } from "./SettingsToolbar";

interface ChatFooterProps {
  isConnected: boolean;
  isUserSpeaking: boolean;
  isAgentSpeaking: boolean;
  textOpen: boolean;
  setTextOpen: (open: boolean) => void;
  textInputMode: boolean;
  setTextInputMode: (mode: boolean) => void;
  hiraganaReading: boolean;
  setHiraganaReading: (enabled: boolean) => void;
  onSendMessage?: (message: string) => void;
}

export const ChatFooter = ({
  isConnected,
  isUserSpeaking,
  isAgentSpeaking,
  textOpen,
  setTextOpen,
  textInputMode,
  setTextInputMode,
  hiraganaReading,
  setHiraganaReading,
  onSendMessage,
}: ChatFooterProps) => {
  const [settingsOpen, setSettingOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div
      className={`p-4 lg:p-6 bg-white border-t border-gray-200 transition-all duration-300 ${
        settingsOpen ? "pb-8" : ""
      }`}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-4 justify-center">
          {textInputMode ? (
            <InputArea
              message={message}
              setMessage={setMessage}
              onSend={handleSend}
            />
          ) : (
            <VoiceStatus
              isConnected={isConnected}
              isUserSpeaking={isUserSpeaking}
              isAgentSpeaking={isAgentSpeaking}
            />
          )}
        </div>
      </div>

      <SettingsToolbar
        textOpen={textOpen}
        setTextOpen={setTextOpen}
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
