import React from "react";
import { Calendar, Clock, Tag } from "lucide-react";

export const SectionHeader = ({ meta }: { meta: any }) => {
  const date = meta?.createdAt
    ? new Date(meta.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Conversation Summary
        </p>
        <h1 className="text-xl font-semibold text-gray-900">
          {meta?.title || "Untitled Conversation"}
        </h1>
      </div>
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">
        {meta?.selectedTopic && (
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {meta.selectedTopic.charAt(0).toUpperCase() + meta.selectedTopic.slice(1)}
          </span>
        )}
        {date && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </span>
        )}
        {meta?.chatDuration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {meta.chatDuration} min
          </span>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
