/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/noticias',
  assetPrefix: '/noticias/',
  images: {
    unoptimized: true,
    domains: ['socialrankbolivia.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://socialrankbolivia.com/noticias/api',
  },
}
