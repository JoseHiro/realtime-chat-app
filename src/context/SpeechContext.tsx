// SpeechContext.tsx
import React, { createContext, useContext, useState } from "react";

type SpeechLevel = "polite" | "casual";

interface SpeechContextType {
  selectedLevel: string;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
  selectedPoliteness: string;
  setSelectedPoliteness: React.Dispatch<React.SetStateAction<string>>;
  selectedTheme: string;
  setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
  customTheme: string;
  setCustomTheme: React.Dispatch<React.SetStateAction<string>>;
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
});

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedPoliteness, setSelectedPoliteness] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [customTheme, setCustomTheme] = useState<string>("");
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
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
