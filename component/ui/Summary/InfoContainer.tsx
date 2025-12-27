import React from "react";
import { MessageCircle, Award } from "lucide-react";
import { SectionContainer, SectionDescription } from "./Container";

export const InfoContainer = React.memo(({ meta }: { meta: any }) => {
  return (
    <div className="space-y-6">
      <SectionContainer
        containerName="Conversation Information"
        icon={MessageCircle}
      >
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-2">Topic</div>
            <div className="text-lg text-gray-900 font-medium">
              {meta?.selectedTopic?.charAt(0).toUpperCase() +
                meta?.selectedTopic?.slice(1) || "Conversation"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-2">Date</div>
            <div className="text-lg text-gray-900 font-medium">
              {meta?.createdAt
                ? new Date(meta.createdAt).toLocaleDateString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
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
    </div>
  );
});

InfoContainer.displayName = "InfoContainer";

export default InfoContainer;
