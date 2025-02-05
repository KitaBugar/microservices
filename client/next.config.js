/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['ts','tsx'],
  images: { unoptimized: true },
};

module.exports = nextConfig;
