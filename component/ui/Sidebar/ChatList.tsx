import React from "react";
import { ChatDataType } from "../../../types/types";
import { ChatListItem } from "./ChatListItem";

interface ChatListProps {
  chats: ChatDataType[];
  activeChatId: number | null;
  activeChat: number | null;
  onSelectChat: (id: number) => void;
  onNavigate: (id: number) => void;
  onEditChat: (id: number) => void;
  onDeleteChat: (id: number) => void;
  onCloseMenu: () => void;
  searchTerm: string;
}

const ChatListComponent: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  activeChat,
  onSelectChat,
  onNavigate,
  onEditChat,
  onDeleteChat,
  onCloseMenu,
  searchTerm,
}) => {
  if (!chats || chats.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-8">
        {searchTerm ? "No chats found" : "No chats"}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {chats.map((chat: ChatDataType) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={activeChatId === chat.id}
          activeChat={activeChat}
          onSelect={onSelectChat}
          onNavigate={onNavigate}
          onEdit={onEditChat}
          onDelete={onDeleteChat}
          onCloseMenu={onCloseMenu}
        />
      ))}
    </div>
  );
};

ChatListComponent.displayName = "ChatList";

export const ChatList = React.memo(ChatListComponent);
