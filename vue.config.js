// vue.config.js
module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'no',             // The locale of project localization
      fallbackLocale: 'en',     // The fallback locale of project localization
      localeDir: 'locales',     // The directory where store localization messages of project
      enableInSFC: false        // Enable locale messages in Single file components
    }
  }
}
