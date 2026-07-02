import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote hero images (e.g. Supabase Storage, Unsplash). Add your
    // own hostnames here as needed.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
