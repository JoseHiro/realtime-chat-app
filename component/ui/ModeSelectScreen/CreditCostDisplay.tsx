import React, { useMemo } from "react";
import { Coins } from "lucide-react";
import { calculateCreditsForCharacter } from "../../../lib/credits/characterCredits";
import type { CharacterName } from "../../../lib/voice/voiceMapping";

type CreditCostDisplayProps = {
  selectedTime: number; // 3, 5, or 10 (minutes)
  selectedCharacter: CharacterName;
  creditsRemaining: number;
  subscriptionPlan?: string | null;
};

export const CreditCostDisplay = ({
  selectedTime,
  selectedCharacter,
  creditsRemaining,
  subscriptionPlan,
}: CreditCostDisplayProps) => {
  // Only show for pro/premium users
  const showCredits = subscriptionPlan === "pro" || subscriptionPlan === "premium";

  const creditCost = useMemo(() => {
    try {
      return calculateCreditsForCharacter(selectedTime, selectedCharacter);
    } catch (error) {
      return 0;
    }
  }, [selectedTime, selectedCharacter]);

  const hasEnoughCredits = creditsRemaining >= creditCost;

  if (!showCredits) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <Coins className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Credit Cost for this chat
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedTime} min · {selectedCharacter}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${
                hasEnoughCredits ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
              }`}
            >
              {creditCost}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">credits</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Your balance:</span>
            <span
              className={`font-semibold ${
                hasEnoughCredits ? "text-gray-900 dark:text-gray-100" : "text-red-600 dark:text-red-400"
              }`}
            >
              {creditsRemaining} credits
            </span>
          </div>
          {!hasEnoughCredits && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
              Insufficient credits. Please top up or wait for monthly allocation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
