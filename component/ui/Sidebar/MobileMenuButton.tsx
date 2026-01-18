import React from "react";
import { Menu } from "lucide-react";

interface MobileMenuButtonProps {
  isMobileOpen: boolean;
  onOpen: () => void;
}

const MobileMenuButtonComponent: React.FC<MobileMenuButtonProps> = ({
  isMobileOpen,
  onOpen,
}) => {
  if (isMobileOpen) return null;

  return (
    <button
      onClick={onOpen}
      className="lg:hidden fixed top-4 cursor-pointer left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      aria-label="Open sidebar"
    >
      <Menu className="w-5 h-5 text-gray-700" />
    </button>
  );
};

MobileMenuButtonComponent.displayName = "MobileMenuButton";

export const MobileMenuButton = React.memo(MobileMenuButtonComponent);
