import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { ChevronRight } from "lucide-react";
import { ChatDataType } from "../../type/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSpeech } from "../../context/SpeechContext";
import { apiRequest } from "../../lib/apiRequest";
import { toast } from "sonner";
import { MobileMenuButton } from "./Sidebar/MobileMenuButton";
import { SidebarHeader } from "./Sidebar/SidebarHeader";
import { NewChatButton } from "./Sidebar/NewChatButton";
import { SidebarSearch } from "./Sidebar/SidebarSearch";
import { ChatList } from "./Sidebar/ChatList";
import { UserInfoSection } from "./Sidebar/UserInfoSection";
import { SidebarActions } from "./Sidebar/SidebarActions";

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
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Sidebar state: collapsed for desktop, closed for mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapsed state
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile open state

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

  // Memoize event handlers to prevent unnecessary re-renders
  const handleSelectChat = useCallback((id: number) => {
    setActiveChat((prev) => {
      return prev === id ? null : id;
    });
  }, []);

  const handleDeleteChat = useCallback(
    async (id: number) => {
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
        console.error("Failed to delete chat:", error);
        toast.error("Failed to delete chat. Please try again.");
      }
    },
    [queryClient]
  );

  const handleGoToSelectMode = useCallback(() => {
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
  }, [chatId, setChatMode, setChatEnded, setChatId, router]);

  const handleSetMuted = useCallback(() => {
    setIsMuted(!isMuted);
    toast(isMuted ? "Unmuted mode" : "Muted mode", {
      duration: 2000,
      position: "top-center",
    });
  }, [isMuted, setIsMuted]);

  const handleNavigateToChat = useCallback(
    (id: number) => {
      router.push(`/chats/${id}`);
      setIsMobileOpen(false);
    },
    [router]
  );

  const handleEditChat = useCallback((id: number) => {
    // TODO: Implement edit chat functionality
    console.log("Edit chat:", id);
    setActiveChat(null);
  }, []);

  const handleSettingsClick = useCallback(() => {
    router.push("/settings");
    setIsMobileOpen(false);
  }, [router]);

  const handleCloseMenu = useCallback(() => {
    setActiveChat(null);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleCloseMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleOpenMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const handleExpandSidebar = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const activeChatId = Number(router.query.id) || null;

  return (
    <>
      <MobileMenuButton isMobileOpen={isMobileOpen} onOpen={handleOpenMobile} />

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative
          top-0 left-0
          h-full
          bg-white/40 backdrop-blur-xl
          shadow-[2px_0_8px_rgba(0,0,0,0.04)]
          shadow-lg
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
          <SidebarHeader
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            onToggleCollapse={handleToggleCollapse}
            onCloseMobile={handleCloseMobile}
            onGoToSelectMode={handleGoToSelectMode}
          />

          <div className="flex flex-col flex-1 overflow-hidden p-4 lg:p-6">
            <NewChatButton
              isCollapsed={isCollapsed}
              onClick={handleGoToSelectMode}
            />

            {/* Search Bar */}
            {!isCollapsed && (
              <SidebarSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            )}

            {/* Chat List - Hidden when collapsed */}
            {!isCollapsed && (
              <div className="flex-1 space-y-1 overflow-y-auto min-h-0">
                <p className="text-xs font-medium text-gray-400 mb-2">Chats</p>
                <ChatList
                  chats={filteredChats}
                  activeChatId={activeChatId}
                  activeChat={activeChat}
                  onSelectChat={handleSelectChat}
                  onNavigate={handleNavigateToChat}
                  onEditChat={handleEditChat}
                  onDeleteChat={handleDeleteChat}
                  onCloseMenu={handleCloseMenu}
                  searchTerm={searchTerm}
                />
              </div>
            )}

            {/* Collapsed State - Empty space with expand hint */}
            {isCollapsed && (
              <div className="flex-1 flex items-center justify-center px-2">
                <button
                  onClick={handleExpandSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer"
                  title="Expand sidebar to see chats"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            )}

            {/* User Info Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <UserInfoSection
                username={username}
                subscriptionPlan={subscriptionPlan}
                creditsRemaining={creditsRemaining}
                isCollapsed={isCollapsed}
              />

              <SidebarActions
                isCollapsed={isCollapsed}
                isMuted={isMuted}
                onSettingsClick={handleSettingsClick}
                onMuteToggle={handleSetMuted}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
