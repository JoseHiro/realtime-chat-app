import React, { useState } from "react";
import { BarChart3, BookOpen } from "lucide-react";
import { SummaryType } from "../../type/types";
import { SummaryNavigation } from "./Summary/SummaryNavigation";
import { SectionTitle, SectionSubTitle } from "./Summary/SectionTitle";
import { SectionContainer, SectionDescription } from "./Summary/Container";
import { SectionHeader } from "./Summary/SectionHeader";
import { InfoContainer } from "./Summary/InfoContainer";
import { AnalysisContainer } from "./Summary/AnalysisContainer";
import { MilestoneContainer } from "./Summary/MilestoneContainer";

export const Summary = ({ summary }: { summary: SummaryType }) => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SectionHeader meta={summary?.meta} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar Navigation */}
          <SummaryNavigation
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Conversation Info Tab */}
            {activeTab === "info" && (
              <InfoContainer
                meta={summary.meta}
                correctionsLength={summary?.feedback?.corrections?.length || 0}
                enhancementsLength={
                  summary?.feedback?.enhancements?.length || 0
                }
              />
            )}

            {/* Analysis Tab - Response Skill, Conversation Flow, Accuracy, Vocabulary */}
            {activeTab === "analysis" && (
              <div className="space-y-6">
                <SectionContainer
                  containerName="Performance Metrics"
                  icon={BarChart3}
                >
                  <div className="space-y-6">
                    <SectionTitle title="Overall Assessment" />
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {summary.analysis.overview}
                      </p>
                    </div>

                    <div>
                      <SectionTitle title="Skills Assessment" />
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <SectionSubTitle title="Flow" />
                          <SectionDescription>
                            {summary.analysis.skills.flow}
                          </SectionDescription>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <SectionSubTitle title="Comprehension" />
                          <SectionDescription>
                            {summary.analysis.skills.comprehension}
                          </SectionDescription>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <SectionSubTitle title="Development" />
                          <SectionDescription>
                            {summary.analysis.skills.development}
                          </SectionDescription>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                          <SectionSubTitle title="Example" />
                          <SectionDescription>
                            {summary.analysis.skills.example}
                          </SectionDescription>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionContainer>

                <SectionContainer
                  containerName="Vocabulary Analysis"
                  icon={BookOpen}
                >
                  <div className="space-y-4">
                    {summary.analysis.vocabulary.verbs.length > 0 && (
                      <div>
                        <SectionTitle title="Verbs (動詞)" />
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
                </SectionContainer>
              </div>
            )}

            {/* Feedback & Improvements Tab */}
            {activeTab === "feedback" && (
              <AnalysisContainer analysis={summary.analysis} />
            )}

            {/* Growth Path Tab */}
            {activeTab === "milestone" && (
              <MilestoneContainer milestone={summary.milestone} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
