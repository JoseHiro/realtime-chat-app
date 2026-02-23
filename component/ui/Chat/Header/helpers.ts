import { User, UserCheck, Settings, type LucideIcon } from "lucide-react";
import { getCharacterImageUrl } from "../../../../lib/voice/voiceMapping";
import type { CharacterName } from "../../../../lib/voice/voiceMapping";
import { THEME_MAP, LEVEL_MAP } from "./constants";

export function getLevelLabel(
  level?: string,
  selectedLevel?: string,
): string | undefined {
  const value = level ?? selectedLevel;
  if (value && value in LEVEL_MAP) return LEVEL_MAP[value];
  return value;
}

export function getPolitenessInfo(
  politeness?: string,
  selectedPoliteness?: string,
): { label: string; icon: LucideIcon } {
  const isCasual = (politeness ?? selectedPoliteness) === "casual";
  return isCasual
    ? { label: "Casual", icon: User }
    : { label: "Formal", icon: UserCheck };
}

export function getThemeInfo(
  theme?: string,
  selectedTheme?: string,
  customTheme?: string,
): { label: string; icon: LucideIcon } {
  if (customTheme) return { label: customTheme, icon: Settings };
  const value = theme ?? selectedTheme;
  if (value && value in THEME_MAP) {
    return THEME_MAP[value as keyof typeof THEME_MAP];
  }
  return { label: theme ?? "", icon: Settings };
}

export function getCharacterImage(
  characterName?: string | null,
): string | null {
  if (!characterName) return null;
  const imageUrl = getCharacterImageUrl(characterName as CharacterName);
  if (imageUrl) return imageUrl;
  if (characterName === "Sakura") return "/img/female.jpg";
  if (characterName === "Ken") return "/img/man.jpg";
  return null;
}
