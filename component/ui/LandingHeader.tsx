import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RoundedButton } from "../button";
import Link from "next/link";

export const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-white/80 backdrop-blur-md"
      } border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">日</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Kaiwa AI Demo
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              How it Works
            </a>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              Pricing
            </Link>
            <RoundedButton
              onClick={() => router.push("/login")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Start Learning
            </RoundedButton>
          </div>

          <button className="md:hidden p-2">
            <div className="w-6 h-0.5 bg-gray-600 mb-1.5 transition-all duration-200"></div>
            <div className="w-6 h-0.5 bg-gray-600 mb-1.5 transition-all duration-200"></div>
            <div className="w-6 h-0.5 bg-gray-600 transition-all duration-200"></div>
          </button>
        </div>
      </div>
    </nav>
  );
};
