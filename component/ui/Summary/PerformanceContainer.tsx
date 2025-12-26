import React, { useMemo } from "react";
import { BarChart3, CheckCircle, TrendingUp, BookOpen } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionTitle, SectionSubTitle } from "./SectionTitle";
import { Analysis, Feedback } from "../../../type/types";

export const PerformanceContainer = React.memo(
  ({ analysis, feedback }: { analysis: Analysis; feedback: Feedback }) => {
    // Limit to top 4 most important items
    const topStrengths = useMemo(
      () => (feedback.strengths || []).slice(0, 4),
      [feedback.strengths]
    );

    const topImprovements = useMemo(
      () => (feedback.improvements || []).slice(0, 4),
      [feedback.improvements]
    );

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

        {/* Key Improvements */}
        {topImprovements.length > 0 && (
          <SectionContainer
            containerName="Key Improvements"
            icon={TrendingUp}
          >
            <div className="space-y-3">
              {topImprovements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-blue-50 rounded-lg p-3 border border-blue-100"
                >
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <SectionDescription>
                    <p className="text-sm text-gray-800">{improvement}</p>
                  </SectionDescription>
                </div>
              ))}
            </div>
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
