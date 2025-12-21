import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronRight,
  MessageCircle,
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  Plus,
  User,
  UserCheck,
  Leaf,
  TreePine,
  Mountain,
} from "lucide-react";
import { useSpeech } from "../../../context/SpeechContext";
import { ChatType } from "../../../type/types";
import { RoundedButton } from "../../button";
import { BlockUseOverlay } from "../../overlay";
import { apiRequest } from "../../../lib/apiRequest";
import { toast } from "sonner";
import { Header } from "./Header";
import { LevelSelection } from "./LevelSelection";
import { PolitenessSelection } from "./PolitenessSelection";
import { VoiceSelection } from "./VoiceSelection";
import { ThemeSelection } from "./ThemeSelection";
import { GrammarCorrection } from "./GrammarCorrection";

export const ModeSelectScreen = ({
  setHistory,
  setChatInfo,
  setHiraganaReadingList,
  setPaymentOverlay,
  needPayment,
  handleRefreshPreviousData,
  plan,
}: {
  setHistory: React.Dispatch<React.SetStateAction<ChatType>>;
  setChatInfo: React.Dispatch<
    React.SetStateAction<{ audioUrl: string; english: string }[]>
  >;
  setHiraganaReadingList: React.Dispatch<React.SetStateAction<string[]>>;
  setPaymentOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  needPayment: boolean;
  handleRefreshPreviousData: () => void;
  plan: string;
}) => {
  const {
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
    setChatId,
    setChatMode,
    username,
    subscriptionPlan,
    voiceGender,
    setVoiceGender,
  } = useSpeech();

  const iconMap: Record<string, React.ElementType> = useMemo(
    () => ({
      ChevronRight,
      MessageCircle,
      Coffee,
      Briefcase,
      Plane,
      BookOpen,
      Users,
      Plus,
      User,
      UserCheck,
      Leaf,
      TreePine,
      Mountain,
    }),
    []
  );

  const [loading, setLoading] = useState(false);
  const isProUser = plan === "pro" || subscriptionPlan === "pro";

  // Memoize validation check to prevent unnecessary recalculations
  const canProceed = useMemo(
    () =>
      Boolean(
        selectedLevel &&
          (selectedTheme || customTheme.trim()) &&
          selectedPoliteness
      ),
    [selectedLevel, selectedTheme, customTheme, selectedPoliteness]
  );

  // Start the chat - memoized with useCallback
  const handleBeginConversation = useCallback(async () => {
    // if trial is ended overlay
    if (needPayment) {
      setPaymentOverlay(true);
      if (plan !== "pro") {
        toast.error("Your trial has ended. Please select a plan to continue.", {
          position: "top-center",
        });
      } else {
        toast.error(
          "Your pro subscription is not active. Please subscribe to continue.",
          {
            position: "top-center",
          }
        );
      }
      return;
    } else {
      if (loading) return;
      setLoading(true);
      handleRefreshPreviousData();

      try {
        const data = await apiRequest("/api/chat/start-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level: selectedLevel,
            theme: selectedTheme || customTheme.trim(),
            politeness: selectedPoliteness || "polite",
            voiceGender: voiceGender,
          }),
        });

        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        setChatId(Number(data.chatId));
        setHiraganaReadingList((prev) => [...prev, data.reading]);

        if (data.audio) {
          const audioBuffer = Uint8Array.from(atob(data.audio), (c) =>
            c.charCodeAt(0)
          );
          const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.play();
          setChatInfo((prev) => [
            ...prev,
            { audioUrl: audioUrl, english: data.english },
          ]);
          setChatMode(true);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to start conversation. Please try again.", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [
    needPayment,
    plan,
    selectedLevel,
    selectedTheme,
    customTheme,
    selectedPoliteness,
    voiceGender,
    loading,
    handleRefreshPreviousData,
    setHistory,
    setChatId,
    setHiraganaReadingList,
    setChatInfo,
    setChatMode,
    setPaymentOverlay,
  ]);

  return (
    <div className="z-10 min-h-screen shadow-sm backdrop-blur-xl overflow-auto w-full">
      <div className="min-h-screen p-4 overflow-auto w-full">
        <div className="max-w-4xl mx-auto py-8 mt-12">
          <Header
            username={username || "User"}
            subscriptionPlan={subscriptionPlan}
          />

          <LevelSelection
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            iconMap={iconMap}
          />

          <PolitenessSelection
            selectedPoliteness={selectedPoliteness}
            setSelectedPoliteness={setSelectedPoliteness}
            iconMap={iconMap}
          />

          <VoiceSelection
            voiceGender={voiceGender}
            setVoiceGender={setVoiceGender}
          />

          <ThemeSelection
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            customTheme={customTheme}
            setCustomTheme={setCustomTheme}
            isProUser={isProUser}
            setPaymentOverlay={setPaymentOverlay}
            iconMap={iconMap}
          />

          <GrammarCorrection
            isProUser={isProUser}
            checkGrammarMode={checkGrammarMode}
            setCheckGrammarMode={setCheckGrammarMode}
            setPaymentOverlay={setPaymentOverlay}
            iconMap={iconMap}
          />

          {/* Start Button */}
          <div className="flex justify-end">
            <RoundedButton
              disabled={!canProceed}
              loading={loading}
              onClick={() => handleBeginConversation()}
              className={`cursor-pointer inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                canProceed
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-1"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Start Conversation
              <ChevronRight className="w-5 h-5" />
            </RoundedButton>
          </div>
        </div>
      </div>
      {needPayment && (
        <BlockUseOverlay plan={plan === "pro" ? "pro" : "trial"} />
      )}
    </div>
  );
};
