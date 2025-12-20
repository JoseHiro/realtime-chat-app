import { Sparkles } from "lucide-react";
import { useRouter } from "next/router";
import { useSpeech } from "../../context/SpeechContext";

export const AppName = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <button
        onClick={() => router.push("/")}
        className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Kaiwa Kun Demo
      </button>
    </div>
  );
};

export const SidebarAppName = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity"
    >
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <h1 className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
        Kaiwa Kun
      </h1>
    </button>
  );
};
