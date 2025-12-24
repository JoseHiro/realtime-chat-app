import React, { useEffect, useRef } from "react";
import { Clock, MessageCircle, Loader2 } from "lucide-react";
import { Summary } from "./Summary";
import { RoundedButton } from "../button";
import { toast } from "sonner";

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
  const wasLoadingRef = useRef(false);
  const toastShownRef = useRef<string | null>(null); // Track by summary ID or timestamp
  const previousLoadingRef = useRef(false);

  // Track loading state changes and detect transition from loading to ready
  useEffect(() => {
    // Detect transition from loading to not loading with summary available
    if (
      previousLoadingRef.current && // Was loading before
      !summaryFetchLoading && // Not loading now
      summary && // Summary exists
      !toastShownRef.current // Haven't shown toast for this summary yet
    ) {
      // Use summary ID or a unique identifier to prevent duplicate toasts
      const summaryId =
        summary?.meta?.chatId ||
        summary?.meta?.createdAt ||
        JSON.stringify(summary);
      toastShownRef.current = summaryId;

      toast.success("Summary is ready!", {
        description: "Your conversation summary has been generated.",
        position: "top-center",
        duration: 5000,
      });
    }

    // Update refs
    if (summaryFetchLoading) {
      wasLoadingRef.current = true;
    }
    previousLoadingRef.current = summaryFetchLoading;
  }, [summaryFetchLoading, summary]);

  return (
    <>
      {!summaryOpened ? (
        summaryFetchLoading ? ( // Loading
          <div className="text-center p-12 min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-gray-900 animate-spin" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Generating Summary
            </h3>
            <p className="text-gray-600 text-base mb-8">
              Analyzing your conversation...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        ) : !summary ? ( // No Summary
          <div className="text-center p-12">
            <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Not Enough Conversation
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your conversation was too short to generate a summary. Try having
              a longer conversation next time!
            </p>
          </div>
        ) : (
          // Summary Ready
          <div className="text-center p-12">
            <div className="w-20 h-20 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Clock className="w-10 h-10 text-gray-900" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Conversation Finished
            </h2>
            <p className="text-gray-600 mb-8">
              Good job! Please check the summary of your conversation.
            </p>

            <RoundedButton
              onClick={() => setSummaryOpened(true)}
              loading={summaryFetchLoading}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors border-2 border-gray-900 font-medium shadow-sm mx-auto"
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
