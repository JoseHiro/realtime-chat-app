import React, { useState } from "react";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
  Bot,
} from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionSubTitle } from "./SectionTitle";
import {
  ConversationReview,
  ConversationMessage,
  MessageImprovement,
} from "../../../type/types";

export const ConversationReviewContainer = React.memo(
  ({ conversation }: { conversation: ConversationReview }) => {
    const [expandedMessages, setExpandedMessages] = useState<Set<number>>(
      new Set()
    );

    // Handle empty or missing messages
    if (!conversation?.messages || conversation.messages.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-2">No conversation messages found.</p>
          <p className="text-sm text-gray-500">
            Conversation review data will appear here once available.
          </p>
        </div>
      );
    }

    const toggleMessage = (messageId: number) => {
      const newExpanded = new Set(expandedMessages);
      if (newExpanded.has(messageId)) {
        newExpanded.delete(messageId);
      } else {
        newExpanded.add(messageId);
      }
      setExpandedMessages(newExpanded);
    };

    const isMessageExpanded = (messageId: number) =>
      expandedMessages.has(messageId);

    return (
      <div className="space-y-6">
        <SectionContainer
          containerName="Conversation Review"
          icon={MessageSquare}
        >
          <div className="space-y-6">
            {conversation.messages?.map((message: ConversationMessage) => (
              <div key={message.id} className="space-y-3">
                {/* Message */}
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === "user" ? "bg-gray-200" : "bg-gray-100"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {message.sender === "user" ? "You" : "Assistant"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <SectionDescription>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {message.message}
                        </p>
                        {message.reading && (
                          <p className="text-xs text-gray-600">
                            {message.reading}
                          </p>
                        )}
                        {message.english && (
                          <p className="text-xs text-gray-500 italic">
                            {message.english}
                          </p>
                        )}
                      </div>
                    </SectionDescription>
                  </div>
                </div>

                {/* User Message Improvements */}
                {message.sender === "user" &&
                  message.improvements &&
                  message.improvements.length > 0 && (
                    <div className="ml-11">
                      <button
                        onClick={() => toggleMessage(message.id)}
                        className="flex items-center space-x-2 text-xs font-medium text-gray-700 hover:text-gray-900 mb-3 transition-colors"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>
                          {message.improvements.length} Improved
                          {message.improvements.length > 1
                            ? " Options"
                            : " Option"}
                        </span>
                        {isMessageExpanded(message.id) ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {isMessageExpanded(message.id) && (
                        <div className="space-y-3">
                          {message.improvements.map(
                            (
                              improvement: MessageImprovement,
                              impIndex: number
                            ) => (
                              <div
                                key={impIndex}
                                className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300"
                              >
                                <div className="space-y-3">
                                  {/* Improved Sentence */}
                                  <div>
                                    <SectionSubTitle
                                      title={`Option ${impIndex + 1}`}
                                    />
                                    <SectionDescription>
                                      <div className="space-y-1">
                                        <p className="text-sm text-gray-900 font-medium">
                                          {improvement.text}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {improvement.reading}
                                        </p>
                                        <p className="text-xs text-gray-500 italic">
                                          {improvement.english}
                                        </p>
                                      </div>
                                    </SectionDescription>
                                  </div>

                                  {/* Grammar Focus */}
                                  {improvement.focus && (
                                    <div>
                                      <div className="flex items-center space-x-2 mb-2">
                                        <BookOpen className="w-3 h-3 text-gray-500" />
                                        <SectionSubTitle title="Grammar Focus" />
                                      </div>
                                      <SectionDescription>
                                        <p className="text-xs text-gray-700 leading-relaxed">
                                          {improvement.focus}
                                        </p>
                                      </SectionDescription>
                                    </div>
                                  )}

                                  {/* Difficulty Level */}
                                  {improvement.level && (
                                    <div className="pt-2 border-t border-gray-200">
                                      <span className="text-xs text-gray-600">
                                        Level:{" "}
                                        <span className="font-semibold text-gray-800">
                                          {improvement.level}
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </SectionContainer>

        {/* Metadata Summary */}
        {conversation.metadata && (
          <SectionContainer containerName="Review Summary" icon={MessageSquare}>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Messages</span>
                <span className="text-sm font-semibold text-gray-900">
                  {conversation.metadata.totalMessages}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Your Messages</span>
                <span className="text-sm font-semibold text-gray-900">
                  {conversation.metadata.userMessages}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  Improvements Generated
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {conversation.metadata.improvementsGenerated}
                </span>
              </div>
              {conversation.metadata.generatedAt && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Generated At</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(
                      conversation.metadata.generatedAt
                    ).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </SectionContainer>
        )}
      </div>
    );
  }
);

ConversationReviewContainer.displayName = "ConversationReviewContainer";

export default ConversationReviewContainer;
