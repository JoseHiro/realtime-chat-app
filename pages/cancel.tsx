import React from "react";
import Link from "next/link";

const Cancel = () => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg text-center">
      <div className="text-red-600 text-6xl mb-4">❌</div>
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-6">Your payment was cancelled.</p>
      <Link 
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        Try Again
      </Link>
    </div>
  );
};

export default Cancel;
