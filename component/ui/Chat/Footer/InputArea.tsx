import React, { useState, useCallback } from "react";

import { Send } from "lucide-react";

interface InputAreaProps {
  sendTextMessage?: (message: string) => void;
}

export const InputArea = ({ sendTextMessage }: InputAreaProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // prevent multiple clicks

  const handleSend = useCallback(async () => {
    const trimmed = message.trim();

    // 空文字、または送信中の場合はガード
    if (!trimmed || isSending || !sendTextMessage) return;

    try {
      setIsSending(true);
      setMessage("");
      sendTextMessage(trimmed);
    } catch (error) {
      console.error("送信失敗:", error);
      // 失敗した時だけ入力を戻す、などの処理も可能
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, sendTextMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 変換中のEnter（IME）で送信されないようにする
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault(); // デフォルトの挙動（改行など）を防止
      handleSend();
    }
  };

  return (
    <div className="flex items-center w-full gap-2 justify-center max-w-2xl mx-auto">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Enter your message"
      />
      <button
        type="button"
        onClick={handleSend}
        className="bg-black text-white rounded-md p-2 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
