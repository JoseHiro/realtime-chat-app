import React, { useState, useMemo, useCallback } from "react";
import { SummaryType, ConversationReview } from "../../types/types";
import { SummaryNavigation } from "./Summary/SummaryNavigation";
import { SectionHeader } from "./Summary/SectionHeader";
import { InfoContainer } from "./Summary/InfoContainer";
import { ConversationReviewContainer } from "./Summary/ConversationReviewContainer";
import mockConversationData from "../../data/mockConversationFeedbackData.json";

export const Summary = ({
  summary,
  characterName,
}: {
  summary: SummaryType | null | undefined;
  characterName?: string;
}) => {
  const [activeTab, setActiveTab] = useState("info");

  const handleSetActiveTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

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

  const conversationData: ConversationReview | null = useMemo(() => {
    if (summary?.conversation && summary.conversation.messages?.length > 0) {
      return summary.conversation;
    }
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

      {/* Tab Nav */}
      <div className="border-b border-gray-200 bg-white px-6">
        <SummaryNavigation
          setActiveTab={handleSetActiveTab}
          activeTab={activeTab}
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {activeTab === "info" && (
          <InfoContainer
            meta={summary?.meta}
            analysis={summary?.analysis}
            feedback={summary?.feedback}
            conversation={conversationData}
            milestone={summary?.milestone}
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
      </div>
    </div>
  );
};
