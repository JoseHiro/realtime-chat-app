import React from "react";
import { Sidebar } from "../Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />
      <div className="bg-gray-50 min-h-screen pt-5 overflow-auto w-full">
        <div className="max-w-6xl mx-auto px-4 pb-8">{children}</div>
      </div>
    </div>
  );
};
