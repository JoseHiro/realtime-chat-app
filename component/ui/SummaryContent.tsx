import React from "react";
import { Clock, MessageCircle } from "lucide-react";
import { Summary } from "./Summary";
import { RoundedButton } from "../button";

export const SummaryContent = ({
  summaryOpened,
  setSummaryOpened,
  summary,
  summaryFetchLoading,
}: {
  summaryOpened: boolean;
  setSummaryOpened: (value: boolean) => void;
  summary: any;
  summaryFetchLoading: boolean;
}) => {
  return (
    <>
      {!summaryOpened ? (
        summaryFetchLoading ? ( // Loading
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Generating Summary...
            </h3>
            <p className="text-gray-600">
              Please wait while we analyze your conversation.
            </p>
          </div>
        ) : !summary ? ( // No Summary
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Not Enough Conversation
            </h3>
            <p className="text-gray-600 mb-6">
              Your conversation was too short to generate a summary. Try having
              a longer conversation next time!
            </p>
          </div>
        ) : (
          // サマリー完成
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Conversation Finished
            </h2>
            <p className="text-gray-600 mb-6">
              Good job! Please check the summary of your conversation.
            </p>
            <RoundedButton
              onClick={() => setSummaryOpened(true)}
              loading={summaryFetchLoading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors m-auto"
            >
              View Summary
            </RoundedButton>
          </div>
        )
      ) : (
        <Summary summary={summary} />
      )}
    </>
  );
};
