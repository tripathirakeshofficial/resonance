import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["turbo-xylophone-jgx9prvxpvvf57q7-3000.app.github.dev"],
    },
  },
};

export default nextConfig;
