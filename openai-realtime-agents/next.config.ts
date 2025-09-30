import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for Cloudflare Pages with full-stack support
  experimental: {
    // Enable experimental features as needed
  },
  
  // Disable webpack cache for Cloudflare deployment to avoid large files
  webpack: (config, { isServer }) => {
    if (process.env.CF_PAGES) {
      config.cache = false;
    }
    return config;
  },
  
  // Image optimization settings for Cloudflare
  images: {
    unoptimized: true, // Disable Next.js image optimization for Cloudflare
  },
  
  // Environment variables
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  
  // Configure output for Cloudflare Pages with server support
  output: process.env.CF_PAGES ? undefined : 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
