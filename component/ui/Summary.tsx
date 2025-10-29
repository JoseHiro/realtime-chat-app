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
  BookText,
  MessageCircle,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { SummaryType } from "../../type/types";

// Sample data for demonstration
// const sampleSummary = {
//   meta: {
//     title: "Travel Talk in Japan",
//     level: {
//       label: "N4",
//       reason:
//         "Learner can use past tense and descriptive expressions with fair accuracy, but sentence connectors and topic elaboration are limited. This corresponds to N4 ability, where learners can handle everyday topics with simple grammar.",
//     },
//     conversationLength: {
//       totalWords: 1,
//       uniqueWords: 2,
//     },
//   },
//   evaluation: {
//     summary:
//       "The learner discusses a recent trip to Kyoto, describing temples, food, and personal impressions. Responses are enthusiastic but sometimes lack grammatical accuracy and cohesive flow.",
//     responseSkill: {
//       overall:
//         "The learner actively participates, providing relevant answers and showing interest in the topic.",
//       reason:
//         "Responses directly addressed the partner’s questions but were often short, with few follow-up questions or elaboration.",
//       example:
//         "When asked 'どんなところが一番好きでしたか？', the learner responded 'きんかくじです！とてもきれいでした。' — a clear and natural answer, though not expanded upon.",
//     },
//     conversationFlow: {
//       rating: "Moderate",
//       reason:
//         "Conversation progressed smoothly, but transitions between ideas were abrupt (e.g., jumping from temples to food without connectors).",
//       example:
//         "The learner said 'てらをたくさんみました。たべものはおいしかったです。' — good content, but could be improved with 'それから'.",
//     },
//     accuracy: {
//       grammarMistakes: 4,
//       reason:
//         "Common mistakes included incorrect conjunctions and adjective conjugations, which are typical at the N4 level.",
//       examples: [
//         {
//           original: "たべものはおいしいでした。",
//           correction: "たべものはおいしかったです。",
//           note: "Incorrect adjective conjugation; 'おいしい' should become 'おいしかった' in past tense.",
//         },
//       ],
//     },
//     vocabularyRange: {
//       rating: "Moderate to Good",
//       comment:
//         "Uses relevant travel-related words ('てら', 'しょくじ', 'おまもり'), but tends to repeat common adjectives like 'たのしい' and 'おいしい'.",
//       reason:
//         "Shows awareness of topic-specific vocabulary, but limited variation and nuance.",
//     },
//     vocabularyAnalysis: {
//       commonWords: [
//         { word: "たのしい", count: 5 },
//         { word: "きれい", count: 3 },
//         { word: "すごい", count: 2 },
//       ],
//       rareWords: [
//         { word: "おまもり", count: 1 },
//         { word: "しょくじ", count: 1 },
//       ],
//       words: [{}], // 代わりに使える自然な単語
//       comment:
//         "Frequent use of emotional adjectives like 'たのしい' and 'きれい' shows positivity, but limited diversity in descriptive language.",
//     },
//   },
//   feedback: {
//     goodPoints: [
//       "Strong enthusiasm when describing personal experiences.",
//       "Clear understanding of questions about travel and sightseeing.",
//       "Good control of basic past tense forms.",
//     ],
//     commonMistakes: [
//       "Incorrect conjunctions ('から' instead of 'ので').",
//       "Frequent omission of natural connectors between sentences.",
//     ],
//     corrections: [
//       {
//         advice: "Review 'て' and 'ので' forms to connect ideas naturally.",
//         before: "たのしかったですから、またいきたいです。",
//         after: "たのしかったので、またいきたいです。",
//       },
//     ],
//     sentenceUpgrades: [
//       {
//         advice: "Add emotional reaction to sound more natural and expressive.",
//         original: {
//           kanji: "きんかくじはきれいでした。",
//           kana: "きんかくじ は きれい でした",
//         },
//         upgraded: {
//           kanji: "きんかくじはとてもきれいで、びっくりしました！",
//           kana: "きんかくじ は とても きれい で、びっくり しました！",
//         },
//         reason:
//           "Adds a personal emotional element, making the response more engaging.",
//       },
//     ],
//     topicDevelopment: {
//       rating: "Developing",
//       reason:
//         "Can answer questions clearly, but doesn’t expand the conversation by adding new related details or questions.",
//     },
//     improvementPoints: [
//       "Practice combining short sentences with connectors like 'それから', 'そして'.",
//       "Use more descriptive adjectives and adverbs to add emotion and detail.",
//       "Try explaining *why* you liked or disliked something.",
//     ],
//   },
//   growth: {
//     milestone: "Able to describe travel experiences with basic accuracy.",
//     currentAbility:
//       "Can form complete sentences and recall key vocabulary but still sounds mechanical when connecting ideas.",
//     nextLevelGoal:
//       "Develop natural transitions and express feelings/opinions more vividly.",
//     strengthEnhancement: [
//       "Listen to native travel vloggers and note how they connect topics.",
//       "Shadow phrases that express surprise or emotion ('びっくりしました', 'すごかったです').",
//     ],
//     reflectionQuestions: [
//       "What surprised you the most during your trip?",
//       "Can you describe a moment using feelings and senses (sight, sound, smell)?",
//     ],
//   },
// };

