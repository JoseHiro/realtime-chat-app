import React from "react";

export const FeatureCard = ({
  icon,
  title,
  description,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
}) => (
  <div className="group bg-white p-8 rounded-xl border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-lg cursor-pointer">
    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300 text-gray-700 group-hover:text-white">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
    <p className="text-gray-600 mb-6 leading-relaxed text-base">{description}</p>
    <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{highlight}</div>
  </div>
);
