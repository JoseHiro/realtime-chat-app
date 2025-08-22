import { useState } from "react";
import { Volume2, VolumeX, Sparkles, Plus, Settings } from "lucide-react";

export const Sidebar = () => {
  const [isMuted, setIsMuted] = useState(false);
  return (
    <div className="hidden lg:flex w-80 border-r h-full border-gray-200 shadow-sm bg-white/15 backdrop-blur-xl">
      <div className="flex flex-col w-full p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Kaiwa Kun</h1>
        </div>

        <button className=" cursor-pointer flex items-center gap-3 p-4 rounded-xl bg-green-500 text-white mb-4 hover:bg-green-600 transition-all duration-200 shadow-sm">
          <Plus className="w-5 h-5" />
          新しい会話
        </button>

        <div className="flex-1 space-y-2">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 text-sm">
            音声会話履歴
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-3 p-3 rounded-lg w-full transition-colors ${
              isMuted
                ? "text-red-600 bg-red-50 border border-red-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
            {isMuted ? "ミュート中" : "音声オン"}
          </button>
          <button className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 w-full transition-colors">
            <Settings className="w-5 h-5" />
            設定
          </button>
        </div>
      </div>
    </div>
  );
};
