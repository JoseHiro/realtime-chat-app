import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.squarespace-cdn.com"],
  },
  reactStrictMode: true,
  allowedDevOrigins: [
    "https://95f970872170.ngrok-free.app",
    "https://realtime-chat-app-five-steel.vercel.app",
  ],
};

export default nextConfig;
