import { ConversationReview } from "../../types/types";
import {
  GrammarErrorType,
  classifyGrammarError,
} from "./classifyGrammarError";

/**
 * Gets grammar error types with their counts from conversation messages
 * Returns an array of objects with type and count
 * @param conversation - The conversation review data
 * @returns Array of { type: GrammarErrorType, count: number }
 */
export function getGrammarErrorTypesWithCounts(
  conversation: ConversationReview | null | undefined
): Array<{ type: GrammarErrorType; count: number }> {
  if (!conversation?.messages) {
    return [];
  }

  const errorCountMap = new Map<GrammarErrorType, number>();
  const errorOrder: GrammarErrorType[] = [];

  conversation.messages.forEach((message) => {
    // Check if message has grammar errors
    if (
      message.grammarCorrect === false &&
      message.grammarReason
    ) {
      const errorType = classifyGrammarError(message.grammarReason);

      if (errorType) {
        const currentCount = errorCountMap.get(errorType) || 0;
        errorCountMap.set(errorType, currentCount + 1);

        // Track order of first appearance
        if (!errorOrder.includes(errorType)) {
          errorOrder.push(errorType);
        }
      }
    }
  });

  // Return in order of first appearance with counts
  return errorOrder.map((type) => ({
    type,
    count: errorCountMap.get(type) || 0,
  }));
}

/**
 * Checks if there are any grammar errors in the conversation
 * @param conversation - The conversation review data
 * @returns true if there are grammar errors, false otherwise
 */
export function hasGrammarErrors(
  conversation: ConversationReview | null | undefined
): boolean {
  if (!conversation?.messages) {
    return false;
  }

  return conversation.messages.some(
    (message) =>
      message.sender === "user" &&
      message.grammarCorrect === false &&
      message.grammarReason
  );
}
