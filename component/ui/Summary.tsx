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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 shadow-sm">
        <div className="px-6 py-12 lg:px-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Conversation Analysis
                    </h1>
                    <p className="text-lg text-gray-500 mt-1"></p>
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
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {scorePercentage ? (
                          scorePercentage
                        ) : (
                          <Skeleton className="w-32 h-4 mt-2" />
                        )}
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
                color: "bg-green-500",
              },
              {
                label: "良い点",
                sublabel: "Strengths",
                value: summary?.goodPoints?.length || 0,
                icon: Star,
                color: "from-blue-500 to-cyan-500",
              },
              {
                label: "レベル",
                sublabel: "Level",
                value: summary?.difficultyLevel || "N/A",
                icon: Award,
                color: "from-green-500 to-emerald-500",
              },
              {
                label: "改善点",
                sublabel: "Tips",
                value: summary?.improvementPoints?.length || 0,
                icon: Target,
                color: "from-blue-500 to-cyan-500",
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
                  <div className="text-gray-500 text-sm font-semibold mb-1">
                    {stat.sublabel}
                  </div>
                  {/* <div className="text-gray-500 text-xs">{stat.sublabel}</div> */}
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {summary ? (
                      summary?.summary
                    ) : (
                      <Skeleton className="w-32 h-4 mt-2" />
                    )}
                  </p>
                </div>
              </div>

              {/* Mistakes Section */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
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
                      className="bg-gradient-to-br from-gray-50 to-red-50 border border-red-100 rounded-xl p-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6 items-center">
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

                        <div className="flex items-center justify-center">
                          <ArrowRight className="w-8 h-8 text-gray-400" />
                        </div>

                        <div className="space-y-3 md:col-start-2">
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
                              {summary.corrections[index]?.kanji}
                            </p>
                            <p className="text-gray-600">
                              {summary.corrections[index]?.kana}
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
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Sentence Upgrades
                  </h2>
                </div>

                <div className="space-y-6">
                  {summary?.sentenceUpgrades?.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Fixed Sentence {index + 1}
                        </h4>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Original Sentence */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                              Before fixing
                            </span>
                          </div>
                          <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                            <p className="font-bold text-gray-900 mb-2 text-lg">
                              {item.original.kanji}
                            </p>
                            <p className="text-gray-600">
                              {item.original.kana}
                            </p>
                          </div>
                        </div>

                        {/* Improved Sentence */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                              Fixed Sentence
                            </span>
                          </div>
                          <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                            <p className="font-bold text-gray-900 mb-2 text-lg">
                              {item.upgraded.kanji}
                            </p>
                            <p className="text-gray-600">
                              {item.upgraded.kana}
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
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Developing Conversation
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {summary?.topicDevelopment}
                  </p>
                </div>

                {/* Response Skill */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Responding skills
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
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
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
                  <span className="text-gray-500 text-sm">Common Patterns</span>
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                </div>

                <div className="space-y-4">
                  {summary?.goodPoints?.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl"
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Next Steps
                  </h3>
                </div>

                <div className="space-y-4">
                  {summary?.improvementPoints?.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocabulary Suggestions */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Vocabulary Focus
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {summary?.vocabularySuggestions?.map((word, index) => (
                    <div
                      key={index}
                      className="px-5 py-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-gray-900 font-semibold text-lg">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Learning Tip */}
          {/* <div className="mt-12">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-100 rounded-2xl p-8 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-900 font-bold text-lg">
                  学習のコツ
                </span>
                <span className="text-gray-500 text-sm">Learning Tip</span>
              </div>
              <p className="text-gray-800 text-lg leading-relaxed">
                継続は力なり！毎日の会話練習で自信をつけ、正しい文法パターンを身につけましょう。小さな積み重ねが大きな成長につながります。
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
