import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: ["@ots/ui", "@ots/domain", "@ots/db"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
