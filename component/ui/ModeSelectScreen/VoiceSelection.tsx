import React from "react";
import { UserRound } from "lucide-react";
import { SelectModeButton } from "../../button";
import Image from "next/image";

type VoiceSelectionProps = {
  voiceGender: "male" | "female";
  setVoiceGender: (gender: "male" | "female") => void;
};
export const VoiceSelection = ({
  voiceGender,
  setVoiceGender,
}: VoiceSelectionProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-700 mb-2 mt-10">Voice Type</h2>
        <div className="bg-gray-100 rounded-full p-2">
          <UserRound className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="flex gap-6 max-w-md">
        {/* Sakura */}
        <SelectModeButton
          onClick={() => setVoiceGender("female")}
          className={`cursor-pointer relative group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 flex-1 ${
            voiceGender === "female"
              ? "border-green-500 shadow-green-200"
              : "border-transparent hover:border-green-200"
          }`}
        >
          <div className="relative h-32 overflow-hidden">
            <Image
              src="/img/female.jpg"
              alt="Sakura"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {voiceGender === "female" && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <div className="p-6 text-center">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Sakura
            </h3>
            <p className="text-gray-600 text-xs">Natural, warm, and friendly</p>
          </div>
        </SelectModeButton>

        {/* Ken */}
        <SelectModeButton
          onClick={() => setVoiceGender("male")}
          className={`cursor-pointer relative group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 flex-1 ${
            voiceGender === "male"
              ? "border-green-500 shadow-green-200"
              : "border-transparent hover:border-blue-200"
          }`}
        >
          <div className="relative h-32 overflow-hidden">
            <Image
              src="/img/man.jpg"
              alt="Ken"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {voiceGender === "male" && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <div className="p-6 text-center">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Ken</h3>
            <p className="text-gray-600 text-xs">
              Clear, confident, and professional
            </p>
          </div>
        </SelectModeButton>
      </div>
    </div>
  );
};
