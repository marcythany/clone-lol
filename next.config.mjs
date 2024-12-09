import path from 'path';
import { paraglide } from '@inlang/paraglide-next/plugin';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.communitydragon.org',
      },
      {
        protocol: 'https',
        hostname: '**.rgapi.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.rgapi.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@tanstack/react-query',
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Adiciona aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
      '~/components': path.resolve(__dirname, './components'),
      '~/ui': path.resolve(__dirname, './components/ui'),
      '~/lib': path.resolve(__dirname, './lib'),
      '~/utils': path.resolve(__dirname, './lib/utils'),
      '~/types': path.resolve(__dirname, './types'),
      '~/hooks': path.resolve(__dirname, './hooks'),
      '~/i18n': path.resolve(__dirname, './i18n'),
      '~/public': path.resolve(__dirname, './public'),
      '~/messages': path.resolve(__dirname, './messages'),
    };

    return config;
  },
};

export default paraglide({
  paraglide: {
    project: './project.inlang',
    outdir: './paraglide',
  },
  ...nextConfig,
});
