import React from "react";
import { BookText, Award } from "lucide-react";

export const SectionHeader = ({ meta }: { meta: any }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <BookText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {meta?.title || "Learning Summary"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {meta?.selectedTopic || "Conversation"} •{" "}
                {typeof meta?.level === "object"
                  ? meta.level.label
                  : meta?.level || "N5"}{" "}
                Level
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {meta?.chatDuration || 0} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
