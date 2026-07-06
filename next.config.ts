import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,POST" },
          {
            key: "Access-Control-Allow-Headers",
            value: "x-xsrf-token, Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
