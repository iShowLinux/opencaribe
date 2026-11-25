import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const packages = [
  '@opencaribe/authentication',
  '@opencaribe/configuration',
  '@opencaribe/database',
  '@opencaribe/geography',
  '@opencaribe/listings',
  '@opencaribe/localization',
  '@opencaribe/search',
  '@opencaribe/ui',
  '@opencaribe/validation',
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: packages,
};

export default createNextIntlPlugin()(nextConfig);
