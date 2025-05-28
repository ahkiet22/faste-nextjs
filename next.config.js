/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST
  }
}

module.exports = nextConfig
