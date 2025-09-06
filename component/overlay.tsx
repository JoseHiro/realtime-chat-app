import React from "react";
import { startStripeSession } from "../lib/stripe/startSession";
import { CircleX } from "lucide-react";

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
        className="relative bg-white rounded-xl shadow-xl border border-gray-200 max-w-[80%] w-full max-h-[80vh] p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute rounded text-gray-400 hover:text-black transition top-3 right-3 z-100"
        >
          <CircleX />
        </button>
        {children}
      </div>
    </div>
  );
};

export const BlockUseOverlay = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-400/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full text-center">
        <h2 className="text-xl text-green-400 font-bold mb-1">
          {"Let's start your next chat!"}
        </h2>
        <p className="mb-6 text-gray-400">Please subscribe to continue.</p>
        <button
          onClick={() => startStripeSession()}
          className="cursor-pointer px-4 py-2 bg-green-400 rounded-xl hover:bg-gray-300"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};
