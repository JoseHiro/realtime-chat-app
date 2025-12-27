import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../../component/ui/Sidebar";

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
  english?: string;
};

type Chat = {
  id: number;
  title?: string;
  theme?: string;
  level?: string;
  politeness?: string;
  characterName?: string;
  message: Message[];
  analysis?: {
    result?: string;
    // Add other fields if needed
  };
};

const ChatPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: chat } = useQuery<Chat>({
    queryKey: ["chat", id],
    queryFn: async () => {
      const res = await fetch(`/api/chats/${id}`);
      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json();
    },
    enabled: !!id,
  });

  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />

      <div className="flex-1 min-h-screen flex flex-col bg-gray-50 overflow-hidden">
        {/* Header */}
        <ChatHeader
          id={typeof id === "string" ? id : undefined}
          title={chat?.title || ""}
          theme={chat?.theme || ""}
          politeness={chat?.politeness || ""}
          customTheme=""
          level={chat?.level || ""}
          analysis={chat?.analysis?.result}
          characterName={chat?.characterName}
        />

        {/* Chat Content */}
        <div className="h-full overflow-y-auto">
          <div className="flex-1 p-4 lg:p-6 space-y-6">
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
                      english={message.english || ""}
                      id={index}
                    />
                  )}
                  {message.sender === "user" && (
                    <UserMessageBox
                      id={index}
                      text={message.message}
                      reading={message.reading || undefined}
                    />
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