export const Summary = ({ summary }: { summary: SummaryType }) => {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Conversation Info", icon: MessageCircle },
    { id: "analysis", label: "Analysis", icon: Target },
    { id: "feedback", label: "Feedback & Corrections", icon: AlertCircle },
    { id: "milestone", label: "Growth Path", icon: TrendingUp },
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
                  {summary?.meta?.selectedTopic || "Conversation"} •{" "}
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
                {summary?.meta?.chatDuration || 0} min
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

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Topic</div>
                      <div className="text-lg text-gray-900 font-medium">
                        {summary?.meta?.selectedTopic || "General Conversation"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Duration</div>
                      <div className="text-lg text-gray-900 font-medium">
                        {summary?.meta?.chatDuration || 0} minutes
                      </div>
                    </div>
                  </div>

                  {/* Overall Summary */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Overall Summary
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                      {summary?.meta?.summary || "No summary available."}
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
                        {summary?.feedback?.enhancements?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Tab - Response Skill, Conversation Flow, Accuracy, Vocabulary */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
                    Performance Analysis
                  </h2>

                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Overall Assessment
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {summary.analysis.overview}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Skills Assessment
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">Flow</div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {summary.analysis.skills.flow}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Comprehension
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {summary.analysis.skills.comprehension}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-xs text-gray-500 mb-1">
                            Development
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {summary.analysis.skills.development}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                          <div className="text-xs text-gray-600 mb-2">
                            Example
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed italic">
                            {summary.analysis.skills.example}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-gray-600" />
                    Vocabulary Analysis
                  </h2>

                  <div className="space-y-4">
                    {summary.analysis.vocabulary.verbs.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Verbs (動詞)
                        </div>
                        <div className="space-y-2">
                          {summary?.analysis.vocabulary.verbs.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-base font-medium text-gray-900">
                                    {item.word}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {item.reading}
                                  </span>
                                  <span className="text-xs text-gray-500 font-mono">
                                    {item.romaji}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  ×{item.count}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {summary.analysis.vocabulary.adjectives.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          Adjectives (形容詞)
                        </div>
                        <div className="space-y-2">
                          {summary.analysis.vocabulary.adjectives.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="text-base font-medium text-gray-900">
                                    {item.word}
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {item.reading}
                                  </span>
                                  <span className="text-xs text-gray-500 font-mono">
                                    {item.romaji}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                  ×{item.count}
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

            {/* Feedback & Improvements Tab */}
            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-gray-600" />
                    Feedback & Improvements
                  </h2>

                  <div className="space-y-6">
                    {summary.feedback.strengths.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Strengths
                        </h3>
                        <div className="space-y-2">
                          {summary.feedback.strengths.map((point, index) => (
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

                    {summary.feedback.commonMistakes.length > 0 && (
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

                    {summary.feedback.improvements.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-gray-600" />
                          Focus Areas
                        </h3>
                        <div className="space-y-2">
                          {summary.feedback.improvements.map((point, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-100 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 text-xs font-semibold flex-shrink-0">
                                {index + 1}
                              </div>
                              <p className="text-sm text-gray-800">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {summary.feedback.corrections.length > 0 && (
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

                    {summary.feedback.enhancements.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <RotateCcw className="w-4 h-4 mr-2 text-gray-600" />
                          Expression Enhancements
                        </h3>
                        <div className="space-y-4">
                          {summary.feedback.enhancements.map((item, index) => (
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
                              <div className="grid md:grid-cols-3 gap-4 items-center">
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
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Growth Path Tab */}
            {activeTab === "milestone" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
                    Growth Path
                  </h2>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Current Milestone
                        </h3>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                          {summary.milestone.current.milestone}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Current Ability
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                          {summary.milestone.current.ability}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Next Level Goal
                      </h3>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
                        {summary.milestone.next.goal}
                      </div>
                    </div>

                    {summary.milestone.next.steps.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-gray-600" />
                          Action Steps
                        </h3>
                        <div className="space-y-2">
                          {summary.milestone.next.steps.map((item, index) => (
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
                          ))}
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
