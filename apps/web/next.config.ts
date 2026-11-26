import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const packages = [
  '@opencaribe/authentication',
  '@opencaribe/configuration',
  '@opencaribe/database',
  '@opencaribe/geography',
  '@opencaribe/listings',
  '@opencaribe/localization',
  '@opencaribe/payments',
  '@opencaribe/search',
  '@opencaribe/ui',
  '@opencaribe/validation',
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: packages,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/photo-**',
      },
    ],
  },
};

export default createNextIntlPlugin()(nextConfig);
