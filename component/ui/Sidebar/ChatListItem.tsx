import React, { useMemo, useCallback } from "react";
import { Ellipsis } from "lucide-react";
import { ChatDataType } from "../../../types/types";
import { ChatItemMenu } from "./ChatItemMenu";
import {
  Coffee,
  Briefcase,
  Plane,
  BookOpen,
  Users,
  MessageCircle,
} from "lucide-react";
import themes from "../../../data/themes.json";

interface ChatListItemProps {
  chat: ChatDataType;
  isActive: boolean;
  activeChat: number | null;
  onSelect: (id: number) => void;
  onNavigate: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onCloseMenu: () => void;
}

// Move utility function outside component to prevent recreation on each render
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
  return MessageCircle;
};

const ChatListItemComponent: React.FC<ChatListItemProps> = ({
  chat,
  isActive,
  activeChat,
  onSelect,
  onNavigate,
  onEdit,
  onDelete,
  onCloseMenu,
}) => {
  // Memoize computed values
  const ThemeIcon = useMemo(() => getThemeIcon(chat.theme), [chat.theme]);
  const lastMessage = useMemo(() => {
    return chat.message && chat.message.length > 0
      ? chat.message[chat.message.length - 1]
      : null;
  }, [chat.message]);

  // Memoize event handlers to prevent prop changes
  const handleNavigate = useCallback(() => {
    onNavigate(chat.id);
  }, [onNavigate, chat.id]);

  const handleSelect = useCallback(() => {
    onSelect(chat.id);
  }, [onSelect, chat.id]);

  const handleEdit = useCallback(() => {
    onEdit(chat.id);
  }, [onEdit, chat.id]);

  const handleDelete = useCallback(() => {
    onDelete(chat.id);
  }, [onDelete, chat.id]);

  return (
    <div
      className={`
        p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group
        ${isActive ? "!bg-gray-200" : ""}
      `}
    >
      <div className="relative flex gap-2 items-center">
        {/* Theme Icon */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"
          onClick={handleNavigate}
        >
          <ThemeIcon className="w-4 h-4 text-green-600" />
        </div>
        <div className="flex-1 min-w-0" onClick={handleNavigate}>
          <div className="text-xs font-small text-gray-900 truncate">
            {chat.title}
          </div>
          {lastMessage && (
            <div className="text-xs text-gray-500 mt-1 truncate">
              {lastMessage.message}
            </div>
          )}
        </div>
        <Ellipsis
          onClick={handleSelect}
          className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0 cursor-pointer"
        />
        <ChatItemMenu
          chatId={chat.id}
          activeChat={activeChat}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={onCloseMenu}
        />
      </div>
    </div>
  );
};

ChatListItemComponent.displayName = "ChatListItem";

export const ChatListItem = React.memo(ChatListItemComponent);
