import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // Add other image domains as needed
    ],
  },
  // Uncomment if using experimental features
  // experimental: {
  //   serverActions: true,
  // },
};

export default nextConfig;
