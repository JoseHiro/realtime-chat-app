import React from "react";
import { Sidebar } from "../../Sidebar";

const PageLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="relative w-full h-screen flex">
      <Sidebar />
      <div className="bg-gray-50 min-h-screen pt-5 overflow-auto w-full">
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl text-gray-900 mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
