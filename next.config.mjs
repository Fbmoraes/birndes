/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [],
    remotePatterns: []
  },
  experimental: {
    serverComponentsExternalPackages: []
  },
  output: 'standalone'
}

export default nextConfig


