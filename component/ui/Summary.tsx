import React from "react";
import {
  CheckCircle,
  Star,
  BookOpen,
  Target,
  Brain,
  Award,
  AlertCircle,
  ArrowRight,
  Zap,
  RotateCcw,
  Lightbulb,
  Clock,
  MessageSquare,
} from "lucide-react";


// Sample data for demonstration
const sampleSummary = {
  score: 70,
  title: "Casual Check-In",
  summary: "A casual conversation about how the learner is feeling today.",
  mistakes: [],
  goodPoints: [
    "The learner's responses were direct and clear.",
    "The learner maintained a casual tone.",
  ],
  corrections: [],
  responseSkill:
    "The learner acknowledges questions but could enhance the flow with more expressive responses.",
  commonMistakes: ["Repetitive short answers without elaboration."],
  difficultyLevel: "N5",
  difficultyReason:
    "The learner's responses are basic and simplistic, indicating an early stage of language proficiency.",
  sentenceUpgrades: [
    {
      advice: "Adding a context to your answer can make it more informative.",
      original: {
        kana: "いい",
        kanji: "いい",
      },
      upgraded: {
        kana: "きょうは いい ひ です",
        kanji: "今日はいい日です",
      },
    },
  ],
  topicDevelopment:
    "The learner is able to respond to topics, but lacks depth in conversation.",
  improvementPoints: [
    "The learner could provide more details about their feelings.",
    "Try to elaborate on responses for a more engaging conversation.",
  ],
  vocabularySuggestions: ["感情", "詳しく", "会話"],
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

export const Summary = ({ summary = sampleSummary }) => {
  const scorePercentage = summary?.score || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-normal text-black">
                  Performance Analysis
                </h1>
                <p className="text-gray-600 mt-1">
                  Comprehensive assessment and strategic recommendations
                </p>
              </div>
            </div>

            {/* Score Display */}
            <div className="relative">
              <div className="w-32 h-32">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 120 120"
                >
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="6"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${scorePercentage * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-semibold text-black">
                      {scorePercentage || <Skeleton className="w-8 h-6" />}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              label: "Corrections",
              value: summary?.mistakes?.length || 0,
              icon: AlertCircle,
            },
            {
              label: "Strengths",
              value: summary?.goodPoints?.length || 0,
              icon: Star,
            },
            {
              label: "Current Level",
              value: summary?.difficultyLevel || "N/A",
              icon: Award,
            },
            {
              label: "Improvement Tips",
              value: summary?.improvementPoints?.length || 0,
              icon: Target,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-gray-700" />
                </div>
                <div className="text-2xl font-semibold text-black mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Executive Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-black">
                  Executive Summary
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="text-gray-800 leading-relaxed">
                  {summary ? summary?.summary : <Skeleton className="w-full h-6" />}
                </p>
              </div>
            </div>

            {/* Corrections Section */}
            {summary?.mistakes?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-semibold text-black">
                      Language Corrections
                    </h2>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    {summary?.mistakes?.length} items
                  </span>
                </div>

                <div className="space-y-6">
                  {summary?.mistakes?.map((mistake, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            Original
                          </div>
                          <div className="bg-gray-50 border rounded p-4">
                            <p className="font-medium text-black mb-1">
                              {mistake.kanji}
                            </p>
                            <p className="text-sm text-gray-600">
                              {mistake.kana}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="w-5 h-5 text-green-600" />
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            Correction
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded p-4">
                            <p className="font-medium text-black mb-1">
                              {summary?.corrections[index]?.kanji}
                            </p>
                            <p className="text-sm text-gray-600">
                              {summary?.corrections[index]?.kana}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentence Enhancement */}
            {summary?.sentenceUpgrades?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-semibold text-black">
                      Expression Enhancement
                    </h2>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    {summary?.sentenceUpgrades?.length} upgrades
                  </span>
                </div>

                <div className="space-y-6">
                  {summary?.sentenceUpgrades?.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            Current Expression
                          </div>
                          <div className="bg-gray-50 border rounded p-4 mb-3">
                            <p className="font-medium text-black mb-1">
                              {item.original.kanji}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.original.kana}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 italic">
                            {item.advice}
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="w-5 h-5 text-green-600" />
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            Enhanced Expression
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded p-4">
                            <p className="font-medium text-black mb-1">
                              {item.upgraded.kanji}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.upgraded.kana}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-black">
                    Topic Development
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {summary?.topicDevelopment}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-black">
                    Response Fluency
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {summary?.responseSkill}
                </p>
              </div>
            </div>

            {/* Proficiency Assessment */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Brain className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-semibold text-black">
                  Proficiency Assessment
                </h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <p className="text-gray-800 leading-relaxed">
                  {summary?.difficultyReason}
                </p>
              </div>
            </div>

            {/* Pattern Analysis */}
            {summary?.commonMistakes?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-semibold text-black">
                      Pattern Analysis
                    </h2>
                  </div>
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                    {summary?.commonMistakes?.length} patterns
                  </span>
                </div>

                <div className="space-y-4">
                  {summary?.commonMistakes?.map((mistake, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-100 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {mistake}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Strengths */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-black">
                    Strengths
                  </h3>
                </div>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                  {summary?.goodPoints?.length}
                </span>
              </div>

              <div className="space-y-3">
                {summary?.goodPoints?.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 border border-green-100 rounded"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Points */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-black">
                    Focus Areas
                  </h3>
                </div>
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                  {summary?.improvementPoints?.length}
                </span>
              </div>

              <div className="space-y-3">
                {summary?.improvementPoints?.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-100 rounded"
                  >
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vocabulary Suggestions */}
            {summary?.vocabularySuggestions && summary.vocabularySuggestions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-black">
                      Vocabulary Focus
                    </h3>
                  </div>
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                    {summary?.vocabularySuggestions?.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {summary?.vocabularySuggestions?.map((word, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 bg-gray-50 border border-gray-100 rounded"
                    >
                      <span className="text-black font-medium">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
