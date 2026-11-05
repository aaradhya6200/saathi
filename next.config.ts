import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle, only for the Docker image (the Dockerfile sets
  // NEXT_OUTPUT). AWS Amplify builds the normal output.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  // Pin the project root (a package-lock.json higher up would otherwise be picked).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
