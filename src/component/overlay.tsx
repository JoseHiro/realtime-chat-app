import React from "react";

type OverlayProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Overlay: React.FC<OverlayProps> = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 backdrop-blur-sm"
      onClick={onClose} // 背景クリックで閉じる
    >
      <div
        className="bg-white bg-opacity-90 rounded-xl shadow-lg max-w-[80%]w-full max-h-[80vh] p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 中身クリックで閉じないようにする
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
