import React, { useState } from "react";
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
} from "lucide-react";
import { useSpeech } from "../context/SpeechContext";
import { ChatType } from "../type/types";
import { SelectModeButton } from "../component/button";
import { levels } from "../data/levels.json";
import corrections from "../data/corrections.json";
import themes from "../data/themes.json";
import politenesses from "../data/politenesses.json";
import { v4 as uuidv4 } from "uuid";

export const ModeSelectScreen = ({
  setHistory,
  setAudioList,
  setChartStart,
  handleSetReading,
}: {
  setHistory: React.Dispatch<React.SetStateAction<ChatType>>;
  setAudioList: React.Dispatch<React.SetStateAction<string[]>>;
  setChartStart: (start: boolean) => void;
  handleSetReading: any;
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
    // chatId,
    setChatId,
  } = useSpeech();

  const iconMap: Record<string, React.ElementType> = {
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
  };
  const [isStarting, setIsStarting] = useState(false);

  const canProceed =
    selectedLevel &&
    (selectedTheme || customTheme.trim()) &&
    selectedPoliteness;

  // Start the chat
  const handleBeginConversation = async () => {
    if (isStarting) return;
    setIsStarting(true);
    const uniqueId = uuidv4();
    setChatId(uniqueId);

    const res = await fetch("/api/start-conversation-tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: selectedLevel,
        theme: selectedTheme || customTheme.trim(),
        politeness: selectedPoliteness || "polite",
        chatId: uniqueId,
      }),
    });

    const data = await res.json();
    setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    handleSetReading(data.reply);

    if (data.audio) {
      const audioBuffer = Uint8Array.from(atob(data.audio), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      setAudioList((prev) => [...prev, audioUrl]);
      setChartStart(true);
    }
  };

  const handleTest = async () => {
    console.log("dsdssdsdsds");

    const res = await fetch("/api/test", { method: "GET" });
  };

  return (
    <div className="z-10 min-h-screen shadow-sm backdrop-blur-xl overflow-auto w-full">
      <div className="min-h-screen p-4 overflow-auto w-full ">
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 shadow-lg shadow-green-200">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <button onClick={() => handleTest()}>Test</button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Japanese Conversation Practice
            </h1>
            <p className="text-gray-600">
              Choose your level, conversation theme, and speaking style to get
              started
            </p>
          </div>

          {/* Level Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Select Your Japanese Level
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {levels.map((level) => (
                <SelectModeButton
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                    selectedLevel === level.id
                      ? "border-green-500 shadow-green-200"
                      : "border-transparent hover:border-green-200"
                  }`}
                >
                  <ButtonContents
                    color={level.color}
                    label={level.label}
                    description={level.description}
                    selected={selectedLevel === level.id}
                  />
                </SelectModeButton>
              ))}
            </div>
          </div>

          {/* Politeness Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Choose Speaking Style
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {politenesses.map((option) => {
                const IconComponent = iconMap[option.icon] ?? User;
                return (
                  <SelectModeButton
                    key={option.id}
                    onClick={() => setSelectedPoliteness(option.id)}
                    className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                      selectedPoliteness === option.id
                        ? "border-green-500 shadow-green-200"
                        : "border-transparent hover:border-green-200"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>
                    <div className="relative z-10 text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors duration-300 ${
                          selectedPoliteness === option.id
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <ButtonContents
                        label={option.label}
                        description={option.description}
                        example={option.example}
                        selected={selectedPoliteness === option.id}
                      />
                    </div>
                  </SelectModeButton>
                );
              })}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Choose Conversation Theme
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {themes.map((theme) => {
                const IconComponent = iconMap[theme.icon] ?? User; // fallback
                return (
                  <SelectModeButton
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      setCustomTheme("");
                    }}
                    className={`cursor-pointer relative group p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                      selectedTheme === theme.id
                        ? "border-green-500 shadow-green-200"
                        : "border-transparent hover:border-green-200"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${
                          selectedTheme === theme.id
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-green-600 group-hover:bg-green-200"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <ButtonContents
                        label={theme.label}
                        description={theme.description}
                      />
                    </div>
                  </SelectModeButton>
                );
              })}
            </div>

            {/* Custom Theme */}
            <div className="max-w-md mx-auto">
              <SelectModeButton
                onClick={() => {
                  setSelectedTheme("");
                  const input = document.getElementById("custom-theme");
                  if (input) input.focus();
                }}
                className={`cursor-pointer w-full p-4 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 mb-4 ${
                  customTheme.trim()
                    ? "border-green-500 shadow-green-200"
                    : "border-dashed border-gray-300 hover:border-green-300"
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-700">
                    Custom Theme
                  </span>
                </div>
              </SelectModeButton>

              <input
                id="custom-theme"
                type="text"
                placeholder="Enter your own conversation topic..."
                value={customTheme}
                onChange={(e) => {
                  setCustomTheme(e.target.value);
                  setSelectedTheme("");
                }}
                className="text-black w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-300 bg-white shadow-lg"
              />
            </div>
          </div>

          {/* fix grammar during conversation */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Fix Grammar During Conversation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {corrections.map((option) => {
                const IconComponent = iconMap[option.icon] ?? User;
                return (
                  <SelectModeButton
                    key={option.id}
                    onClick={() => setCheckGrammarMode(option.value)}
                    className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                      checkGrammarMode === option.value
                        ? "border-green-500 shadow-green-200"
                        : "border-transparent hover:border-green-200"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>
                    <div className="relative z-10 text-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors duration-300 ${
                          checkGrammarMode === option.value
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                        }`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <ButtonContents
                        label={option.label}
                        description={option.description}
                        example={option.example}
                        selected={checkGrammarMode === option.value}
                      />
                    </div>
                  </SelectModeButton>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              disabled={!canProceed}
              onClick={() => handleBeginConversation()}
              className={`cursor-pointer inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                canProceed
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-1"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Start Conversation
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type ButtonContentsProps = {
  color?: string;
  label: string;
  description: string;
  example?: string;
  selected?: boolean;
};

const ButtonContents = ({
  color,
  label,
  description,
  example,
  selected,
}: ButtonContentsProps) => {
  return (
    <>
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      ></div>
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{label}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-xs text-gray-500 italic">{example}</p>
      </div>
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}
    </>
  );
};
