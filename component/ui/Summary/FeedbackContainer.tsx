import React from "react";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";
import { SectionTitle, SectionSubTitle } from "./SectionTitle";
import { Feedback } from "../../../types/types";

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
      </div>
    );
  }
);

FeedbackContainer.displayName = "FeedbackContainer";

export default FeedbackContainer;
