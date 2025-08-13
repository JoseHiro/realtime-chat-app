import React, { useState } from "react";
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
} from "lucide-react";
import { SummaryData } from "@/type/types";

export const Summary = ({ summary }: { summary: SummaryData }) => {
  // const summary = {
  //   summary:
  //     "ユーザーは友達と映画を見たが、少しつまらなかったと感じた。映画はサスペンスで、主人公が最後に死んでしまう話だった。ユーザーは俳優が有名ではないため、違和感を感じた。",
  //   mistakes: ["死んだです", "滑って事故になった", "有名じゃないだから"],
  //   corrections: ["死にました", "滑って事故になりました", "有名ではないので"],
  //   goodPoints: ["会話が続いている", "感情を表現している"],
  //   difficultyLevel: "N4",
  //   improvementPoints: ["文法の正確性を向上させる", "表現を豊かにする"],
  // };

  console.log(summary);

  const scorePercentage = 78;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 to-emerald-50/80"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative px-6 py-12 lg:px-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/20">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-gray-900">
                      Conversation
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
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
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
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
                value: summary?.mistakes?.length,
                color: "from-red-500 to-pink-500",
                bg: "bg-red-50",
                border: "border-red-100",
                icon: AlertCircle,
              },
              {
                label: "Strengths",
                value: summary?.goodPoints?.length,
                color: "from-green-500 to-emerald-500",
                bg: "bg-green-50",
                border: "border-green-100",
                icon: Star,
              },
              {
                label: "Level",
                value: summary?.difficultyLevel,
                color: "from-blue-500 to-cyan-500",
                bg: "bg-blue-50",
                border: "border-blue-100",
                icon: Award,
              },
              {
                label: "Tips",
                value: summary?.improvementPoints?.length,
                color: "from-purple-500 to-violet-500",
                bg: "bg-purple-50",
                border: "border-purple-100",
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
            {/* Summary Card */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Conversation Summary
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {summary?.summary}
                  </p>
                </div>
              </div>

              {/* Mistakes Section */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Corrections
                  </h2>
                  <div className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold border border-red-200">
                    {summary?.mistakes?.length} items
                  </div>
                </div>

                <div className="space-y-4">
                  {summary?.mistakes?.map((mistake, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-red-50 to-transparent border-2 border-red-100 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <XCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-red-600 text-sm font-bold uppercase tracking-wider">
                              Incorrect
                            </span>
                          </div>
                          <p className="text-gray-900 font-semibold text-lg">
                            {mistake}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-green-600 text-sm font-bold uppercase tracking-wider">
                              Correct
                            </span>
                          </div>
                          <p className="text-gray-900 font-semibold text-lg">
                            {mistake}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Strengths */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                </div>

                <div className="space-y-3">
                  {summary?.goodPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-transparent border-2 border-green-100 rounded-xl"
                    >
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-yellow-700 text-sm font-bold uppercase tracking-wider">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-sm">
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
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-transparent border-2 border-purple-100 rounded-xl"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 font-medium">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-blue-700 text-sm font-bold uppercase tracking-wider">
                      Pro Tip
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm font-medium">
                    Practice makes perfect! Daily conversation practice will
                    boost your confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
