/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/wishlist',
        permanent: true,
      },
    ]
  },
  i18n: {
    locales: ['pl', 'en'],
    defaultLocale: 'pl',
  },
}

module.exports = nextConfig
