import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "http://localhost:8000/docs",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
