import React, { useState, useMemo, useCallback } from "react";
import { SummaryType, ConversationReview } from "../../type/types";
import { SummaryNavigation } from "./Summary/SummaryNavigation";
import { SectionHeader } from "./Summary/SectionHeader";
import { InfoContainer } from "./Summary/InfoContainer";
import { PerformanceContainer } from "./Summary/PerformanceContainer";
import { ConversationReviewContainer } from "./Summary/ConversationReviewContainer";
import { MilestoneContainer } from "./Summary/MilestoneContainer";
import mockConversationData from "../../data/mockConversationFeedbackData.json";

export const Summary = ({
  summary,
  characterName,
}: {
  summary: SummaryType | null | undefined;
  characterName?: string;
}) => {
  const [activeTab, setActiveTab] = useState("info");

  // Memoize the setActiveTab callback to prevent unnecessary re-renders
  const handleSetActiveTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);
  console.log(summary);

  // Handle case when summary is not available
  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-600 mb-2">No summary data available.</p>
          <p className="text-sm text-gray-500">
            Summary will appear here once generated.
          </p>
        </div>
      </div>
    );
  }

  // Use mock data as fallback when conversation data is not available from API
  const conversationData: ConversationReview | null = useMemo(() => {
    if (summary?.conversation && summary.conversation.messages?.length > 0) {
      return summary.conversation;
    }
    // Fallback to mock data for testing
    const fallback: ConversationReview = {
      messages: (mockConversationData as any)
        .messages as ConversationReview["messages"],
    };
    if ((mockConversationData as any).metadata) {
      fallback.metadata = (mockConversationData as any)
        .metadata as ConversationReview["metadata"];
    }
    return fallback;
  }, [summary?.conversation]);

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
            {activeTab === "info" && <InfoContainer meta={summary?.meta} />}

            {/* Performance Tab - Overview, Strengths, Improvements, Vocabulary */}
            {activeTab === "performance" && (
              <PerformanceContainer
                analysis={summary?.analysis}
                feedback={summary?.feedback}
                conversation={conversationData}
              />
            )}
            {activeTab === "conversation" &&
              (conversationData && conversationData.messages?.length > 0 ? (
                <ConversationReviewContainer
                  conversation={conversationData}
                  characterName={characterName || undefined}
                />
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
              <MilestoneContainer milestone={summary?.milestone} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
