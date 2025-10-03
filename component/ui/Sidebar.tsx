import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Volume2,
  VolumeX,
  Plus,
  Settings,
  Edit2,
  Ellipsis,
  Trash2,
} from "lucide-react";
import { ChatDataType } from "../../type/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSpeech } from "../../context/SpeechContext";
import { apiRequest } from "../../lib/apiRequest";
import { SidebarAppName } from "./AppName";
import { toast } from "sonner";

export const Sidebar = () => {
  const { setChatMode, setChatEnded, setChatId, setIsMuted, isMuted } =
    useSpeech();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setActiveChat(null);
      }
    };

    if (activeChat) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeChat]);

  const { data } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const data = await apiRequest("/api/chats/get");
      if (!data) throw new Error("Failed to fetch chats");
      return data;
    },
  });

  // Sample data for demonstration
  const handleSelectChat = (id: number) => {
    setActiveChat((prev) => {
      return prev === id ? null : id;
    });
  };

  const handleDeleteChat = async (id: number) => {
    if (id === null) return;

    try {
      const response = await apiRequest("/api/chat/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
        }),
      });

      if (response) {
        toast.success("Chat deleted successfully ✅");
        setActiveChat(null);
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoToSelectMode = () => {
    setChatMode(false);
    setChatEnded(false);
    setChatId(null);
    router.push("/chat");
  };

  const handleSetMuted = () => {
    setIsMuted(!isMuted);
    toast(isMuted ? "Unmuted mode" : "Muted mode", {
      duration: 2000,
      position: "top-center",
    });
  };

  return (
    <div className="hidden lg:flex w-80 border-r h-full border-gray-200 shadow-sm bg-white/15 backdrop-blur-xl">
      <div className="flex flex-col w-full p-6">
        <SidebarAppName onClick={handleGoToSelectMode} />

        <button
          onClick={() => handleGoToSelectMode()}
          className=" cursor-pointer flex items-center gap-3 p-4 rounded-xl bg-green-500 text-white mb-4 hover:bg-green-600 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>

        <div className="flex-1 space-y-1 overflow-y-auto">
          <p className="text-gray-400">Chats</p>
          {!data?.chats || (0 && data.chats.length === 0) ? (
            <div className="text-center text-gray-400 text-sm py-8">
              No chats
            </div>
          ) : (
            <div className="space-y-1">
              {data?.chats.map((chat: ChatDataType) => (
                <div
                  key={chat.id}
                  className={`p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group ${
                    Number(router.query.id) === chat.id ? "!bg-gray-200" : ""
                  }`}
                >
                  <div className="relative flex gap-1 items-center">
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => router.push(`/chats/${chat.id}`)}
                    >
                      <div className="text-xs font-small text-gray-900 truncate">
                        {chat.title}
                      </div>
                      {chat.message.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {chat.message[chat.message.length - 1].message}
                        </div>
                      )}
                    </div>
                    <Ellipsis
                      onClick={() => handleSelectChat(chat.id)}
                      className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0"
                    />
                    {activeChat === chat.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit name
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.id);
                          }}
                          className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex">
          <button
            onClick={() => router.push("/setting")}
            className="cursor-pointer flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            {/* 設定 */}
          </button>
          <button
            onClick={() => handleSetMuted()}
            className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg transition-colors ${
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
          </button>
        </div>
      </div>
    </div>
  );
};
