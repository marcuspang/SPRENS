/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com']
  },
  webpack: (config, { isServer }) => {
    // Add fallback for 'buffer' module
    if (!isServer) {
      config.resolve.fallback = {
        buffer: require.resolve('buffer')
      };
    }

    return config;
  },
  env: {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID
  }
};

module.exports = nextConfig;
