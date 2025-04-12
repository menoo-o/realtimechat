import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove CORS headers unless you add client-side API calls
  async headers() {
    return [];
  },
};

export default nextConfig;