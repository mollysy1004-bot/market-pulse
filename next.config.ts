import type { NextConfig } from "next";

// GITHUB_PAGES=1 builds a static copy for github.io, which opens in mainland
// China where the Vercel deployment does not. Vercel builds without it.
const githubPages = process.env.GITHUB_PAGES === "1";

const nextConfig: NextConfig = {
  // The floating dev badge overlaps page content in the bottom-left corner.
  devIndicators: false,
  ...(githubPages && {
    output: "export",
    basePath: "/market-pulse",
    trailingSlash: true,
  }),
};

export default nextConfig;
