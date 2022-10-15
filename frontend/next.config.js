/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['platform.slack-edge.com']
  }
}

module.exports = nextConfig
