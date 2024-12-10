import { NextConfig } from 'next'
import { paraglide } from '@inlang/paraglide-next/plugin'

const nextConfig: NextConfig = {
  // Additional Next.js configurations
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
}

export default paraglide({
  paraglide: {
    project: './project.inlang',
    outdir: './paraglide'
  },
  ...nextConfig
})