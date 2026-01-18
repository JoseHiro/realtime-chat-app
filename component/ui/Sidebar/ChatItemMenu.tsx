import React, { useRef, useEffect, useCallback } from "react";
import { Edit2, Trash2 } from "lucide-react";

interface ChatItemMenuProps {
  chatId: number;
  activeChat: number | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ChatItemMenuComponent: React.FC<ChatItemMenuProps> = ({
  chatId,
  activeChat,
  onEdit,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleEditClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onEdit();
    },
    [onEdit]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDelete();
    },
    [onDelete]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (activeChat === chatId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeChat, chatId, onClose]);

  if (activeChat !== chatId) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-7 border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px] bg-white"
    >
      <button
        onClick={handleEditClick}
        className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Edit2 className="w-3 h-3" />
        Edit name
      </button>
      <button
        onClick={handleDeleteClick}
        className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </button>
    </div>
  );
};

ChatItemMenuComponent.displayName = "ChatItemMenu";

export const ChatItemMenu = React.memo(ChatItemMenuComponent);
