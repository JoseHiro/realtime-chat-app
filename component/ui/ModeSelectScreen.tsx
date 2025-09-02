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
  Star,
  Leaf,
  TreePine,
  Mountain,
  Edit3,
} from "lucide-react";
import { useSpeech } from "../../context/SpeechContext";
import { ChatType } from "../../type/types";
import { SelectModeButton } from "../button";
import levels from "../../data/levels.json";
import corrections from "../../data/corrections.json";
import themes from "../../data/themes.json";
import politenesses from "../../data/politenesses.json";

export const ModeSelectScreen = ({
  setHistory,
  setAudioList,
  setChatMode,
  setHiraganaReadingList,
}: {
  setHistory: React.Dispatch<React.SetStateAction<ChatType>>;
  setAudioList: React.Dispatch<React.SetStateAction<string[]>>;
  setChatMode: (start: boolean) => void;
  setHiraganaReadingList: React.Dispatch<React.SetStateAction<string[]>>;
  // handleSetReading: any;
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
    Leaf,
    TreePine,
    Mountain,
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

    const res = await fetch("/api/chat/start-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: selectedLevel,
        theme: selectedTheme || customTheme.trim(),
        politeness: selectedPoliteness || "polite",
      }),
    });

    const data = await res.json();
    setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    setChatId(Number(data.chatId));
    setHiraganaReadingList((prev) => [...prev, data.reading]);
    // handleSetReading(data.reply);

    if (data.audio) {
      const audioBuffer = Uint8Array.from(atob(data.audio), (c) =>
        c.charCodeAt(0)
      );
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
      setAudioList((prev) => [...prev, audioUrl]);
      setChatMode(true);
    }
  };

  const DifficultyStars = ({ level }: { level: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= level
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
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
              {levels.map((level) => {
                const IconComponent = iconMap[level.icon];
                const isSelected = selectedLevel === level.id;

                return (
                  <div
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                      isSelected
                        ? "border-green-500 shadow-green-200 ring-4 ring-green-500 ring-opacity-20"
                        : "border-transparent hover:border-green-200"
                    }`}
                  >
                    {/* Header with Icon and Stars */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${level.color} text-white shadow-lg`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <DifficultyStars level={level.difficulty} />
                    </div>

                    {/* Level Info */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {level.label}
                        </h3>
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {level.japaneseLevel}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {level.description}
                      </p>
                    </div>

                    {/* Difficulty Indicator Bar */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span>Difficulty</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${level.color} transition-all duration-300`}
                          style={{ width: `${(level.difficulty / 3) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        SELECTED
                      </div>
                    )}

                    {/* Hover Glow Effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                        isSelected
                          ? "bg-gradient-to-br from-green-500/5 to-green-600/5"
                          : "group-hover:bg-gradient-to-br group-hover:from-green-500/5 group-hover:to-green-600/5"
                      }`}
                    />
                  </div>
                );
              })}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => {
                const IconComponent = iconMap[theme.icon];
                const isSelected = selectedTheme === theme.id;

                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                      isSelected
                        ? "ring-4 ring-green-500 ring-opacity-50 shadow-green-200"
                        : "hover:shadow-xl"
                    }`}
                  >
                    {/* Background Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={theme.imgURL}
                        alt={theme.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Selected
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? "bg-green-500 text-white"
                              : "bg-green-100 text-green-600 group-hover:bg-green-200"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {theme.label}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                        isSelected
                          ? "border-2 border-green-500"
                          : "border-2 border-transparent group-hover:border-green-300"
                      }`}
                    />
                  </div>
                );
              })}
              {/* Custom Theme */}
              <div
                className={`relative group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                  customTheme.trim()
                    ? "ring-4 ring-green-500 ring-opacity-50 shadow-green-200"
                    : "hover:shadow-xl"
                }`}
              >
                {" "}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 overflow-hidden">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Custom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Edit3 className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Selected Badge */}
                  {customTheme.trim() && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Selected
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        customTheme.trim()
                          ? "bg-green-500 text-white"
                          : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Custom Theme
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Create your own conversation topic
                  </p>

                  <input
                    id="custom-theme"
                    type="text"
                    placeholder="Enter your topic (e.g., cooking, anime, sports...)"
                    value={customTheme}
                    onChange={(e) => {
                      setCustomTheme(e.target.value);
                      setSelectedTheme("");
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTheme("");
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-300 bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
                {/* Hover Effect Border */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                    customTheme.trim()
                      ? "border-2 border-green-500"
                      : "border-2 border-transparent group-hover:border-purple-300"
                  }`}
                />
              </div>
            </div>

            {/* Custom Theme */}
            {/* <div className="max-w-md mx-auto mt-6">
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
            </div> */}
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
