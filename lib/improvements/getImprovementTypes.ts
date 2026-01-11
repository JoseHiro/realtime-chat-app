import { ConversationReview, ImprovementType } from "../../type/types";

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
export function getImprovementTypeColor(type: ImprovementType): string {
  const colors: Record<ImprovementType, string> = {
    complete_sentence: "bg-gray-100 text-gray-700 border-gray-300",
    particle_usage: "bg-blue-100 text-blue-700 border-blue-300",
    listing_and_conjunctions: "bg-purple-100 text-purple-700 border-purple-300",
    politeness_and_register: "bg-pink-100 text-pink-700 border-pink-300",
    opinion_expression: "bg-orange-100 text-orange-700 border-orange-300",
    conversation_expansion: "bg-green-100 text-green-700 border-green-300",
    verb_forms: "bg-yellow-100 text-yellow-700 border-yellow-300",
    conditional_expressions: "bg-indigo-100 text-indigo-700 border-indigo-300",
    honorifics: "bg-red-100 text-red-700 border-red-300",
    vocabulary_choice: "bg-teal-100 text-teal-700 border-teal-300",
    sentence_structure: "bg-slate-100 text-slate-700 border-slate-300",
  };
  return colors[type] || "bg-gray-100 text-gray-700 border-gray-300";
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
