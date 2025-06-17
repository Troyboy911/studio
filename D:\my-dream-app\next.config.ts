
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add allowedDevOrigins to address the cross-origin warning in development
  devIndicators: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1749782754499.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
