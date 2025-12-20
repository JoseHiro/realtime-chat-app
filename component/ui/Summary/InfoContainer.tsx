import React from "react";
import { MessageCircle, Award } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";

export const InfoContainer = React.memo(({
  meta,
  correctionsLength,
  enhancementsLength,
}: {
  meta: any;
  correctionsLength: number;
  enhancementsLength: number;
}) => {
  return (
    <div className="space-y-6">
      <SectionContainer
        containerName="Conversation Information"
        icon={MessageCircle}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-2">Topic</div>
            <div className="text-lg text-gray-900 font-medium">
              {meta?.selectedTopic || "General Conversation"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">Duration</div>
            <div className="text-lg text-gray-900 font-medium">
              {meta?.chatDuration || 0} minutes
            </div>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Overall Summary
          </h3>
          <SectionDescription>
            {meta?.summary || "No summary available."}
          </SectionDescription>
        </div>
      </SectionContainer>

      {/* Level Assessment */}
      <SectionContainer containerName="Level Assessment" icon={Award}>
        <SectionDescription>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {typeof meta?.level === "object"
              ? meta.level.label
              : meta?.level || "N5"}
          </div>
          {typeof meta?.level === "object" && meta.level.reason && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {meta.level.reason}
            </p>
          )}
        </SectionDescription>
      </SectionContainer>

      {/* Quick Stats */}
      <SectionContainer containerName="Performance Metrics">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">Corrections Made</span>
            <span className="text-lg font-semibold text-gray-900">
              {correctionsLength || 0}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">Sentence Upgrades</span>
            <span className="text-lg font-semibold text-gray-900">
              {enhancementsLength || 0}
            </span>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
});

InfoContainer.displayName = "InfoContainer";

export default InfoContainer;
