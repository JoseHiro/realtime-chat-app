import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Volume2,
  VolumeX,
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
  Menu,
  SquarePenIcon,
  X,
  ChevronLeft,
  ChevronRight,
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
    creditsRemaining,
  } = useSpeech();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Sidebar state: collapsed for desktop, closed for mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapsed state
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile open state

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
    router.push("/new");
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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative
          top-0 left-0
          h-full
          border-r border-gray-300
          bg-white/40 backdrop-blur-xl
          shadow-[2px_0_8px_rgba(0,0,0,0.04)]
          z-40
          transition-all duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isCollapsed ? "lg:w-20" : "w-80"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with Toggle */}
          <div
            className={`
            flex items-center border-b border-gray-200
            ${isCollapsed ? "justify-center p-2" : "justify-between p-4"}
          `}
          >
            {!isCollapsed && <SidebarAppName onClick={handleGoToSelectMode} />}
            <div className="flex items-center gap-2">
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden p-4 lg:p-6">
            {/* New Chat Button */}
            <button
              onClick={() => handleGoToSelectMode()}
              className={`
                flex items-center gap-3 p-4 rounded-xl bg-white text-gray-600 mb-4 hover:bg-gray-100 transition-all duration-200 shadow-sm border border-gray-200 cursor-pointer
                ${
                  isCollapsed
                    ? "justify-center border-none shadow-none px-2 py-2"
                    : ""
                }
              `}
              title={isCollapsed ? "New Chat" : ""}
            >
              <SquarePenIcon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>New Chat</span>}
            </button>

            {/* Search Bar */}
            {!isCollapsed && (
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
            )}

            {/* Chat List - Hidden when collapsed */}
            {!isCollapsed && (
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
                          className={`
                            p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group
                            ${
                              Number(router.query.id) === chat.id
                                ? "!bg-gray-200"
                                : ""
                            }
                          `}
                        >
                          <div className="relative flex gap-2 items-center">
                            {/* Theme Icon */}
                            <div
                              className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"
                              onClick={() => {
                                router.push(`/chats/${chat.id}`);
                                setIsMobileOpen(false);
                              }}
                            >
                              <ThemeIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <div
                              className="flex-1 min-w-0"
                              onClick={() => {
                                router.push(`/chats/${chat.id}`);
                                setIsMobileOpen(false);
                              }}
                            >
                              <div className="text-xs font-small text-gray-900 truncate">
                                {chat.title}
                              </div>
                              {chat.message.length > 0 && (
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  {
                                    chat.message[chat.message.length - 1]
                                      .message
                                  }
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
            )}

            {/* Collapsed State - Empty space with expand hint */}
            {isCollapsed && (
              <div className="flex-1 flex items-center justify-center px-2">
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  title="Expand sidebar to see chats"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            )}

            {/* User Info Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div
                className={`
                  flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-50
                  ${isCollapsed ? "justify-center bg-transparent" : ""}
                `}
              >
                <div
                  className={`
                    rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                    ${isCollapsed ? "w-10 h-10" : "w-10 h-10"}
                    ${subscriptionPlan === "pro" ? "bg-black" : "bg-gray-400"}
                  `}
                  title={isCollapsed ? username || "User" : ""}
                >
                  {username ? (
                    username.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                {!isCollapsed && (
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
                      {subscriptionPlan
                        ? `${
                            subscriptionPlan.charAt(0).toUpperCase() +
                            subscriptionPlan.slice(1)
                          } plan`
                        : "No plan"}
                    </p>
                    {subscriptionPlan && (subscriptionPlan === "pro" || subscriptionPlan === "premium") && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {creditsRemaining} credits
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className={`flex gap-2 ${isCollapsed ? "flex-col" : ""}`}>
                <button
                  onClick={() => {
                    router.push("/settings");
                    setIsMobileOpen(false);
                  }}
                  className={`
                    cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors
                    ${isCollapsed ? "w-full" : "flex-1"}
                  `}
                  title={isCollapsed ? "Settings" : ""}
                >
                  <Settings className="w-4 h-4" />
                  {!isCollapsed && (
                    <span className="text-xs font-medium">Settings</span>
                  )}
                </button>
                <button
                  onClick={() => handleSetMuted()}
                  className={`
                    cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg transition-colors
                    ${isCollapsed ? "w-full" : "flex-1"}
                    ${
                      isMuted
                        ? "text-red-600 bg-red-50 border border-red-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                  title={isCollapsed ? (isMuted ? "Muted" : "Sound") : ""}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  {!isCollapsed && (
                    <span className="text-xs font-medium">
                      {isMuted ? "Muted" : "Sound"}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
