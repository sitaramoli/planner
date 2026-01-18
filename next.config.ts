import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  compress: true,
};

export default nextConfig;
