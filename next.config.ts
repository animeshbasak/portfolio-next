import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.PORTFOLIO_DEV === '1' ? '.next-dev' : '.next',
}

export default nextConfig
