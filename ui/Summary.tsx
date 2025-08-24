import React from "react";

import {
  CheckCircle,
  XCircle,
  TrendingUp,
  Star,
  BookOpen,
  Target,
  Award,
  AlertCircle,
  ArrowRight,
  Zap,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { SummaryData } from "../type/types";

export const Summary = ({ summary }: { summary: SummaryData | null }) => {
  // console.log(summary);

  const scorePercentage = summary?.score || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 to-gray-50/80"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-slate-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-6 py-12 lg:px-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-slate-600 to-gray-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-500/20">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-gray-900">
                      Conversation
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-gray-600">
                        Analysis
                      </span>
                    </h1>
                  </div>
                </div>
                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                  AI-powered feedback to accelerate your Japanese learning
                  journey
                </p>
              </div>

              {/* Score Circle */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${scorePercentage * 2.83} 283`}
                      className="transition-all duration-1000 ease-out drop-shadow-sm"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#64748b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold text-gray-900">
                        {scorePercentage}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Score
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 lg:px-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Corrections",
                value: summary?.mistakes?.length || 0,
                color: "from-rose-500 to-red-500",
                bg: "bg-rose-50",
                border: "border-rose-100",
                icon: AlertCircle,
              },
              {
                label: "Strengths",
                value: summary?.goodPoints?.length || 0,
                color: "from-emerald-500 to-green-500",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                icon: Star,
              },
              {
                label: "Level",
                value: summary?.difficultyLevel || "N/A",
                color: "from-blue-500 to-indigo-500",
                bg: "bg-blue-50",
                border: "border-blue-100",
                icon: Award,
              },
              {
                label: "Tips",
                value: summary?.improvementPoints?.length || 0,
                color: "from-violet-500 to-purple-500",
                bg: "bg-violet-50",
                border: "border-violet-100",
                icon: Target,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`bg-white ${stat.border} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 shadow-sm`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm font-semibold">
                    {stat.label}
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-gray-600 rounded-lg flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Conversation Summary
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-gray-50/50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {summary?.summary}
                  </p>
                </div>
              </div>

              {/* Mistakes Section */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-red-500 rounded-lg flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Corrections
                  </h2>
                  <div className="ml-auto bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-semibold border border-rose-200">
                    {summary?.mistakes?.length || 0} items
                  </div>
                </div>

                <div className="space-y-4">
                  {summary?.mistakes?.map((mistake, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-rose-50 to-transparent border-2 border-rose-100 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                              <XCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-rose-600 text-sm font-bold uppercase tracking-wider">
                              Incorrect
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-900 font-semibold text-lg">
                              {mistake.kanji}
                            </p>
                            <p className="text-gray-600 text-sm font-medium">
                              {mistake.kana}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-emerald-600 text-sm font-bold uppercase tracking-wider">
                              Correct
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-900 font-semibold text-lg">
                              {summary.corrections[index]?.kanji}
                            </p>
                            <p className="text-gray-600 text-sm font-medium">
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
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
                      className="p-6 bg-gradient-to-r from-violet-50 to-transparent border-2 border-violet-100 rounded-xl"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                          {index + 1}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          改善例 {index + 1}
                        </h4>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Original Sentence */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                              改善前
                            </span>
                          </div>
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              {item.original.kanji}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.original.kana}
                            </p>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center justify-center md:justify-start">
                          <ArrowRight className="w-6 h-6 text-violet-500" />
                        </div>

                        {/* Improved Sentence */}
                        <div className="space-y-3 md:col-start-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                              改善後
                            </span>
                          </div>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-lg font-medium text-gray-900 mb-2">
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

              {/* Common Mistakes */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Common Mistake Patterns
                  </h2>
                </div>

                <div className="space-y-3">
                  {summary?.commonMistakes?.map((mistake, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-transparent border-2 border-orange-100 rounded-xl"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 font-medium">{mistake}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Strengths */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                </div>

                <div className="space-y-3">
                  {summary?.goodPoints?.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-transparent border-2 border-emerald-100 rounded-xl"
                    >
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-emerald-700 text-sm font-bold uppercase tracking-wider">
                      Excellent!
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">
                    Keep up the great work! Your conversation skills are
                    improving.
                  </p>
                </div>
              </div>

              {/* Improvement Tips */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
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
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-violet-50 to-transparent border-2 border-violet-100 rounded-xl"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 font-medium">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vocabulary Suggestions */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Vocabulary Focus
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {summary?.vocabularySuggestions?.map((word, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-100 rounded-xl"
                    >
                      <span className="text-gray-800 font-medium text-lg">
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pro Tip */}
          <div className="mt-8">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-700 text-sm font-bold uppercase tracking-wider">
                  Learning Tip
                </span>
              </div>
              <p className="text-gray-700 font-medium">
                Practice makes perfect! Daily conversation practice will boost
                your confidence and help you internalize correct grammar
                patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
