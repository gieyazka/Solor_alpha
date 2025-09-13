import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/chunks\/.*\.js$/, /.*\.map$/, /.*\.DS_Store$/],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig, {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true }, // เร่ง build (ถ้ายอมได้)
  typescript: { ignoreBuildErrors: true },
});
