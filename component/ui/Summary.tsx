import React, { useState, useMemo, useCallback } from "react";
import { SummaryType, ConversationReview } from "../../type/types";
import { SummaryNavigation } from "./Summary/SummaryNavigation";
import { SectionHeader } from "./Summary/SectionHeader";
import { InfoContainer } from "./Summary/InfoContainer";
import { AnalysisContainer } from "./Summary/AnalysisContainer";
import { FeedbackContainer } from "./Summary/FeedbackContainer";
import { ConversationReviewContainer } from "./Summary/ConversationReviewContainer";
import { MilestoneContainer } from "./Summary/MilestoneContainer";
import mockConversationData from "../../data/mockConversationFeedbackData.json";

export const Summary = ({ summary }: { summary: SummaryType }) => {
  const [activeTab, setActiveTab] = useState("info");

  // Memoize computed values to prevent unnecessary recalculations
  const correctionsLength = useMemo(
    () => summary?.feedback?.corrections?.length || 0,
    [summary?.feedback?.corrections]
  );

  const enhancementsLength = useMemo(
    () => summary?.feedback?.enhancements?.length || 0,
    [summary?.feedback?.enhancements]
  );

  // Memoize the setActiveTab callback to prevent unnecessary re-renders
  const handleSetActiveTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Use mock data as fallback when conversation data is not available from API
  const conversationData: ConversationReview | null = useMemo(() => {
    if (summary.conversation && summary.conversation.messages?.length > 0) {
      return summary.conversation;
    }
    // Fallback to mock data for testing
    return {
      messages: mockConversationData.messages as ConversationReview["messages"],
      metadata: mockConversationData.metadata,
    };
  }, [summary.conversation]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SectionHeader meta={summary?.meta} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar Navigation */}
          <SummaryNavigation
            setActiveTab={handleSetActiveTab}
            activeTab={activeTab}
          />
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Conversation Info Tab */}
            {activeTab === "info" && (
              <InfoContainer
                meta={summary.meta}
                correctionsLength={correctionsLength}
                enhancementsLength={enhancementsLength}
              />
            )}

            {/* Analysis Tab - Response Skill, Conversation Flow, Accuracy, Vocabulary */}
            {activeTab === "analysis" && (
              <AnalysisContainer analysis={summary.analysis} />
            )}

            {/* Feedback & Improvements Tab */}
            {activeTab === "feedback" && (
              <FeedbackContainer feedback={summary.feedback} />
            )}

            {/* Refined Responses Tab */}
            {activeTab === "conversation" &&
              (conversationData && conversationData.messages?.length > 0 ? (
                <ConversationReviewContainer conversation={conversationData} />
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-600 mb-2">
                    No conversation review data available.
                  </p>
                  <p className="text-sm text-gray-500">
                    Conversation review data will appear here once available.
                  </p>
                </div>
              ))}

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
