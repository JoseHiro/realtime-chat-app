import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Volume2,
  VolumeX,
  Plus,
  Settings,
  Edit2,
  Ellipsis,
  Trash2,
  Search,
  User,
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  MessageCircle,
} from "lucide-react";
import { ChatDataType } from "../../type/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSpeech } from "../../context/SpeechContext";
import { apiRequest } from "../../lib/apiRequest";
import { SidebarAppName } from "./AppName";
import { toast } from "sonner";
import themes from "../../data/themes.json";

export const Sidebar = () => {
  const {
    setChatMode,
    setChatEnded,
    setChatId,
    setIsMuted,
    isMuted,
    chatId,
    username,
    subscriptionPlan,
  } = useSpeech();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter chats based on search term
  const filteredChats = useMemo(() => {
    if (!data?.chats || !searchTerm.trim()) {
      return data?.chats || [];
    }
    return data.chats.filter((chat: ChatDataType) =>
      chat.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.chats, searchTerm]);

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
    // If there's an active chat, show warning confirmation
    if (chatId) {
      const confirmed = window.confirm(
        "⚠️ Warning: Leaving this chat will stop the conversation and you won't receive a final summary. Are you sure you want to leave?"
      );
      if (!confirmed) {
        return; // User cancelled, stay on current page
      }
    }

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

  // Map theme IDs to icon components
  const getThemeIcon = (themeId?: string) => {
    const iconMap: Record<string, React.ElementType> = {
      daily: Coffee,
      business: Briefcase,
      travel: Plane,
      culture: BookOpen,
      social: Users,
    };

    if (!themeId) return MessageCircle;

    const theme = themes.find((t) => t.id === themeId);
    if (theme && iconMap[theme.icon]) {
      return iconMap[theme.icon];
    }
    return MessageCircle; // Default icon
  };

  return (
    <div className="hidden lg:flex w-80 border-r h-full border-gray-300 bg-white/40 backdrop-blur-xl shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col w-full p-6">
        <SidebarAppName onClick={handleGoToSelectMode} />
        <button
          onClick={() => handleGoToSelectMode()}
          className="flex items-center gap-3 p-4 rounded-xl bg-green-500 text-white mb-4 hover:bg-green-600 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
          />
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto min-h-0">
          <p className="text-xs font-medium text-gray-400 mb-2">Chats</p>
          {!filteredChats || filteredChats.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">
              {searchTerm ? "No chats found" : "No chats"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredChats.map((chat: ChatDataType) => {
                const ThemeIcon = getThemeIcon(chat.theme);
                return (
                  <div
                    key={chat.id}
                    className={`p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group ${
                      Number(router.query.id) === chat.id ? "!bg-gray-200" : ""
                    }`}
                  >
                    <div className="relative flex gap-2 items-center">
                      {/* Theme Icon */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        <ThemeIcon className="w-4 h-4 text-green-600" />
                      </div>
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
                );
              })}
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                subscriptionPlan === "pro"
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
              }`}
            >
              {username ? (
                username.charAt(0).toUpperCase()
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {username || "User"}
              </p>
              <p
                className={`text-xs mt-0.5 truncate ${
                  subscriptionPlan === "pro"
                    ? "text-yellow-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {subscriptionPlan ? `${subscriptionPlan} plan` : "No plan"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/setting")}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs font-medium">Settings</span>
            </button>
            <button
              onClick={() => handleSetMuted()}
              className={`flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                isMuted
                  ? "text-red-600 bg-red-50 border border-red-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span className="text-xs font-medium">
                {isMuted ? "Muted" : "Sound"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
