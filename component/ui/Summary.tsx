import React, { useState } from "react";

import {
  AlertCircle,
  Award,
  Target,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  HelpCircle,
  BookText,
  MessageCircle,
  BarChart3,
} from "lucide-react";

// Sample data for demonstration
const sampleSummary = {
  meta: {
    title: "Travel Talk in Japan",
    topic: "Travel and Tourism",
    level: {
      label: "N4",
      reason:
        "Learner can use past tense and descriptive expressions with fair accuracy, but sentence connectors and topic elaboration are limited. This corresponds to N4 ability, where learners can handle everyday topics with simple grammar.",
    },
    time: 6,
  },
  evaluation: {
    summary:
      "The learner discusses a recent trip to Kyoto, describing temples, food, and personal impressions. Responses are enthusiastic but sometimes lack grammatical accuracy and cohesive flow.",
    responseSkill: {
      overall:
        "The learner actively participates, providing relevant answers and showing interest in the topic.",
      reason:
        "Responses directly addressed the partner’s questions but were often short, with few follow-up questions or elaboration.",
      example:
        "When asked 'どんなところが一番好きでしたか？', the learner responded 'きんかくじです！とてもきれいでした。' — a clear and natural answer, though not expanded upon.",
    },
    conversationFlow: {
      rating: "Moderate",
      reason:
        "Conversation progressed smoothly, but transitions between ideas were abrupt (e.g., jumping from temples to food without connectors).",
      example:
        "The learner said 'てらをたくさんみました。たべものはおいしかったです。' — good content, but could be improved with 'それから'.",
    },
    accuracy: {
      grammarMistakes: 4,
      reason:
        "Common mistakes included incorrect conjunctions and adjective conjugations, which are typical at the N4 level.",
      examples: [
        {
          original: "たべものはおいしいでした。",
          correction: "たべものはおいしかったです。",
          note: "Incorrect adjective conjugation; 'おいしい' should become 'おいしかった' in past tense.",
        },
      ],
    },
    vocabularyRange: {
      rating: "Moderate to Good",
      comment:
        "Uses relevant travel-related words ('てら', 'しょくじ', 'おまもり'), but tends to repeat common adjectives like 'たのしい' and 'おいしい'.",
      reason:
        "Shows awareness of topic-specific vocabulary, but limited variation and nuance.",
    },
    vocabularyAnalysis: {
      commonWords: [
        { word: "たのしい", count: 5 },
        { word: "きれい", count: 3 },
        { word: "すごい", count: 2 },
      ],
      rareWords: [
        { word: "おまもり", count: 1 },
        { word: "しょくじ", count: 1 },
      ],
      wordDiversity: 0.58,
      comment:
        "Frequent use of emotional adjectives like 'たのしい' and 'きれい' shows positivity, but limited diversity in descriptive language.",
    },
  },
  feedback: {
    goodPoints: [
      "Strong enthusiasm when describing personal experiences.",
      "Clear understanding of questions about travel and sightseeing.",
      "Good control of basic past tense forms.",
    ],
    commonMistakes: [
      "Incorrect conjunctions ('から' instead of 'ので').",
      "Frequent omission of natural connectors between sentences.",
    ],
    corrections: [
      {
        advice: "Review 'て' and 'ので' forms to connect ideas naturally.",
        before: "たのしかったですから、またいきたいです。",
        after: "たのしかったので、またいきたいです。",
      },
    ],
    sentenceUpgrades: [
      {
        advice: "Add emotional reaction to sound more natural and expressive.",
        original: {
          kanji: "きんかくじはきれいでした。",
          kana: "きんかくじ は きれい でした",
        },
        upgraded: {
          kanji: "きんかくじはとてもきれいで、びっくりしました！",
          kana: "きんかくじ は とても きれい で、びっくり しました！",
        },
        reason:
          "Adds a personal emotional element, making the response more engaging.",
      },
    ],
    topicDevelopment: {
      rating: "Developing",
      reason:
        "Can answer questions clearly, but doesn’t expand the conversation by adding new related details or questions.",
    },
    improvementPoints: [
      "Practice combining short sentences with connectors like 'それから', 'そして'.",
      "Use more descriptive adjectives and adverbs to add emotion and detail.",
      "Try explaining *why* you liked or disliked something.",
    ],
  },
  growth: {
    milestone: "Able to describe travel experiences with basic accuracy.",
    currentAbility:
      "Can form complete sentences and recall key vocabulary but still sounds mechanical when connecting ideas.",
    nextLevelGoal:
      "Develop natural transitions and express feelings/opinions more vividly.",
    strengthEnhancement: [
      "Listen to native travel vloggers and note how they connect topics.",
      "Shadow phrases that express surprise or emotion ('びっくりしました', 'すごかったです').",
    ],
    reflectionQuestions: [
      "What surprised you the most during your trip?",
      "Can you describe a moment using feelings and senses (sight, sound, smell)?",
    ],
  },
};

