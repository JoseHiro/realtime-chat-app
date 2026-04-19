import { ConversationReview, ImprovementType } from "../../types/types";

/**
 * Extracts improvement types from conversation review data
 * Returns a map of improvement index to its type
 */
export function getImprovementTypesFromConversation(
  conversation: ConversationReview | null | undefined
): Map<number, ImprovementType> {
  const typeMap = new Map<number, ImprovementType>();

  if (!conversation?.messages) {
    return typeMap;
  }

  let improvementIndex = 0;

  conversation.messages.forEach((message) => {
    if (message.improvements && Array.isArray(message.improvements)) {
      message.improvements.forEach((improvement) => {
        if (improvement.type) {
          typeMap.set(improvementIndex, improvement.type);
          improvementIndex++;
        }
      });
    }
  });

  return typeMap;
}

/**
 * Gets a human-readable label for an improvement type
 */
export function getImprovementTypeLabel(type: ImprovementType): string {
  const labels: Record<ImprovementType, string> = {
    complete_sentence: "Complete Sentence",
    particle_usage: "Particle Usage",
    listing_and_conjunctions: "Listing & Conjunctions",
    politeness_and_register: "Politeness & Register",
    opinion_expression: "Opinion Expression",
    conversation_expansion: "Conversation Expansion",
    verb_forms: "Verb Forms",
    conditional_expressions: "Conditional Expressions",
    honorifics: "Honorifics",
    vocabulary_choice: "Vocabulary Choice",
    sentence_structure: "Sentence Structure",
  };
  return labels[type] || type;
}

/**
 * Gets a color class for an improvement type badge
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getImprovementTypeColor(_type: ImprovementType): string {
  return "bg-gray-100 text-gray-700 border-gray-200";
}

/**
 * Extracts unique improvement types from conversation messages
 * Returns an array of unique ImprovementType values in the order they appear
 * @param conversation - The conversation review data
 * @returns Array of unique improvement types
 */
export function getUniqueImprovementTypes(
  conversation: ConversationReview | null | undefined
): ImprovementType[] {
  if (!conversation?.messages) {
    return [];
  }

  const typeSet = new Set<ImprovementType>();

  conversation.messages.forEach((message) => {
    if (message.improvements && Array.isArray(message.improvements)) {
      message.improvements.forEach((improvement) => {
        if (improvement.type) {
          typeSet.add(improvement.type);
        }
      });
    }
  });

  // Convert Set to Array to maintain order of first appearance
  return Array.from(typeSet);
}

/**
 * Gets improvement types with their counts from conversation messages
 * Returns an array of objects with type and count
 * @param conversation - The conversation review data
 * @returns Array of { type: ImprovementType, count: number }
 */
export function getImprovementTypesWithCounts(
  conversation: ConversationReview | null | undefined
): Array<{ type: ImprovementType; count: number }> {
  if (!conversation?.messages) {
    return [];
  }

  const typeCountMap = new Map<ImprovementType, number>();
  const typeOrder: ImprovementType[] = [];

  conversation.messages.forEach((message) => {
    if (message.improvements && Array.isArray(message.improvements)) {
      message.improvements.forEach((improvement) => {
        if (improvement.type) {
          const currentCount = typeCountMap.get(improvement.type) || 0;
          typeCountMap.set(improvement.type, currentCount + 1);

          // Track order of first appearance
          if (!typeOrder.includes(improvement.type)) {
            typeOrder.push(improvement.type);
          }
        }
      });
    }
  });

  // Return in order of first appearance with counts
  return typeOrder.map((type) => ({
    type,
    count: typeCountMap.get(type) || 0,
  }));
}
