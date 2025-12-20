// SpeechContext.tsx
import React, { createContext, useContext, useState } from "react";

interface SpeechContextType {
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
  chatId: null | number;
  setChatId: React.Dispatch<React.SetStateAction<number | null>>;
  chatMode: boolean;
  setChatMode: React.Dispatch<React.SetStateAction<boolean>>;
  chatEnded: boolean;
  setChatEnded: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  subscriptionPlan: string;
  setSubscriptionPlan: React.Dispatch<React.SetStateAction<string>>;
  summary: any;
  setSummary: React.Dispatch<React.SetStateAction<any>>;
  summaryFetchLoading: boolean;
  setSummaryFetchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpeechContext = createContext<SpeechContextType>({
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
  username: "",
  setUsername: () => {},
  subscriptionPlan: "",
  setSubscriptionPlan: () => {},
  summary: null,
  setSummary: () => {},
  summaryFetchLoading: false,
  setSummaryFetchLoading: () => {},
  isMuted: false,
  setIsMuted: () => {},
});

//
//
//
//
//
//

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(""); // selected level for the chat
  const [selectedPoliteness, setSelectedPoliteness] = useState<string>(""); // selected politeness level for the chat
  const [selectedTheme, setSelectedTheme] = useState<string>(""); // selected chat topic for the chat
  const [customTheme, setCustomTheme] = useState<string>(""); // custom topic for the chat
  const [checkGrammarMode, setCheckGrammarMode] = useState<boolean>(false); // selected grammar check mode for the chat
  const [chatId, setChatId] = useState<number | null>(null); // current chat ID
  const [chatMode, setChatMode] = useState<boolean>(false); // selected chat or audio mode in the message section of the chat
  const [chatEnded, setChatEnded] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>(""); // selected subscription plan
  const [summary, setSummary] = useState(null); // chat summary
  const [summaryFetchLoading, setSummaryFetchLoading] = useState(false); // summary generating loading
  const [isMuted, setIsMuted] = useState(false); // speech mute mode

  return (
    <SpeechContext.Provider
      value={{
        selectedPoliteness,
        setSelectedPoliteness,
        selectedLevel,
        setSelectedLevel,
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
        username,
        setUsername,
        subscriptionPlan,
        setSubscriptionPlan,
        summary,
        setSummary,
        summaryFetchLoading,
        setSummaryFetchLoading,
        isMuted,
        setIsMuted,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
