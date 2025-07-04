/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    largePageDataBytes: 128 * 100000
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*lh3.googleusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: '*platform-lookaside.fbsbx.com',
        port: '',
        pathname: '**'
      }
    ]
  }
}

module.exports = nextConfig
