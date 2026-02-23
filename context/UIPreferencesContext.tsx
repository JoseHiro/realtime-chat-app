import React, { createContext, useContext, useState } from "react";

export interface UIPreferencesContextType {
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  voiceGender: "male" | "female";
  setVoiceGender: React.Dispatch<React.SetStateAction<"male" | "female">>;
  showHiragana: boolean;
  setShowHiragana: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultState: UIPreferencesContextType = {
  isMuted: false,
  setIsMuted: () => {},
  voiceGender: "female",
  setVoiceGender: () => {},
  showHiragana: false,
  setShowHiragana: () => {},
};

const UIPreferencesContext = createContext<UIPreferencesContextType>(defaultState);

export const UIPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [voiceGender, setVoiceGender] = useState<"male" | "female">("female");
  const [showHiragana, setShowHiragana] = useState(false);

  const value: UIPreferencesContextType = {
    isMuted,
    setIsMuted,
    voiceGender,
    setVoiceGender,
    showHiragana,
    setShowHiragana,
  };

  return (
    <UIPreferencesContext.Provider value={value}>
      {children}
    </UIPreferencesContext.Provider>
  );
};

export const useUIPreferences = (): UIPreferencesContextType =>
  useContext(UIPreferencesContext);
