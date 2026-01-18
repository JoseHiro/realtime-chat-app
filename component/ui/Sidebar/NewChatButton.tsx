import React from "react";
import { SquarePenIcon } from "lucide-react";

interface NewChatButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

const NewChatButtonComponent: React.FC<NewChatButtonProps> = ({
  isCollapsed,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 p-4 rounded-xl text-gray-600 mb-4 transition-all duration-200 shadow-xs border border-gray-200 cursor-pointer
        ${
          isCollapsed
            ? "justify-center border-none shadow-none px-2 py-2 text-gray-600 hover:text-gray-600"
            : "bg-white hover:bg-gray-100"
        }
      `}
      title={isCollapsed ? "New Chat" : ""}
    >
      <SquarePenIcon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span>New Chat</span>}
    </button>
  );
};

NewChatButtonComponent.displayName = "NewChatButton";

export const NewChatButton = React.memo(NewChatButtonComponent);
