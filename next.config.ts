import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'svjyotpjadysumotgwwy.supabase.co',
      },
    ],
  },
}

export default nextConfig
