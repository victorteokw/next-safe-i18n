import { NextRequest, NextResponse } from "next/server"
import { notFound } from 'next/navigation'
import Negotiator from "negotiator"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import I18NConfig from "./config"

export type I18n<Locale extends string, Dictionary> = {
  createProxy(proxy?: (request: NextRequest) => (NextResponse | undefined) | undefined): (request: NextRequest) => NextResponse
  fetchLocale(params: Params<Locale>): Promise<Locale>
  fetchLocaleAndDictionary(params: Params<Locale>): Promise<{ locale: Locale, dictionary: Dictionary }>
}

export type Params<Locale> = Promise<{
  lang: Locale
}>

export function createI18n<Locale extends string, Dictionary>(config: I18NConfig<Locale, Dictionary>): I18n<Locale, Dictionary> {
  return {
    createProxy(proxy: (request: NextRequest) => NextResponse | undefined = emptyProxy) {
      return (request: NextRequest) => {
        const pathname = request.nextUrl.pathname
        const pathnameIsMissingLocale = config.locales.every(
          (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
        )
        if (pathnameIsMissingLocale) {
          const locale = getLocale(request, config.locales, config.defaultLocale)
          return NextResponse.redirect(
            new URL(
              `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
              request.url,
            ),
          )
        } else {
          return proxy(request) || NextResponse.next({
            request: {
              headers: request.headers
            }
          })
        }
      }
    },
    async fetchLocale(params: Params<Locale>) {
      const { lang } = await params
      return lang
    },
    async fetchLocaleAndDictionary(params: Params<Locale>) {
      const locale = await this.fetchLocale(params)
      if (locale in config.dictionaries) {
        return {
          locale,
          dictionary: (await config.dictionaries[locale]).default
        }
      } else {
        notFound()
      }
    }
  }
}

function emptyProxy(request: NextRequest): NextResponse {
  return NextResponse.next({
    request: {
      headers: request.headers
    }
  })
}

function getLocale(request: NextRequest, locales: string[], defaultLocale: string): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  )
  return matchLocale(languages, locales, defaultLocale)
}
