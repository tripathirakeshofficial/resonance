import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "turbo-xylophone-jgx9prvxpvvf57q7-3000.app.github.dev"],
    },
  },
  devIndicators: false,
};

export default withBundleAnalyzer(nextConfig);
