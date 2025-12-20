import React from "react";
import { MdAutoFixHigh } from "react-icons/md";
import { Lock, Crown, Sparkles, ChevronRight, User } from "lucide-react";
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
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-gray-900">Grammar Correction Mode</h2>
        <div className="bg-gray-100 rounded-full p-2">
          <MdAutoFixHigh className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-2">
        {!isProUser && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
            <Lock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-700">
              Pro Only
            </span>
          </div>
        )}
      </div>
      {!isProUser ? (
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 p-8">
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-100 rounded-full p-2">
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-center max-w-md mx-auto">
              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Unlock Grammar Correction
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Get real-time grammar corrections during conversations. Perfect
                your Japanese with instant feedback on your mistakes!
              </p>
              <button
                onClick={() => setPaymentOverlay(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Pro
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-500 mt-4">
                ✨ Available in Pro plan only
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {corrections.map((option) => {
            const IconComponent = iconMap[option.icon] ?? User;
            return (
              <SelectModeButton
                key={option.id}
                onClick={() => setCheckGrammarMode(option.value)}
                className={`cursor-pointer relative group p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                  checkGrammarMode === option.value
                    ? "border-green-500 shadow-green-200"
                    : "border-transparent hover:border-green-200"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
                <div className="relative z-10 text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto transition-colors duration-300 ${
                      checkGrammarMode === option.value
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <ButtonContents
                    label={option.label}
                    description={option.description}
                    example={option.example}
                    selected={checkGrammarMode === option.value}
                  />
                </div>
              </SelectModeButton>
            );
          })}
        </div>
      )}
    </div>
  );
};
