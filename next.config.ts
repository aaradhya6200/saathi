import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image that runs on Cloud Run.
  output: "standalone",
  // Pin the project root (a package-lock.json higher up would otherwise be picked).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
