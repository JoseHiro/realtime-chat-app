// SpeechContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

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
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
