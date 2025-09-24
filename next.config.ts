import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.squarespace-cdn.com"],
  },
  reactStrictMode: true,
  allowedDevOrigins: [
    "https://c5b4064da4d8.ngrok-free.app",
    "https://realtime-chat-app-five-steel.vercel.app",
  ],
};

export default nextConfig;
