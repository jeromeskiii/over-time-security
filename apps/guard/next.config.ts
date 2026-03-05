import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ots/ui", "@ots/domain", "@ots/db"],
};

export default nextConfig;
