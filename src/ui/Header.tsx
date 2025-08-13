import React from "react";
import { Bot, Menu } from "lucide-react";

export const Header = ({
  summary,
  setOpenOverlay,
  handleCreateSummary,
}: {
  summary: any;
  setOpenOverlay: (open: boolean) => void;
  handleCreateSummary: () => void;
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 lg:p-6 shadow-sm ">
      <div className="flex items-center ">
        <div className="flex justify-between gap-4 w-full">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 ">
              <div className="relative">
                <div
                  className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center`}
                >
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white z-10`}
                ></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">音声AI</h2>
              </div>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-green-500 cursor-pointer text-white rounded-lg transition-colors duration-200"
            onClick={() => {
              summary ? setOpenOverlay(true) : handleCreateSummary();
            }}
          >
            {summary ? "Check Summary" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
};


