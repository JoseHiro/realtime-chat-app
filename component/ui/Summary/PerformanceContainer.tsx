import React, { useMemo } from "react";
import {
  BarChart3,
  CheckCircle,
  TrendingUp,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionTitle } from "./SectionTitle";
import { Analysis, Feedback, ConversationReview } from "../../../type/types";
import { ImprovementTypeBadge } from "./ImprovementTypeBadge";
import { GrammarErrorBadge } from "./GrammarErrorBadge";
import { getImprovementTypesWithCounts } from "../../../lib/improvements/getImprovementTypes";
import {
  getGrammarErrorTypesWithCounts,
  hasGrammarErrors,
} from "../../../lib/grammar/getGrammarErrors";

export const PerformanceContainer = React.memo(
  ({
    analysis,
    feedback,
    conversation,
  }: {
    analysis: Analysis;
    feedback: Feedback;
    conversation?: ConversationReview | null;
  }) => {
    // Limit to top 4 most important items
    const topStrengths = useMemo(
      () => (feedback.strengths || []).slice(0, 4),
      [feedback.strengths]
    );

    // Extract improvement types with counts from conversation data
    // These replace the old feedback.improvements array
    const improvementTypesWithCounts = useMemo(() => {
      if (!conversation) return [];
      return getImprovementTypesWithCounts(conversation).slice(0, 4); // Limit to 4
    }, [conversation]);

    // Extract grammar error types with counts from conversation data
    const grammarErrorTypesWithCounts = useMemo(() => {
      if (!conversation) return [];
      return getGrammarErrorTypesWithCounts(conversation).slice(0, 4); // Limit to 4
    }, [conversation]);

    // Check if there are any grammar errors
    const hasErrors = useMemo(() => {
      if (!conversation) return false;
      return hasGrammarErrors(conversation);
    }, [conversation]);

    // Check if there are user messages (to show the section even if no errors)
    const hasUserMessages = useMemo(() => {
      if (!conversation?.messages) return false;
      return conversation.messages.some((msg) => msg.sender === "user");
    }, [conversation]);

    return (
      <div className="space-y-6">
        {/* Overview */}
        {analysis.overview && (
          <SectionContainer containerName="Overview" icon={BarChart3}>
            <div className="bg-gray-50 rounded-lg p-4">
              <SectionDescription>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {analysis.overview}
                </p>
              </SectionDescription>
            </div>
          </SectionContainer>
        )}

        {/* Strengths */}
        {topStrengths.length > 0 && (
          <SectionContainer containerName="Strengths" icon={CheckCircle}>
            <div className="space-y-3">
              {topStrengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-green-50 rounded-lg p-3 border border-green-100"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <SectionDescription>
                    <p className="text-sm text-gray-800">{strength}</p>
                  </SectionDescription>
                </div>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Key Improvements - Notion-like design with improvement types */}
        {improvementTypesWithCounts.length > 0 && (
          <SectionContainer containerName="Key Improvements" icon={TrendingUp}>
            <div className="flex flex-wrap gap-2">
              {improvementTypesWithCounts.map(({ type }, index) => (
                <div
                  key={index}
                  className="group inline-flex items-center gap-2 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-default"
                >
                  <ImprovementTypeBadge type={type} />
                </div>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Grammar Errors - Show errors or positive message if no errors */}
        {hasUserMessages && (
          <SectionContainer
            containerName="Grammar Errors"
            icon={hasErrors ? AlertCircle : CheckCircle}
          >
            {hasErrors && grammarErrorTypesWithCounts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {grammarErrorTypesWithCounts.map(({ type, count }, index) => (
                  <div
                    key={index}
                    className="group inline-flex items-center gap-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-default"
                  >
                    <GrammarErrorBadge type={type} />
                    {count > 1 && (
                      <span className="text-xs text-gray-500 font-medium">
                        {count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-green-50 rounded-lg p-4 border border-green-100">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <SectionDescription>
                  <p className="text-sm text-gray-800 font-medium">
                    Great job! No major grammar errors detected in your
                    conversation.
                  </p>
                </SectionDescription>
              </div>
            )}
          </SectionContainer>
        )}

        {/* Vocabulary Analysis */}
        <SectionContainer containerName="Vocabulary Analysis" icon={BookOpen}>
          <div className="space-y-4">
            {analysis.vocabulary.verbs.length > 0 && (
              <div>
                <SectionTitle title="Verbs (動詞)" />
                <div className="space-y-2">
                  {analysis.vocabulary.verbs.map((item: any, index: number) => (
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
                  ))}
                </div>
              </div>
            )}

            {analysis.vocabulary.adjectives.length > 0 && (
              <div>
                <SectionTitle title="Adjectives (形容詞)" />
                <div className="space-y-2">
                  {analysis.vocabulary.adjectives.map(
                    (item: any, index: number) => (
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

            {analysis.vocabulary.adverbs &&
              analysis.vocabulary.adverbs.length > 0 && (
                <div>
                  <SectionTitle title="Adverbs (副詞)" />
                  <div className="space-y-2">
                    {analysis.vocabulary.adverbs.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3"
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

            {analysis.vocabulary.conjunctions &&
              analysis.vocabulary.conjunctions.length > 0 && (
                <div>
                  <SectionTitle title="Conjunctions (接続詞)" />
                  <div className="space-y-2">
                    {analysis.vocabulary.conjunctions.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-3"
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
        </SectionContainer>
      </div>
    );
  }
);

PerformanceContainer.displayName = "PerformanceContainer";

export default PerformanceContainer;
