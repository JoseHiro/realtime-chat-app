import React from "react";

type OverlayProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Overlay: React.FC<OverlayProps> = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  bg-opacity-20 backdrop-blur-sm bg-trans"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-[80%] w-full max-h-[80vh] p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="mb-4 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Close
        </button>
        {children}
      </div>
    </div>
  );
};
