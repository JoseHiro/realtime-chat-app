import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.squarespace-cdn.com"],
  },
  reactStrictMode: true,
  allowedDevOrigins: [
    "https://fd7ac7492bc9.ngrok-free.app",
  ],
};

export default nextConfig;
