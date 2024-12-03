import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.contentstack.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wiki.leagueoflegends.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },

  async rewrites() {
    return {
      beforeFiles: [
        // Handle static assets without locale prefix
        {
          source: '/:locale/images/:path*',
          destination: '/images/:path*',
        },
        {
          source: '/images/:path*',
          destination: '/images/:path*',
        },
      ],
      afterFiles: [
        // Rewrite API routes
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
