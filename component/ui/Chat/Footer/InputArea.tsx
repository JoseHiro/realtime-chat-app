import React from "react";
import { Send } from "lucide-react";

interface InputAreaProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
}

export const InputArea = ({ message, setMessage, onSend }: InputAreaProps) => {
  return (
    <div className="flex items-center w-full gap-2 justify-center max-w-2xl mx-auto">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Enter your message"
      />
      <button
        onClick={onSend}
        className="bg-black text-white rounded-md p-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
