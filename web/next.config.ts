import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  //  Image Optimization
  // ---------------------------------------------------------------------------
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "brixups.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ---------------------------------------------------------------------------
  //  Security & Performance Headers
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
              "connect-src 'self' https://*.supabase.co https://sepolia.base.org https://mainnet.base.org wss://*.supabase.co https://api.circle.com https://withpersona.com",
              "frame-src 'self' https://withpersona.com https://challenges.cloudflare.com https://keys.coinbase.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // ---------------------------------------------------------------------------
  //  Rewrites — clean API proxy routes
  // ---------------------------------------------------------------------------
  async rewrites() {
    return [
      {
        source: "/api/supabase/:path*",
        destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/:path*`,
      },
    ];
  },

  // ---------------------------------------------------------------------------
  //  Experimental Features
  // ---------------------------------------------------------------------------
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // ---------------------------------------------------------------------------
  //  Build Configuration
  // ---------------------------------------------------------------------------
  poweredByHeader: false,
  reactStrictMode: true,

  // Ensure trailing slashes are consistent
  trailingSlash: false,

  // Output standalone for Docker / containerized deployments
  output: "standalone",
};

export default nextConfig;
