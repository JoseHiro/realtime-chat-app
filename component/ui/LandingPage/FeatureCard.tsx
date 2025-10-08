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
  <div className="group bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-100/50 cursor-pointer">
    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
    <div className="text-sm text-green-600 font-medium">{highlight}</div>
  </div>
);
