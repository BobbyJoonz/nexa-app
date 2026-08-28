import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: [
    "@nexa/design-tokens",
    "@nexa/i18n",
    "@nexa/illustrations",
    "@nexa/product-content",
    "@nexa/schemas",
    "@nexa/shared-logic"
  ],
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
