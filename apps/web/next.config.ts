import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@ots/ui"],
  env: {
    BUILD_TIMESTAMP: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
  },
};

export default nextConfig;
