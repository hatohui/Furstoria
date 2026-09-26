import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 is the next/image default; 95 is ART_QUALITY (src/config/images.ts).
    qualities: [75, 95],
  },
};

export default nextConfig;
