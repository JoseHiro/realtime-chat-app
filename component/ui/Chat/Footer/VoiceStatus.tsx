import React from "react";

interface VoiceStatusProps {
  // isConnected: boolean;
  // isUserSpeaking: boolean;
  // isAgentSpeaking: boolean;
}

export const VoiceStatus = ({
  // isConnected,
  // isUserSpeaking,
  // isAgentSpeaking,
}: VoiceStatusProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-4">
        {/* <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              !isConnected
                ? "bg-gray-300"
                : isUserSpeaking
                ? "bg-blue-500 scale-110"
                : isAgentSpeaking
                ? "bg-purple-500"
                : "bg-green-100 border-4 border-green-500 animate-pulse"
            }`}
          ></div>
          <p className="text-sm font-medium text-gray-700">
            {!isConnected
              ? "Connecting..."
              : isUserSpeaking
              ? "You're speaking..."
              : isAgentSpeaking
              ? "AI is responding..."
              : "Listening - speak naturally"}
          </p>
        </div> */}
      </div>
      {/* {isConnected && (
        <p className="text-xs text-gray-500 text-center">
          Voice Activity Detection is active. You can interrupt the AI
          mid-sentence.
        </p>
      )} */}
    </div>
  );
};
