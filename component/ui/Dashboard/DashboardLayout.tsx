import React from "react";
// import { Sidebar } from "../Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="relative w-full min-h-screen">
      {/* <Sidebar /> */}
      <div className="bg-white dark:bg-gray-950 min-h-screen overflow-auto w-full">
        <div className="max-w-6xl mx-auto px-4 pb-8">{children}</div>
      </div>
    </div>
  );
};
