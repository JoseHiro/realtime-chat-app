import React, { useState } from "react";
import { MdAutoFixHigh } from "react-icons/md";
import { Lock, Crown, User, ChevronDown, ChevronUp } from "lucide-react";
import corrections from "../../../data/corrections.json";
import { SelectModeButton } from "../../button";
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-900">Grammar Correction Mode</h2>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-full p-2">
            <MdAutoFixHigh className="w-6 h-6 text-gray-700" />
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            ) : (
              <ChevronUp className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            )}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {corrections.map((option) => {
            const IconComponent = iconMap[option.icon] ?? User;
            const isCorrectGrammarOption = option.value === true;
            const isLocked = !isProUser && isCorrectGrammarOption;

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
                className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  checkGrammarMode === option.value
                    ? "border-green-500 shadow-green-200"
                    : "border-transparent hover:border-green-200"
                } ${
                  isLocked
                    ? "opacity-60 cursor-not-allowed hover:shadow-lg hover:-translate-y-0"
                    : ""
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                    option.color
                  } opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${
                    isLocked ? "opacity-5" : ""
                  }`}
                ></div>
                {isLocked && (
                  <div className="absolute top-3 right-3 z-20">
                    <div className="bg-yellow-100 rounded-full p-1.5">
                      <Lock className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                )}
                <div className="relative z-10 text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors duration-300 ${
                      checkGrammarMode === option.value
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                    } ${isLocked ? "opacity-60" : ""}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <ButtonContents
                    label={option.label}
                    description={option.description}
                    example={option.example}
                    selected={checkGrammarMode === option.value}
                  />
                  {isLocked && (
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <Crown className="w-3 h-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">
                        Pro Only
                      </span>
                    </div>
                  )}
                </div>
              </SelectModeButton>
            );
          })}
        </div>
      )}
    </div>
  );
};
