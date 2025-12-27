import React from "react";

export const StepCard = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <div className="text-center group">
    <div className="w-16 h-16 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-900 text-xl font-bold group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-base">{description}</p>
  </div>
);
