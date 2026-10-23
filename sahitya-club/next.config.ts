import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/writing/submit",
        destination: "/member-portal/writings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
