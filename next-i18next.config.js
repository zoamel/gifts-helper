const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl'],
    ignoreRoutes: ['/', '/wishlist', '/shopping-list', '/users-search'],
    localePath: path.resolve('./public/locales'),
  },
}
