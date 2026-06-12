import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://backend-hvbb.onrender.com/api/:path*',
      },
    ]
  },
};

export default nextConfig;
