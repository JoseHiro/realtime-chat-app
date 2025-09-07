import React from "react";
import {
  CheckCircle,
  XCircle,
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
import { SummaryData } from "../../type/types";
import { Skeleton } from "../skelton";

export const Summary = ({ summary }: { summary: SummaryData | null }) => {
  const scorePercentage = summary?.score || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 shadow-sm">
        <div className="px-6 py-12 lg:px-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-gray-900 bg-clip-text text-transparent">
                      Conversation Analysis
                    </h1>
                  </div>
                </div>
                <p className="text-xl text-gray-600 max-w-2xl">
                  AI-powered feedback to accelerate your Japanese learning
                  journey
                </p>
              </div>

              {/* Enhanced Score Circle */}
              <div className="relative">
                <div className="w-36 h-36 lg:w-40 lg:h-40">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${scorePercentage * 2.64} 264`}
                      className="transition-all duration-2000 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1f2937" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {scorePercentage || <Skeleton className="w-16 h-8" />}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Total Score
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="px-6 lg:px-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "修正箇所",
                sublabel: "Corrections",
                value: summary?.mistakes?.length || 0,
                icon: AlertCircle,
                color: "from-green-500 to-green-600",
              },
              {
                label: "良い点",
                sublabel: "Strengths",
                value: summary?.goodPoints?.length || 0,
                icon: Star,
                color: "from-blue-500 to-blue-600",
              },
              {
                label: "レベル",
                sublabel: "Level",
                value: summary?.difficultyLevel || "N/A",
                icon: Award,
                color: "from-gray-800 to-gray-900",
              },
              {
                label: "改善点",
                sublabel: "Tips",
                value: summary?.improvementPoints?.length || 0,
                icon: Target,
                color: "from-green-500 to-green-600",
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-sm font-semibold">
                    {stat.sublabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary Card */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
                </div>
                <div className="bg-gray-100 rounded-xl p-6 ">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {summary ? (
                      summary?.summary
                    ) : (
                      <Skeleton className="w-full h-6" />
                    )}
                  </p>
                </div>
              </div>

              {/* Mistakes Section */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Corrections
                  </h2>
                  <div className="ml-auto bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {summary?.mistakes?.length || 0} 個
                  </div>
                </div>

                <div className="space-y-6">
                  {summary?.mistakes?.map((mistake, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 rounded-xl p-6"
                    >
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <XCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-red-600 text-sm font-semibold">
                              Incorrect sentence
                            </span>
                          </div>
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-gray-900 font-bold text-lg mb-1">
                              {mistake.kanji}
                            </p>
                            <p className="text-gray-600">{mistake.kana}</p>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-green-600 text-sm font-semibold">
                              Correction
                            </span>
                          </div>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-gray-900 font-bold text-lg mb-1">
                              {summary?.corrections[index]?.kanji}
                            </p>
                            <p className="text-gray-600">
                              {summary?.corrections[index]?.kana}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sentence Upgrades Section */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sentence Upgrades
                  </h2>
                  <div className="ml-auto bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {summary?.sentenceUpgrades?.length || 0} 個
                  </div>
                </div>

                <div className="space-y-6">
                  {summary?.sentenceUpgrades?.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gray-100 border border-blue-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Upgrade {index + 1}
                        </h4>
                      </div>

                      <div className="space-y-6">
                        {/* Original Sentence */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                              Before
                            </span>
                          </div>
                          <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                            <p className="font-bold text-gray-900 mb-2 text-lg">
                              {item.original.kanji}
                            </p>
                            <p className="text-gray-600 text-xs mb-3">
                              {item.original.kana}
                            </p>
                            <p className="text-sm text-red-600 font-medium">
                              {item.advice}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                        </div>

                        {/* Improved Sentence */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                              After
                            </span>
                          </div>
                          <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                            <p className="font-bold text-gray-900 mb-2 text-lg">
                              {item.upgraded.kanji}
                            </p>
                            <p className="text-gray-600 text-xs mb-3">
                              {item.upgraded.kana}
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              {item.advice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Analysis Sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Topic Development */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Topic Development
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {summary?.topicDevelopment}
                  </p>
                </div>

                {/* Response Skill */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Response Skills
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {summary?.responseSkill}
                  </p>
                </div>
              </div>

              {/* Difficulty Reason */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Level Assessment
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {summary?.difficultyReason}
                </p>
              </div>

              {/* Common Mistakes */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Common Mistakes
                  </h2>
                  <span className="text-gray-500 text-sm">
                    Patterns to Watch
                  </span>
                  <div className="ml-auto bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {summary?.commonMistakes?.length || 0} 個
                  </div>
                </div>

                <div className="space-y-4">
                  {summary?.commonMistakes?.map((mistake, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium text-lg">
                        {mistake}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Strengths */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                  <div className="ml-auto bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {summary?.goodPoints?.length || 0} 個
                  </div>
                </div>

                <div className="space-y-4">
                  {summary?.goodPoints?.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl"
                    >
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-gray-800 font-medium">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvement Tips */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Next Steps
                  </h3>
                  <div className="ml-auto bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {summary?.improvementPoints?.length || 0} 個
                  </div>
                </div>

                <div className="space-y-4">
                  {summary?.improvementPoints?.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocabulary Suggestions */}
              {summary?.vocabularySuggestions &&
                summary.vocabularySuggestions.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Vocabulary Focus
                      </h3>
                      <div className="ml-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold">
                        {summary?.vocabularySuggestions?.length || 0} 個
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {summary?.vocabularySuggestions?.map((word, index) => (
                        <div
                          key={index}
                          className="px-5 py-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                        >
                          <span className="text-gray-900 font-semibold text-lg">
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
    </div>
  );
};
