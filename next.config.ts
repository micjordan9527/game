import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  outputFileTracingRoot: process.cwd(),
  images: {
    unoptimized: true,
  },
}

export default nextConfig
