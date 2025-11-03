import React from "react";
import { BarChart3, BookOpen } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionTitle, SectionSubTitle } from "./SectionTitle";

export const AnalysisContainer = ({ analysis }: { analysis: any }) => {
  return (
    <div className="space-y-6">
      <SectionContainer containerName="Performance Metrics" icon={BarChart3}>
        <div className="space-y-6">
          <SectionTitle title="Overall Assessment" />
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-800 leading-relaxed">
              {analysis.overview}
            </p>
          </div>

          <div>
            <SectionTitle title="Skills Assessment" />
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <SectionSubTitle title="Flow" />
                <SectionDescription>{analysis.skills.flow}</SectionDescription>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <SectionSubTitle title="Comprehension" />
                <SectionDescription>
                  {analysis.skills.comprehension}
                </SectionDescription>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <SectionSubTitle title="Development" />
                <SectionDescription>
                  {analysis.skills.development}
                </SectionDescription>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                <SectionSubTitle title="Example" />
                <SectionDescription>
                  {analysis.skills.example}
                </SectionDescription>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

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
              <div className="text-xs font-medium text-gray-600 mb-2">
                Adjectives (形容詞)
              </div>
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
        </div>
      </SectionContainer>
    </div>
  );
};

export default AnalysisContainer;
