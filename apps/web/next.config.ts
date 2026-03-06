import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@ots/ui"],
};

export default nextConfig;
