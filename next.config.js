/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

module.exports = {
  // webpack5: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/wishlist',
        permanent: true,
      },
    ]
  },
  i18n,
}
