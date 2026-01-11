/**
 * Grammar error types that can be extracted from grammarReason
 */
export type GrammarErrorType =
  | "particle_error"
  | "verb_conjugation"
  | "missing_marker"
  | "word_order"
  | "sentence_structure"
  | "politeness_mismatch"
  | "tense_error"
  | "form_error";

/**
 * Classifies a grammar error based on its grammarReason text.
 *
 * @param grammarReason - The explanation text from grammarReason
 * @returns The classified grammar error type, or undefined if no match
 */
export function classifyGrammarError(
  grammarReason: string
): GrammarErrorType | undefined {
  if (!grammarReason) return undefined;

  const reason = grammarReason.toLowerCase();

  // Particle errors
  if (
    reason.includes("particle") ||
    reason.includes("を instead of") ||
    reason.includes("が instead of") ||
    reason.includes("は instead of") ||
    reason.includes("に instead of") ||
    reason.includes("で instead of") ||
    reason.includes("へ instead of") ||
    reason.includes("と instead of") ||
    reason.includes("から instead of") ||
    reason.includes("まで instead of") ||
    reason.includes("より instead of") ||
    reason.includes("wrong particle") ||
    reason.includes("incorrect particle")
  ) {
    return "particle_error";
  }

  // Verb conjugation errors
  if (
    reason.includes("verb conjugation") ||
    reason.includes("verb form") ||
    reason.includes("conjugation error") ||
    reason.includes("conjugate") ||
    reason.includes("verb ending") ||
    reason.includes("verb tense")
  ) {
    return "verb_conjugation";
  }

  // Missing markers
  if (
    reason.includes("missing") ||
    reason.includes("subject marker") ||
    reason.includes("topic marker") ||
    reason.includes("object marker") ||
    reason.includes("no は") ||
    reason.includes("no が") ||
    reason.includes("no を")
  ) {
    return "missing_marker";
  }

  // Word order errors
  if (
    reason.includes("word order") ||
    reason.includes("sentence order") ||
    reason.includes("order") ||
    reason.includes("position")
  ) {
    return "word_order";
  }

  // Sentence structure errors
  if (
    reason.includes("sentence structure") ||
    reason.includes("structure") ||
    reason.includes("incomplete") ||
    reason.includes("fragment")
  ) {
    return "sentence_structure";
  }

  // Politeness mismatch
  if (
    reason.includes("politeness") ||
    reason.includes("formality") ||
    reason.includes("です・ます") ||
    reason.includes("ですます") ||
    reason.includes("plain form") ||
    reason.includes("casual form")
  ) {
    return "politeness_mismatch";
  }

  // Tense errors
  if (
    reason.includes("tense") ||
    reason.includes("past tense") ||
    reason.includes("present tense") ||
    reason.includes("future tense") ||
    reason.includes("た-form") ||
    reason.includes("て-form")
  ) {
    return "tense_error";
  }

  // Form errors (general)
  if (
    reason.includes("form") ||
    reason.includes("ending") ||
    reason.includes("suffix")
  ) {
    return "form_error";
  }

  return undefined;
}

/**
 * Gets a human-readable label for a grammar error type
 */
export function getGrammarErrorTypeLabel(type: GrammarErrorType): string {
  const labels: Record<GrammarErrorType, string> = {
    particle_error: "Particle Error",
    verb_conjugation: "Verb Conjugation",
    missing_marker: "Missing Marker",
    word_order: "Word Order",
    sentence_structure: "Sentence Structure",
    politeness_mismatch: "Politeness Mismatch",
    tense_error: "Tense Error",
    form_error: "Form Error",
  };
  return labels[type] || type;
}

/**
 * Gets a color class for a grammar error type badge
 */
export function getGrammarErrorTypeColor(type: GrammarErrorType): string {
  const colors: Record<GrammarErrorType, string> = {
    particle_error: "bg-red-100 text-red-700 border-red-300",
    verb_conjugation: "bg-orange-100 text-orange-700 border-orange-300",
    missing_marker: "bg-amber-100 text-amber-700 border-amber-300",
    word_order: "bg-yellow-100 text-yellow-700 border-yellow-300",
    sentence_structure: "bg-lime-100 text-lime-700 border-lime-300",
    politeness_mismatch: "bg-pink-100 text-pink-700 border-pink-300",
    tense_error: "bg-purple-100 text-purple-700 border-purple-300",
    form_error: "bg-rose-100 text-rose-700 border-rose-300",
  };
  return colors[type] || "bg-gray-100 text-gray-700 border-gray-300";
}
