import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import type { CharacterName } from "../lib/voice/voiceMapping";
export type { CharacterName };

export interface ChatSessionContextType {
  selectedLevel: string;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedPoliteness: string;
  setSelectedPoliteness: React.Dispatch<React.SetStateAction<string>>;
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
  customTheme: string;
  setCustomTheme: React.Dispatch<React.SetStateAction<string>>;
  checkGrammarMode: boolean;
  setCheckGrammarMode: React.Dispatch<React.SetStateAction<boolean>>;
  chatId: number | null;
  setChatId: React.Dispatch<React.SetStateAction<number | null>>;
  chatMode: boolean;
  setChatMode: React.Dispatch<React.SetStateAction<boolean>>;
  chatEnded: boolean;
  setChatEnded: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTime: number;
  setSelectedTime: React.Dispatch<React.SetStateAction<number>>;
  selectedCharacter: CharacterName;
  setSelectedCharacter: React.Dispatch<React.SetStateAction<CharacterName>>;
  stopConversation: () => void;
  registerStopConversation: (fn: () => void) => void;
}

const defaultState: ChatSessionContextType = {
  selectedLevel: "",
  setSelectedLevel: () => {},
  selectedPoliteness: "",
  setSelectedPoliteness: () => {},
  selectedTheme: "",
  setSelectedTheme: () => {},
  customTheme: "",
  setCustomTheme: () => {},
  checkGrammarMode: false,
  setCheckGrammarMode: () => {},
  chatId: null,
  setChatId: () => {},
  chatMode: false,
  setChatMode: () => {},
  chatEnded: false,
  setChatEnded: () => {},
  selectedTime: 3,
  setSelectedTime: () => {},
  selectedCharacter: "Sakura",
  setSelectedCharacter: () => {},
  stopConversation: () => {},
  registerStopConversation: () => {},
};

const ChatSessionContext = createContext<ChatSessionContextType>(defaultState);

export const ChatSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedPoliteness, setSelectedPoliteness] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [customTheme, setCustomTheme] = useState("");
  const [checkGrammarMode, setCheckGrammarMode] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const [chatMode, setChatMode] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [selectedTime, setSelectedTime] = useState(3);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterName>("Sakura");

  const stopConversationRef = useRef<() => void>(() => {});
  const registerStopConversation = useCallback((fn: () => void) => {
    stopConversationRef.current = fn;
  }, []);
  const stopConversation = useCallback(() => {
    stopConversationRef.current();
  }, []);

  const value: ChatSessionContextType = {
    selectedLevel,
    setSelectedLevel,
    selectedPoliteness,
    setSelectedPoliteness,
    selectedTheme,
    setSelectedTheme,
    customTheme,
    setCustomTheme,
    checkGrammarMode,
    setCheckGrammarMode,
    chatId,
    setChatId,
    chatMode,
    setChatMode,
    chatEnded,
    setChatEnded,
    selectedTime,
    setSelectedTime,
    selectedCharacter,
    setSelectedCharacter,
    stopConversation,
    registerStopConversation,
  };

  return (
    <ChatSessionContext.Provider value={value}>{children}</ChatSessionContext.Provider>
  );
};

export const useChatSession = (): ChatSessionContextType =>
  useContext(ChatSessionContext);
