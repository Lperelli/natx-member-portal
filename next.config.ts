/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/natx-member-portal',
  assetPrefix: '/natx-member-portal',
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.prod.website-files.com',
          pathname: '/**'
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**'
        }
      ]
    }
};

export default nextConfig;

