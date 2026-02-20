module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'fr', 'de', 'tr', 'ar', 'ru', 'fa', 'id', 'fil', 'tk', 'tg'],
      localeDetection: false,
    },
    fallbackLng: {
      default: ['en'],
    },
    debug: process.env.NODE_ENV === 'development',
  }