import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const withNextIntl = createNextIntlPlugin();

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
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
