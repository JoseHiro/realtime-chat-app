import React, { useMemo } from "react";
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
import { useChatSession } from "../../../context/ChatSessionContext";
import { useUser } from "../../../context/UserContext";
import { ChatType } from "../../../type/types";
import { RoundedButton } from "../../shared/button";
import { BlockUseOverlay } from "../../overlay";
import { Header } from "./Header";
import { LevelSelection } from "./LevelSelection";
import { PolitenessSelection } from "./PolitenessSelection";
import { ThemeSelection } from "./ThemeSelection";
import { GrammarCorrection } from "./GrammarCorrection";
import { CreditCostDisplay } from "./CreditCostDisplay";
import { CharacterTimeSelection } from "./CharacterTimeSelection";
import themes from "../../../data/themes.json";

export const ModeSelectScreen = ({
  setHistory,
  setChatInfo,
  setHiraganaReadingList,
  setPaymentOverlay,
  handleRefreshPreviousData,
  handleBeginConversation,
  needPayment,
  loading,
  plan,
}: {
  setHistory: React.Dispatch<React.SetStateAction<ChatType>>;
  setChatInfo: React.Dispatch<
    React.SetStateAction<{ audioUrl: string; english: string }[]>
  >;
  loading: boolean;
  setHiraganaReadingList: React.Dispatch<React.SetStateAction<string[]>>;
  setPaymentOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  needPayment: boolean;
  handleRefreshPreviousData: () => void;
  plan: string;
  handleBeginConversation: () => void;
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
    selectedTime,
    setSelectedTime,
    selectedCharacter,
    setSelectedCharacter,
  } = useChatSession();
  const { username, subscriptionPlan, creditsRemaining } = useUser();

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
    [],
  );

  const isProUser = plan === "pro" || subscriptionPlan === "pro";

  // Memoize validation check to prevent unnecessary recalculations
  const canProceed = useMemo(
    () =>
      Boolean(
        selectedLevel &&
        (selectedTheme || customTheme.trim()) &&
        selectedPoliteness,
      ),
    [selectedLevel, selectedTheme, customTheme, selectedPoliteness],
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-green-50 overflow-auto w-full">
      <div className="relative min-h-screen overflow-auto w-full">
        <div className="min-h-screen p-4 overflow-auto w-full">
          <div className="max-w-4xl mx-auto py-8 mt-6">
            <Header
              username={username || "User"}
              subscriptionPlan={subscriptionPlan}
              creditsRemaining={creditsRemaining}
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

            <CharacterTimeSelection
              selectedCharacter={selectedCharacter}
              setSelectedCharacter={setSelectedCharacter}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />

            <ThemeSelection
              themes={themes}
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

            {/* Credit Cost Display - Right before Start Button as final checkpoint */}
            <CreditCostDisplay
              selectedTime={selectedTime}
              selectedCharacter={selectedCharacter}
              creditsRemaining={creditsRemaining}
              subscriptionPlan={subscriptionPlan}
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
          <div className="fixed inset-0 z-[100]">
            <BlockUseOverlay plan={plan === "pro" ? "pro" : "trial"} />
          </div>
        )}
      </div>
    </div>
  );
};
