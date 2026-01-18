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
  // Increase API route timeout for long-running operations like summary generation
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  // For Vercel deployment, use route segment config instead
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
