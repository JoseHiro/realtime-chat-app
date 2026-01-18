import React, { useCallback } from "react";
import { Search } from "lucide-react";

interface SidebarSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SidebarSearchComponent: React.FC<SidebarSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
      />
    </div>
  );
};

SidebarSearchComponent.displayName = "SidebarSearch";

export const SidebarSearch = React.memo(SidebarSearchComponent);
