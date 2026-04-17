import React, { useMemo } from "react";
import { BarChart3, CheckCircle, TrendingUp, BookOpen } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { ImprovementTypeBadge } from "./ImprovementTypeBadge";
import { GrammarErrorBadge } from "./GrammarErrorBadge";
import { getImprovementTypesWithCounts } from "../../../lib/improvements/getImprovementTypes";
import {
  getGrammarErrorTypesWithCounts,
  hasGrammarErrors,
} from "../../../lib/grammar/getGrammarErrors";

export const InfoContainer = React.memo(
  ({
    meta,
    analysis,
    feedback,
    conversation,
  }: {
    meta: any;
    analysis?: any;
    feedback?: any;
    conversation?: any;
  }) => {
    const topStrengths = useMemo(
      () => (feedback?.strengths || []).slice(0, 2),
      [feedback?.strengths]
    );

    const improvementTypesWithCounts = useMemo(() => {
      if (!conversation) return [];
      return getImprovementTypesWithCounts(conversation).slice(0, 4);
    }, [conversation]);

    const grammarErrorTypesWithCounts = useMemo(() => {
      if (!conversation) return [];
      return getGrammarErrorTypesWithCounts(conversation).slice(0, 4);
    }, [conversation]);

    const hasErrors = useMemo(() => {
      if (!conversation) return false;
      return hasGrammarErrors(conversation);
    }, [conversation]);

    return (
      <div className="space-y-6">
        {/* Overview */}
        {analysis?.overview && (
          <SectionContainer containerName="Overview" icon={BarChart3}>
            <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 rounded-lg p-4">
              {analysis.overview}
            </p>
          </SectionContainer>
        )}

        {/* Strengths */}
        {topStrengths.length > 0 && (
          <SectionContainer containerName="Strengths" icon={CheckCircle}>
            <div className="space-y-2">
              {topStrengths.map((strength: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 bg-green-50 rounded-lg p-3 border border-green-100"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-800">{strength}</p>
                </div>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Improvements & Grammar Errors */}
        {(improvementTypesWithCounts.length > 0 || hasErrors) && (
          <SectionContainer containerName="Improvements" icon={TrendingUp}>
            <div className="space-y-3">
              {improvementTypesWithCounts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {improvementTypesWithCounts.map(({ type }: { type: string }, index: number) => (
                    <ImprovementTypeBadge key={index} type={type} />
                  ))}
                </div>
              )}
              {hasErrors && grammarErrorTypesWithCounts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {grammarErrorTypesWithCounts.map(({ type, count }: { type: string; count: number }, index: number) => (
                    <div key={index} className="inline-flex items-center gap-1">
                      <GrammarErrorBadge type={type} />
                      {count > 1 && (
                        <span className="text-xs text-gray-500 font-medium">{count}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionContainer>
        )}

        {/* Vocabulary Analysis */}
        {analysis?.vocabulary && (
          <SectionContainer containerName="Vocabulary" icon={BookOpen}>
            <div className="space-y-3">
              {analysis.vocabulary.verbs?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Verbs</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.verbs.map((item: any, i: number) => (
                      <span key={i} className="text-xs bg-blue-50 border border-blue-200 rounded px-2 py-1 text-gray-800">
                        {item.word} <span className="text-gray-400">{item.reading}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.vocabulary.adjectives?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Adjectives</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.adjectives.map((item: any, i: number) => (
                      <span key={i} className="text-xs bg-purple-50 border border-purple-200 rounded px-2 py-1 text-gray-800">
                        {item.word} <span className="text-gray-400">{item.reading}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.vocabulary.adverbs?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Adverbs</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.adverbs.map((item: any, i: number) => (
                      <span key={i} className="text-xs bg-orange-50 border border-orange-200 rounded px-2 py-1 text-gray-800">
                        {item.word} <span className="text-gray-400">{item.reading}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.vocabulary.conjunctions?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Conjunctions</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.conjunctions.map((item: any, i: number) => (
                      <span key={i} className="text-xs bg-green-50 border border-green-200 rounded px-2 py-1 text-gray-800">
                        {item.word} <span className="text-gray-400">{item.reading}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionContainer>
        )}
      </div>
    );
  }
);

InfoContainer.displayName = "InfoContainer";

export default InfoContainer;
