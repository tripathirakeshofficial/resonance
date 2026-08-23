import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000',
        'turbo-xylophone-jgx9prvxpvvf57q7-3000.app.github.dev',],
    },
  },
  devIndicators: false,
};

export default nextConfig;
