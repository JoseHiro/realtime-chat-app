import React from "react";
import { AlertCircle, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionTitle, SectionSubTitle } from "./SectionTitle";
import { Feedback } from "../../../type/types";

export const FeedbackContainer = React.memo(
  ({ feedback }: { feedback: Feedback }) => {
    return (
      <div className="space-y-6">
        {/* Strengths */}
        {feedback.strengths && feedback.strengths.length > 0 && (
          <SectionContainer containerName="Strengths" icon={CheckCircle}>
            <div className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <SectionDescription key={index}>{strength}</SectionDescription>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Improvements */}
        {feedback.improvements && feedback.improvements.length > 0 && (
          <SectionContainer
            containerName="Areas for Improvement"
            icon={TrendingUp}
          >
            <div className="space-y-3">
              {feedback.improvements.map((improvement, index) => (
                <SectionDescription key={index}>
                  {improvement}
                </SectionDescription>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Common Mistakes */}
        {feedback.commonMistakes && feedback.commonMistakes.length > 0 && (
          <SectionContainer containerName="Common Mistakes" icon={AlertCircle}>
            <div className="space-y-3">
              {feedback.commonMistakes.map((mistake, index) => (
                <SectionDescription key={index}>{mistake}</SectionDescription>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Corrections */}
        {feedback.corrections && feedback.corrections.length > 0 && (
          <SectionContainer containerName="Corrections" icon={AlertCircle}>
            <div className="space-y-4">
              {feedback.corrections.map((correction, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  {correction.advice && (
                    <div className="mb-4">
                      <SectionTitle title="Advice" />
                      <SectionDescription>
                        {correction.advice}
                      </SectionDescription>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <SectionSubTitle title="Before" />
                      <SectionDescription className="bg-white border-black">
                        {correction.before}
                      </SectionDescription>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <SectionSubTitle title="After" />
                      <SectionDescription className="bg-green-50 border-green-500">
                        {correction.after}
                      </SectionDescription>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionContainer>
        )}

        {/* Enhancements */}
        {feedback.enhancements && feedback.enhancements.length > 0 && (
          <SectionContainer
            containerName="Sentence Enhancements"
            icon={TrendingUp}
          >
            <div className="space-y-4">
              {feedback.enhancements.map((enhancement, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  {enhancement.advice && (
                    <div className="mb-4">
                      <SectionTitle title="Advice" />
                      <SectionDescription>
                        {enhancement.advice}
                      </SectionDescription>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <SectionSubTitle title="Original" />
                      <SectionDescription>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 font-medium">
                            {enhancement.original.kanji}
                          </p>
                          <p className="text-xs text-gray-600">
                            {enhancement.original.kana}
                          </p>
                        </div>
                      </SectionDescription>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <SectionSubTitle title="Enhanced" />
                      <SectionDescription className="bg-white">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 font-medium">
                            {enhancement.upgraded.kanji}
                          </p>
                          <p className="text-xs text-gray-600">
                            {enhancement.upgraded.kana}
                          </p>
                        </div>
                      </SectionDescription>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionContainer>
        )}
      </div>
    );
  }
);

FeedbackContainer.displayName = "FeedbackContainer";

export default FeedbackContainer;
