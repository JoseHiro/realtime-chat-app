import React from "react";
import Image from "next/image";
import { getCharacterImage } from "./helpers/helpers";

interface CharacterAvatarProps {
  characterName?: string;
}

export const CharacterAvatar = ({ characterName }: CharacterAvatarProps) => {
  const imageUrl = getCharacterImage(characterName);

  if (imageUrl) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-white">
        <Image
          src={imageUrl}
          alt={characterName || "AI"}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border">
      <span className="text-black font-semibold text-sm">AI</span>
    </div>
  );
};
