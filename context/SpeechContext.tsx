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
});

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedPoliteness, setSelectedPoliteness] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [customTheme, setCustomTheme] = useState<string>("");
  const [checkGrammarMode, setCheckGrammarMode] = useState<boolean>(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const [chatMode, setChatMode] = useState<boolean>(false);
  const [chatEnded, setChatEnded] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("");
  const [summary, setSummary] = useState(null);
  const [summaryFetchLoading, setSummaryFetchLoading] = useState(false);

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
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
