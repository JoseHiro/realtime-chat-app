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

export const ModeSelectScreen = ({
  setHistory,
  setAudioList,
  setChartStart,
}: {
  setHistory: (history: any) => void;
  setAudioList: (audioList: any) => void;
  setChartStart: (start: boolean) => void;
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
  } = useSpeech();

  const levels = [
    {
      id: "easy",
      label: "Easy",
      description: "Basic vocabulary and simple sentences",
      color: "from-green-300 to-green-400",
    },
    {
      id: "medium",
      label: "Medium",
      description: "Everyday conversations and expressions",
      color: "from-green-400 to-green-500",
    },
    {
      id: "hard",
      label: "Hard",
      description: "Complex topics and advanced grammar",
      color: "from-green-500 to-green-600",
    },
  ];

  const themes = [
    {
      id: "daily",
      label: "Daily Life",
      icon: Coffee,
      description: "Everyday conversations and activities",
    },
    {
      id: "business",
      label: "Business",
      icon: Briefcase,
      description: "Professional and workplace discussions",
    },
    {
      id: "travel",
      label: "Travel",
      icon: Plane,
      description: "Tourism and cultural experiences",
    },
    {
      id: "culture",
      label: "Culture",
      icon: BookOpen,
      description: "Japanese traditions and society",
    },
    {
      id: "social",
      label: "Social",
      icon: Users,
      description: "Making friends and social interactions",
    },
  ];

  const politenessOptions = [
    {
      id: "casual",
      label: "Casual Form",
      description: "For friends and close relationships",
      icon: User,
      example: "そうだね、面白い",
      color: "from-blue-400 to-blue-500",
    },
    {
      id: "polite",
      label: "Formal Form",
      description: "Polite speech for formal situations",
      icon: UserCheck,
      example: "そうですね、面白いです",
      color: "from-purple-400 to-purple-500",
    },
  ];

  const canProceed =
    selectedLevel &&
    (selectedTheme || customTheme.trim()) &&
    selectedPoliteness;

  const handleBeginConversation = async () => {
    console.log(
      selectedLevel,
      selectedTheme || customTheme.trim(),
      selectedPoliteness
    );
    const res = await fetch("/api/start-conversation-tts", {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 overflow-auto w-full">
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
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  selectedLevel === level.id
                    ? "border-green-500 shadow-green-200"
                    : "border-transparent hover:border-green-200"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${level.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {level.label}
                  </h3>
                  <p className="text-gray-600 text-sm">{level.description}</p>
                </div>
                {selectedLevel === level.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Politeness Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Choose Speaking Style
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {politenessOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.label}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {option.description}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      {option.example}
                    </p>
                  </div>
                  {selectedPoliteness === option.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
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
              const IconComponent = theme.icon;
              return (
                <button
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
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {theme.label}
                    </h3>
                    <p className="text-xs text-gray-500">{theme.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Theme */}
          <div className="max-w-md mx-auto">
            <button
              onClick={() => {
                setSelectedTheme(null);
                document.getElementById("custom-theme").focus();
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
                <span className="font-medium text-gray-700">Custom Theme</span>
              </div>
            </button>

            <input
              id="custom-theme"
              type="text"
              placeholder="Enter your own conversation topic..."
              value={customTheme}
              onChange={(e) => {
                setCustomTheme(e.target.value);
                setSelectedTheme(null);
              }}
              className="text-black w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors duration-300 bg-white shadow-lg"
            />
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
  );
};
