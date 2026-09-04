import type { NextConfig } from "next"

const isGitHubPages = process.env.GITHUB_PAGES === "true"

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  outputFileTracingRoot: process.cwd(),
  basePath: isGitHubPages ? "/game" : "",
  assetPrefix: isGitHubPages ? "/game/" : "",
  env: {
    NEXT_PUBLIC_SITE_BASE_PATH: isGitHubPages ? "/game" : "",
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
