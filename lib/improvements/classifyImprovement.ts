import { ImprovementType } from "../../types/types";

/**
 * Classifies an improvement based on its focus text.
 * This is a fallback function used when AI doesn't provide classification.
 *
 * @param focus - The focus/explanation text from the improvement
 * @returns The classified improvement type, or undefined if no match
 */
export function classifyImprovement(
  focus: string
): ImprovementType | undefined {
  if (!focus) return undefined;

  const f = focus.toLowerCase();

  // Complete sentences and fragments
  if (
    f.includes("complete") ||
    f.includes("fragment") ||
    f.includes("incomplete sentence") ||
    f.includes("sentence structure")
  ) {
    return "complete_sentence";
  }

  // Particle usage
  if (
    f.includes("particle") ||
    f.includes("を instead of") ||
    f.includes("が instead of") ||
    f.includes("は instead of") ||
    f.includes("に instead of") ||
    f.includes("で instead of") ||
    f.includes("へ instead of") ||
    f.includes("と instead of") ||
    f.includes("から instead of") ||
    f.includes("まで instead of") ||
    f.includes("より instead of")
  ) {
    return "particle_usage";
  }

  // Listing and conjunctions
  if (
    f.includes("listing") ||
    f.includes("や") ||
    f.includes("そして") ||
    f.includes("conjunction") ||
    f.includes("connect") ||
    f.includes("また") ||
    f.includes("それから")
  ) {
    return "listing_and_conjunctions";
  }

  // Politeness and register
  if (
    f.includes("polite") ||
    f.includes("formal") ||
    f.includes("casual") ||
    f.includes("です・ます") ||
    f.includes("ですます") ||
    f.includes("register") ||
    f.includes("honorific") ||
    f.includes("keigo")
  ) {
    return "politeness_and_register";
  }

  // Opinion expression
  if (
    f.includes("opinion") ||
    f.includes("と思います") ||
    f.includes("と思う") ||
    f.includes("と感じる") ||
    f.includes("と考える") ||
    f.includes("expressing opinion") ||
    f.includes("think") ||
    f.includes("believe")
  ) {
    return "opinion_expression";
  }

  // Conversation expansion
  if (
    f.includes("follow-up") ||
    f.includes("question") ||
    f.includes("conversation") ||
    f.includes("develop") ||
    f.includes("continue") ||
    f.includes("ask back") ||
    f.includes("engage") ||
    f.includes("dialogue")
  ) {
    return "conversation_expansion";
  }

  // Verb forms
  if (
    f.includes("verb form") ||
    f.includes("て-form") ||
    f.includes("た-form") ||
    f.includes("potential") ||
    f.includes("causative") ||
    f.includes("passive") ||
    f.includes("conjugation") ||
    f.includes("verb conjugation")
  ) {
    return "verb_forms";
  }

  // Conditional expressions
  if (
    f.includes("conditional") ||
    f.includes("ば") ||
    f.includes("たら") ||
    f.includes("なら") ||
    f.includes("と conditional") ||
    f.includes("if") ||
    f.includes("when")
  ) {
    return "conditional_expressions";
  }

  // Honorifics (specific keigo)
  if (
    f.includes("尊敬語") ||
    f.includes("謙譲語") ||
    f.includes("sonkeigo") ||
    f.includes("kenjougo") ||
    f.includes("respectful") ||
    f.includes("humble")
  ) {
    return "honorifics";
  }

  // Vocabulary choice
  if (
    f.includes("vocabulary") ||
    f.includes("word choice") ||
    f.includes("better word") ||
    f.includes("more natural") ||
    f.includes("synonym") ||
    f.includes("alternative")
  ) {
    return "vocabulary_choice";
  }

  // Sentence structure (general)
  if (
    f.includes("word order") ||
    f.includes("sentence structure") ||
    f.includes("grammar structure") ||
    f.includes("syntax") ||
    f.includes("complex sentence")
  ) {
    return "sentence_structure";
  }

  // Default: undefined if no match
  return undefined;
}
