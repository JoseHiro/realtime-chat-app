import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../../component/ui/Sidebar";
// import { Pen } from "lucide-react";
import {
  AssistantMessageBox,
  UserMessageBox,
} from "../../component/ui/Chat/Message";
import { TimeStamp } from "../../component/ui/Chat/TimeStamp";
import { ChatHeader } from "../../component/ui/Chat/ChatHeader";

type Message = {
  id: string;
  sender: "user" | "assistant";
  message: string;
  reading?: string;
  createdAt: string;
};

type Chat = {
  title?: string;
  theme?: string;
  level?: string;
  politeness?: string;
  message: Message[];
};

const ChatPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [displayMode, setDisplayMode] = useState("text");
  const [currentPlayingId, setCurrentPlayingId] = useState<null | string>(null);

  const {
    data: chat,
    // isLoading,
    // error,
  } = useQuery<Chat>({
    queryKey: ["chat", id],
    queryFn: async () => {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json();
    },
  });

  console.log(chat);

  // 音声再生機能（プレースホルダー）
  // const playAudio = (id) => {
  //   setCurrentPlayingId(id);
  //   // 実際の音声再生ロジックをここに実装
  // };

  // const stopAudio = () => {
  //   setCurrentPlayingId(null);
  // };

  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />

      <div className="flex-1 min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50 overflow-hidden">
        {/* Header */}
        {/* <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>

              <div className="space-y-1">
                <div className="flex space-x-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {chat?.title}
                  </h2>
                  <Pen className="w-4 h-4 text-gray-400 hover:text-gray-500 cursor-pointer" />
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {chat?.theme}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {chat?.level}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {chat?.politeness}
                  </span>
                </div>
              </div>
            </div>
            <div className="">
              <button className="border rounded py-1 px-2 bg-green-400 text-white">
                Summary
              </button>
            </div>
          </div>
        </div> */}
        <ChatHeader
          title={chat?.title || ""}
          theme={chat?.theme || ""}
          politeness={chat?.politeness || ""}
          customTheme=""
          level={chat?.level || ""}
          summary={chat?.analysis?.result}
        />

        {/* Chat Content */}
        <div className="h-full overflow-y-auto">
          <div className="flex-1 p-4 lg:p-6 space-y-6 bg-gradient-to-b from-slate-50 to-gray-50">
            {/* Display Mode Toggle */}

            {/* Messages */}
            {chat?.message.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-4 transition-all duration-300 ease-out ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md lg:max-w-2xl transform transition-all duration-300 ${
                    message.sender === "user" ? "order-1" : ""
                  }`}
                >
                  {message.sender === "assistant" && (
                    <AssistantMessageBox
                      text={message.message}
                      reading={message.reading || ""}
                      id={index}
                    />
                  )}
                  {message.sender === "user" && (
                    <UserMessageBox id={index} text={message.message} />
                  )}
                  <TimeStamp time={message.createdAt} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
