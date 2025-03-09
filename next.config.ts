import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Only apply these server-side modules exclusions on the client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Exclude packages that are server-only
        puppeteer: false,
        'puppeteer-core': false,
        'chrome-aws-lambda': false,
        jsdom: false,
      };
    }
    return config;
  },
  // Further restrict allowed packages to be used in Next.js Edge or Serverless functions
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  serverExternalPackages: ['puppeteer', 'puppeteer-core', 'chrome-aws-lambda', 'jsdom'],
  // Make environment variables available to the server
  env: {
    USE_MOCK_SEO: process.env.USE_MOCK_SEO,
=======
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'puppeteer-core', 'chrome-aws-lambda', 'jsdom'],
>>>>>>> Stashed changes
=======
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'puppeteer-core', 'chrome-aws-lambda', 'jsdom'],
>>>>>>> Stashed changes
=======
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'puppeteer-core', 'chrome-aws-lambda', 'jsdom'],
>>>>>>> Stashed changes
  },
};

export default nextConfig;
