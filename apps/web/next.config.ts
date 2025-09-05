import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "images.unsplash.com", 
      "images.igdb.com",
      "covers.openlibrary.org",
    ],
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
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
    ],
    // Disable optimization to avoid remote fetch failures in dev
    unoptimized: true,
  },
};

export default nextConfig;
