import React, { useState } from "react";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  BookOpen,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionSubTitle } from "./SectionTitle";
import {
  ConversationReview,
  ConversationMessage,
  MessageImprovement,
} from "../../../type/types";
import {
  getCharacterImageUrl,
  type CharacterName,
} from "../../../lib/voice/voiceMapping";

export const ConversationReviewContainer = React.memo(
  ({
    conversation,
    characterName,
  }: {
    conversation: ConversationReview;
    characterName?: string;
  }) => {
    const [expandedMessages, setExpandedMessages] = useState<Set<number>>(
      new Set()
    );

    console.log("conversation", conversation);

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

    // Get character image path based on character name
    const getCharacterImage = () => {
      console.log("characterName", characterName);
      if (!characterName) return null;

      // First try to get from voice mapping config
      const imageUrl = getCharacterImageUrl(characterName as CharacterName);
      if (imageUrl) return imageUrl;

      // Fallback to default images
      if (characterName === "Sakura") {
        return "/img/female.jpg";
      } else if (characterName === "Ken") {
        return "/img/man.jpg";
      }
      return null;
    };

    const characterImage = getCharacterImage();

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
                {message.sender === "user" ? (
                  // User message - aligned to right
                  <div className="flex items-start justify-end space-x-3">
                    <div className="flex-1 min-w-0 max-w-[80%]">
                      <div className="flex flex-col items-end space-y-1 mb-1">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {/* Grammar correctness indicator */}
                          {typeof (message as any).grammarCorrect ===
                            "boolean" && (
                            <div
                              className="flex items-center"
                              title={
                                (message as any).grammarCorrect
                                  ? "Grammatically correct"
                                  : "Grammar needs improvement"
                              }
                            >
                              {(message as any).grammarCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-orange-500" />
                              )}
                            </div>
                          )}
                          <span className="text-xs font-medium text-gray-700">
                            You
                          </span>
                        </div>
                        {/* Grammar reason - show when grammar is incorrect */}
                        {(message as any).grammarCorrect === false &&
                          (message as any).grammarReason && (
                            <div className="text-xs text-orange-600 italic max-w-full">
                              {(message as any).grammarReason}
                            </div>
                          )}
                      </div>
                      <div className="rounded-lg p-3 border border-gray-300">
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                ) : (
                  // Assistant message - aligned to left
                  <div className="flex items-start space-x-3">
                    {characterImage ? (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                        <Image
                          src={characterImage}
                          alt={characterName || "Assistant"}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {characterName || "Assistant"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <SectionDescription className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
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
                )}

                {/* User Message Improvements */}
                {message.sender === "user" &&
                  message.improvements &&
                  message.improvements.length > 0 && (
                    <div className="mr-11">
                      <div className="flex justify-end space-x-2">
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
                      </div>

                      {isMessageExpanded(message.id) && (
                        <div className="space-y-3">
                          {message.improvements.map(
                            (
                              improvement: MessageImprovement,
                              impIndex: number
                            ) => (
                              <div
                                key={impIndex}
                                className="bg-gray-50 rounded-lg p-4 border-green-300 border-1"
                              >
                                <div className="space-y-3">
                                  {/* Improved Sentence */}
                                  <div>
                                    <SectionSubTitle
                                      title={
                                        impIndex === 2
                                          ? `Option ${
                                              impIndex + 1
                                            } - Conversation Development`
                                          : `Option ${impIndex + 1}`
                                      }
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
                                      <div className="flex items-center space-x-2 mb-1">
                                        <BookOpen className="w-3 h-3 text-gray-500" />
                                        <p className="text-xs text-gray-500">
                                          Grammar Focus
                                        </p>
                                      </div>
                                      <p className="text-xs text-gray-700 leading-relaxed">
                                        {improvement.focus}
                                      </p>
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
            </div>
          </SectionContainer>
        )}
      </div>
    );
  }
);

ConversationReviewContainer.displayName = "ConversationReviewContainer";

export default ConversationReviewContainer;
