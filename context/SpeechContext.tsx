/**
 * Legacy re-exports. Prefer importing from the specific context modules:
 * - ChatSessionContext (useChatSession)
 * - UserContext (useUser)
 * - SummaryContext (useSummary)
 * - UIPreferencesContext (useUIPreferences)
 */

export { useChatSession } from "./ChatSessionContext";
export type { ChatSessionContextType, CharacterName } from "./ChatSessionContext";
export { useUser } from "./UserContext";
export type { UserContextType } from "./UserContext";
export { useSummary } from "./SummaryContext";
export type { SummaryContextType } from "./SummaryContext";
export { useUIPreferences } from "./UIPreferencesContext";
export type { UIPreferencesContextType } from "./UIPreferencesContext";
