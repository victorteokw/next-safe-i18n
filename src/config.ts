type I18nConfig<Locale extends string, Dictionary> = {
  defaultLocale: Locale
  locales: Locale[]
  dictionaries: { [key in Locale]: Promise<{ default: Dictionary }> }
}

export default I18nConfig
