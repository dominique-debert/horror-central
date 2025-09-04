import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.igdb.com",
      },
    ],
    // Disable optimization to avoid remote fetch failures in dev
    unoptimized: true,
  },
};

export default nextConfig;
