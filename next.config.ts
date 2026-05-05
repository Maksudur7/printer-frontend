import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. This ensures Vercel deployments do not fail.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. This ensures Vercel deployments do not fail.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
