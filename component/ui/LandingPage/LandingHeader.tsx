import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RoundedButton } from "../../shared/button";
import { AppName } from "../AppName";
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
          <AppName />
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-500 hover:text-green-600 transition-colors duration-200"
            >
              Pricing
            </Link>
            <RoundedButton
              onClick={() => router.push("/login")}
              variant="green"
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

export const AuthHeader = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <AppName />
        </div>
      </div>
    </nav>
  );
};