// const Skeleton = ({ className }: { className: string }) => (
//   <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
// );

type Mistake = {
  kanji: string;
  kana: string;
};

type SentenceUpgrade = {
  advice: string;
  original: {
    kana: string;
    kanji: string;
  };
  upgraded: {
    kana: string;
    kanji: string;
  };
};

type SummaryType = {
  score: number;
  title: string;
  summary: string;
  mistakes: Mistake[];
  goodPoints: string[];
  corrections: Mistake[];
  responseSkill: string;
  commonMistakes: string[];
  difficultyLevel: string;
  difficultyReason: string;
  sentenceUpgrades: SentenceUpgrade[];
  topicDevelopment: string;
  improvementPoints: string[];
  vocabularySuggestions: string[];
};

export const Summary = ({ summary = sampleSummary }) => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Conversation Info", icon: MessageCircle },
    { id: "evaluation", label: "Evaluation Report", icon: BarChart3 },
    { id: "feedback", label: "Feedback & Corrections", icon: AlertCircle },
    { id: "growth", label: "Growth Path", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <BookText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {summary?.meta?.title || "Learning Summary"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {summary?.meta?.topic || "Conversation"} •{" "}
                  {typeof summary?.meta?.level === "object"
                    ? summary.meta.level.label
                    : summary?.meta?.level || "N5"}{" "}
                  Level
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">
                {summary?.meta?.time || 0} min
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-2 sticky top-6">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Conversation Info Tab */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-gray-600" />
                    Conversation Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Topic</div>
                      <div className="text-lg text-gray-900 font-medium">
                        {summary?.meta?.topic || "General Conversation"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Duration</div>
                      <div className="text-lg text-gray-900 font-medium">
                        {summary?.meta?.time || 0} minutes
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level Assessment */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-gray-600" />
                    Level Assessment
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {typeof summary?.meta?.level === "object"
                        ? summary.meta.level.label
                        : summary?.meta?.level || "N5"}
                    </div>
                    {typeof summary?.meta?.level === "object" &&
                      summary.meta.level.reason && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {summary.meta.level.reason}
                        </p>
                      )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Performance Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        Grammar Mistakes
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {summary?.evaluation?.accuracy?.grammarMistakes || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        Corrections Made
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {summary?.feedback?.corrections?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        Sentence Upgrades
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {summary?.feedback?.sentenceUpgrades?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm text-gray-600">
                        Vocabulary Range
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {summary?.evaluation?.vocabularyRange?.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Evaluation Report Tab */}
            {activeTab === "evaluation" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
                    Evaluation Report
                  </h2>

                  <div className="space-y-6">
                    {/* Overall Summary */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Overall Summary
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                        {summary?.evaluation?.summary ||
                          "No summary available."}
                      </div>
                    </div>

                    {/* Response Skill */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Response Skill
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Overall Assessment
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {summary?.evaluation?.responseSkill?.overall ||
                              "N/A"}
                          </p>
                        </div>
                        {summary?.evaluation?.responseSkill?.reason && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <div className="text-xs text-gray-600 mb-1">
                              Reasoning
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {summary.evaluation.responseSkill.reason}
                            </p>
                          </div>
                        )}
                        {summary?.evaluation?.responseSkill?.example && (
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                            <div className="text-xs text-gray-600 mb-2">
                              Example
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed italic">
                              {summary.evaluation.responseSkill.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Conversation Flow */}
                    {summary?.evaluation?.conversationFlow && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Conversation Flow
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <span className="text-sm text-gray-600">
                              Rating
                            </span>
                            <span className="text-base font-semibold text-gray-900">
                              {summary.evaluation.conversationFlow.rating ||
                                "N/A"}
                            </span>
                          </div>
                          {summary.evaluation.conversationFlow.reason && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                {summary.evaluation.conversationFlow.reason}
                              </p>
                            </div>
                          )}
                          {summary.evaluation.conversationFlow.example && (
                            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                              <div className="text-xs text-gray-600 mb-2">
                                Example
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed italic">
                                {summary.evaluation.conversationFlow.example}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Accuracy */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Accuracy
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                          <span className="text-sm text-gray-600">
                            Grammar Mistakes
                          </span>
                          <span className="text-2xl font-bold text-gray-900">
                            {summary?.evaluation?.accuracy?.grammarMistakes ||
                              0}
                          </span>
                        </div>
                        {summary?.evaluation?.accuracy?.reason && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {summary.evaluation.accuracy.reason}
                            </p>
                          </div>
                        )}
                        {summary?.evaluation?.accuracy?.examples?.length >
                          0 && (
                          <div className="space-y-2">
                            {summary.evaluation.accuracy.examples.map(
                              (ex, index) => (
                                <div
                                  key={index}
                                  className="border border-gray-200 rounded-lg p-4"
                                >
                                  <div className="grid md:grid-cols-2 gap-3 mb-2">
                                    <div>
                                      <div className="text-xs text-gray-500 mb-1">
                                        Original
                                      </div>
                                      <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-gray-900">
                                        {ex.original}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-gray-500 mb-1">
                                        Correction
                                      </div>
                                      <div className="bg-green-50 border border-green-200 rounded p-2 text-sm text-gray-900">
                                        {ex.correction}
                                      </div>
                                    </div>
                                  </div>
                                  {ex.note && (
                                    <div className="text-xs text-gray-600 mt-2 italic">
                                      💡 {ex.note}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vocabulary Range */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Vocabulary Range
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                          <span className="text-sm text-gray-600">Rating</span>
                          <span className="text-base font-semibold text-gray-900">
                            {summary?.evaluation?.vocabularyRange?.rating ||
                              "N/A"}
                          </span>
                        </div>
                        {summary?.evaluation?.vocabularyRange?.comment && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {summary.evaluation.vocabularyRange.comment}
                            </p>
                          </div>
                        )}
                        {summary?.evaluation?.vocabularyRange?.reason && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {summary.evaluation.vocabularyRange.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vocabulary Analysis */}
                    {summary?.evaluation?.vocabularyAnalysis && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Vocabulary Analysis
                        </h3>
                        <div className="space-y-4">
                          {/* Word Diversity */}
                          {summary.evaluation.vocabularyAnalysis
                            .wordDiversity !== undefined && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">
                                  Word Diversity
                                </span>
                                <span className="text-lg font-semibold text-gray-900">
                                  {(
                                    summary.evaluation.vocabularyAnalysis
                                      .wordDiversity * 100
                                  ).toFixed(0)}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${
                                      summary.evaluation.vocabularyAnalysis
                                        .wordDiversity * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Common Words */}
                          {summary.evaluation.vocabularyAnalysis.commonWords
                            ?.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-600 mb-2">
                                Most Used Words
                              </div>
                              <div className="space-y-2">
                                {summary.evaluation.vocabularyAnalysis.commonWords.map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                                    >
                                      <span className="text-sm font-medium text-gray-900">
                                        {item.word}
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                          <div
                                            className="bg-gray-600 h-1.5 rounded-full"
                                            style={{
                                              width: `${Math.min(
                                                (item.count /
                                                  Math.max(
                                                    ...summary.evaluation.vocabularyAnalysis.commonWords.map(
                                                      (w) => w.count
                                                    )
                                                  )) *
                                                  100,
                                                100
                                              )}%`,
                                            }}
                                          ></div>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600 w-6 text-right">
                                          ×{item.count}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Rare Words */}
                          {summary.evaluation.vocabularyAnalysis.rareWords
                            ?.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-600 mb-2">
                                Advanced/Rare Words
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {summary.evaluation.vocabularyAnalysis.rareWords.map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                                    >
                                      <span className="text-sm font-medium text-gray-900">
                                        {item.word}
                                      </span>
                                      <span className="text-xs text-gray-600 ml-2">
                                        ×{item.count}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Comment */}
                          {summary.evaluation.vocabularyAnalysis.comment && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                              <p className="text-sm text-gray-800 leading-relaxed">
                                {summary.evaluation.vocabularyAnalysis.comment}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Feedback & Corrections Tab */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-gray-600" />
                    Feedback & Corrections
                  </h2>

                  <div className="space-y-6">
                    {/* Good Points */}
                    {summary?.feedback?.goodPoints?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Strengths
                        </h3>
                        <div className="space-y-2">
                          {summary.feedback.goodPoints.map((point, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-4 bg-green-50 border border-green-100 rounded-lg"
                            >
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-800">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {summary?.feedback?.commonMistakes?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                          Common Mistakes
                        </h3>
                        <div className="space-y-2">
                          {summary.feedback.commonMistakes.map(
                            (mistake, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-red-50 border border-red-100 rounded-lg"
                              >
                                <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center text-red-700 text-xs font-semibold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-sm text-gray-800">
                                  {mistake}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Corrections */}
                    {summary?.feedback?.corrections?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-gray-600" />
                          Corrections
                        </h3>
                        <div className="space-y-4">
                          {summary.feedback.corrections.map(
                            (correction, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-5"
                              >
                                {correction.advice && (
                                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                                    <p className="text-xs text-gray-700">
                                      💡 {correction.advice}
                                    </p>
                                  </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-4 items-center">
                                  <div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      Before
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-gray-900">
                                      {correction.before}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      After
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-gray-900">
                                      {correction.after}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sentence Upgrades */}
                    {summary?.feedback?.sentenceUpgrades?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <RotateCcw className="w-4 h-4 mr-2 text-gray-600" />
                          Expression Enhancements
                        </h3>
                        <div className="space-y-4">
                          {summary.feedback.sentenceUpgrades.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-5"
                              >
                                {item.advice && (
                                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                                    <p className="text-xs text-gray-700">
                                      💡 {item.advice}
                                    </p>
                                  </div>
                                )}
                                <div className="grid md:grid-cols-3 gap-4 items-center mb-3">
                                  <div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      Current
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <p className="text-sm font-medium text-gray-900 mb-1">
                                        {item.original.kanji}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {item.original.kana}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex justify-center">
                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <div className="text-xs text-gray-500 mb-2">
                                      Enhanced
                                    </div>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                      <p className="text-sm font-medium text-gray-900 mb-1">
                                        {item.upgraded.kanji}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {item.upgraded.kana}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {item.reason && (
                                  <div className="text-xs text-gray-600 italic">
                                    📝 {item.reason}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Topic Development */}
                    {summary?.feedback?.topicDevelopment && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Topic Development
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          {typeof summary.feedback.topicDevelopment ===
                          "object" ? (
                            <>
                              {summary.feedback.topicDevelopment.rating && (
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                  <span className="text-sm text-gray-600">
                                    Rating
                                  </span>
                                  <span className="text-base font-semibold text-gray-900">
                                    {summary.feedback.topicDevelopment.rating}
                                  </span>
                                </div>
                              )}
                              {summary.feedback.topicDevelopment.reason && (
                                <p className="text-sm text-gray-800 leading-relaxed">
                                  {summary.feedback.topicDevelopment.reason}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-gray-800 leading-relaxed">
                              {summary.feedback.topicDevelopment}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Improvement Points */}
                    {summary?.feedback?.improvementPoints?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-gray-600" />
                          Focus Areas
                        </h3>
                        <div className="space-y-2">
                          {summary.feedback.improvementPoints.map(
                            (point, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-100 rounded-lg"
                              >
                                <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 text-xs font-semibold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <p className="text-sm text-gray-800">{point}</p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Growth Path Tab */}
            {activeTab === "growth" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
                    Growth Path
                  </h2>

                  <div className="space-y-6">
                    {/* Current Status */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Current Milestone
                        </h3>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                          {summary?.growth?.milestone || "N/A"}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Current Ability
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                          {summary?.growth?.currentAbility || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Next Level Goal */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Next Level Goal
                      </h3>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                        {summary?.growth?.nextLevelGoal || "N/A"}
                      </div>
                    </div>

                    {/* Strength Enhancement */}
                    {summary?.growth?.strengthEnhancement?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-gray-600" />
                          Strength Enhancement
                        </h3>
                        <div className="space-y-2">
                          {summary.growth.strengthEnhancement.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-semibold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-sm text-gray-800">
                                  {item}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reflection Questions */}
                    {summary?.growth?.reflectionQuestions?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <HelpCircle className="w-4 h-4 mr-2 text-gray-600" />
                          Reflection Questions
                        </h3>
                        <div className="space-y-3">
                          {summary.growth.reflectionQuestions.map(
                            (question, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-purple-50 border border-purple-100 rounded-lg"
                              >
                                <HelpCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-800">
                                  {question}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
