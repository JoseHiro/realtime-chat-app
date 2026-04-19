import React, { useMemo } from "react";
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
    milestone,
  }: {
    meta: any;
    analysis?: any;
    feedback?: any;
    conversation?: any;
    milestone?: any;
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

    const hasImprovements =
      improvementTypesWithCounts.length > 0 || hasErrors;

    const hasVocabulary =
      analysis?.vocabulary &&
      (analysis.vocabulary.verbs?.length > 0 ||
        analysis.vocabulary.adjectives?.length > 0 ||
        analysis.vocabulary.adverbs?.length > 0 ||
        analysis.vocabulary.conjunctions?.length > 0);

    return (
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {/* Overview */}
        {analysis?.overview && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Overview
            </p>
            <p className="text-sm text-gray-800 leading-relaxed">
              {analysis.overview}
            </p>
          </div>
        )}

        {/* Strengths */}
        {topStrengths.length > 0 && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Strengths
            </p>
            <ul className="space-y-2">
              {topStrengths.map((strength: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-800">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {hasImprovements && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Improvements
            </p>
            <div className="flex flex-wrap gap-2">
              {improvementTypesWithCounts.map(
                ({ type }: { type: string }, i: number) => (
                  <ImprovementTypeBadge key={i} type={type as any} />
                )
              )}
              {hasErrors &&
                grammarErrorTypesWithCounts.map(
                  (
                    { type, count }: { type: string; count: number },
                    i: number
                  ) => (
                    <div key={i} className="inline-flex items-center gap-1">
                      <GrammarErrorBadge type={type as any} />
                      {count > 1 && (
                        <span className="text-xs text-gray-500 font-medium">
                          {count}
                        </span>
                      )}
                    </div>
                  )
                )}
            </div>
          </div>
        )}

        {/* Next Goal */}
        {milestone?.next?.goal && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Next Goal
            </p>
            <div className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <p className="text-sm text-gray-800 leading-relaxed">
                {milestone.next.goal}
              </p>
            </div>
          </div>
        )}

        {/* Vocabulary */}
        {hasVocabulary && (
          <div className="px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Vocabulary
            </p>
            <div className="space-y-4">
              {analysis.vocabulary.verbs?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Verbs</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.verbs.map((item: any, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 border border-blue-100 rounded px-2 py-1 text-gray-800"
                      >
                        {item.word}
                        <span className="text-gray-400 ml-1">{item.reading}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.vocabulary.adjectives?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Adjectives</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.adjectives.map(
                      (item: any, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-purple-50 border border-purple-100 rounded px-2 py-1 text-gray-800"
                        >
                          {item.word}
                          <span className="text-gray-400 ml-1">{item.reading}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
              {analysis.vocabulary.adverbs?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Adverbs</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.adverbs.map((item: any, i: number) => (
                      <span
                        key={i}
                        className="text-xs bg-orange-50 border border-orange-100 rounded px-2 py-1 text-gray-800"
                      >
                        {item.word}
                        <span className="text-gray-400 ml-1">{item.reading}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.vocabulary.conjunctions?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Conjunctions</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.vocabulary.conjunctions.map(
                      (item: any, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-green-50 border border-green-100 rounded px-2 py-1 text-gray-800"
                        >
                          {item.word}
                          <span className="text-gray-400 ml-1">{item.reading}</span>
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

InfoContainer.displayName = "InfoContainer";

export default InfoContainer;
