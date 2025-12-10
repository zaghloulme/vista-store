import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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

export default withNextIntl(nextConfig);
