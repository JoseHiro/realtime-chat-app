import React, { useState } from "react";
import { MdAutoFixHigh } from "react-icons/md";
import { Lock, User } from "lucide-react";
import corrections from "../../../data/corrections.json";
import { SelectModeButton } from "../../shared/button";
import { ButtonContents } from "./ButtonContents";

type GrammarCorrectionProps = {
  isProUser: boolean;
  checkGrammarMode: boolean;
  setCheckGrammarMode: (mode: boolean) => void;
  setPaymentOverlay: (show: boolean) => void;
  iconMap: Record<string, React.ElementType>;
};

export const GrammarCorrection = ({
  isProUser,
  checkGrammarMode,
  setCheckGrammarMode,
  setPaymentOverlay,
  iconMap,
}: GrammarCorrectionProps) => {
  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            Grammar Correction
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose whether to receive grammar feedback
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
          <MdAutoFixHigh className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
        {corrections.map((option) => {
          const IconComponent = iconMap[option.icon] ?? User;
          const isCorrectGrammarOption = option.value === true;
          const isLocked = !isProUser && isCorrectGrammarOption;
          const isSelected = checkGrammarMode === option.value;

          return (
            <SelectModeButton
              key={option.id}
              onClick={() => {
                if (isLocked) {
                  setPaymentOverlay(true);
                } else {
                  setCheckGrammarMode(option.value);
                }
              }}
              className={`relative p-5 rounded-lg border transition-all ${
                isLocked
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
              } ${
                isSelected
                  ? "border-gray-900 dark:border-gray-300 bg-gray-50 dark:bg-gray-800"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }`}
            >
              {/* Lock Badge */}
              {isLocked && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Details */}
                <ButtonContents
                  label={option.label}
                  description={option.description}
                  example={option.example}
                  selected={isSelected}
                />

                {/* Pro Badge */}
                {isLocked && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Pro Feature
                    </span>
                  </div>
                )}
              </div>
            </SelectModeButton>
          );
        })}
      </div>
    </div>
  );
};
