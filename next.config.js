/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'my-cove.s3.ca-central-1.amazonaws.com',
        port: '',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
    ],
  },
}

module.exports = nextConfig
