import React from "react";
import { FileText, FileX, Loader2 } from "lucide-react";
import { StopWatch } from "../StopWatch";

interface HeaderActionsProps {
  chatPage?: boolean;
  history?: any;
  setOverlayOpened: (open: boolean) => void;
  selectedTime: number;
  summaryFetchLoading: boolean;
  analysis?: any;
  summary?: any;
}

export const HeaderActions = ({
  chatPage,
  history,
  setOverlayOpened,
  selectedTime,
  summaryFetchLoading,
  analysis,
  summary,
}: HeaderActionsProps) => {
  return (
    <div className="flex space-x-3 items-center">
      {chatPage && (
        <StopWatch
          history={history}
          setOverlayOpened={setOverlayOpened}
          chatDurationMinutes={selectedTime}
        />
      )}
      {summaryFetchLoading ? (
        <button
          disabled
          className="p-2.5 rounded-lg bg-gray-100 text-gray-400 cursor-wait"
          title="Generating Summary..."
        >
          <Loader2 className="w-5 h-5 animate-spin" />
        </button>
      ) : analysis || summary ? (
        <button
          onClick={() => setOverlayOpened(true)}
          className="p-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          title="View Summary"
        >
          <FileText className="w-5 h-5" />
        </button>
      ) : (
        <div
          className="p-2.5 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
          title="No Summary Available"
        >
          <FileX className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
