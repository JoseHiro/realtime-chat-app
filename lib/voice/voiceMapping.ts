/**
 * Maps voice gender to character name and Azure TTS voice name
 */

export type VoiceGender = "male" | "female";
export type CharacterName = "Sakura" | "Ken";

interface VoiceConfig {
  characterName: CharacterName;
  azureVoiceName: string;
  azureVoiceGender: "Male" | "Female";
}

const VOICE_MAP: Record<VoiceGender, VoiceConfig> = {
  female: {
    characterName: "Sakura",
    azureVoiceName: "ja-JP-NanamiNeural",
    azureVoiceGender: "Female",
  },
  male: {
    characterName: "Ken",
    azureVoiceName: "ja-JP-KeitaNeural",
    azureVoiceGender: "Male",
  },
};

/**
 * Get character name and voice configuration from voice gender
 */
export function getVoiceConfig(
  voiceGender: VoiceGender
): VoiceConfig {
  return VOICE_MAP[voiceGender];
}

/**
 * Get character name from voice gender
 */
export function getCharacterName(voiceGender: VoiceGender): CharacterName {
  return VOICE_MAP[voiceGender].characterName;
}

/**
 * Get Azure voice name from character name
 */
export function getAzureVoiceName(characterName: CharacterName): string {
  const config = Object.values(VOICE_MAP).find(
    (c) => c.characterName === characterName
  );
  return config?.azureVoiceName || VOICE_MAP.female.azureVoiceName;
}

/**
 * Get Azure voice gender from character name
 */
export function getAzureVoiceGender(
  characterName: CharacterName
): "Male" | "Female" {
  const config = Object.values(VOICE_MAP).find(
    (c) => c.characterName === characterName
  );
  return config?.azureVoiceGender || "Female";
}
