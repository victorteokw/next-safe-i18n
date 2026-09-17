# Next Safe I18n

Safe and modern i18n for Next.js

## Installation

```sh
npm install next-safe-i18n
```

## Usage

Create an i18n file like this.

```typescript
import { createI18n } from 'next-safe-i18n/i18n'
import en from './en.json'
import 'server-only'

const dictionaries = {
  en: import('./en.json'),
  'zh-cn': import('./zh-cn.json'),
  'zh-tw': import('./zh-tw.json'),
}

export type Locale = keyof typeof dictionaries

export type Dictionary = typeof en

const i18n = createI18n<Locale, Dictionary>({
  defaultLocale: 'en',
  locales: ['en', 'zh-cn', 'zh-tw'],
  dictionaries
})

export default i18n
```

Add this to your proxy file.

```typescript
import i18n from "./i18n"

export const proxy = i18n.createProxy()

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon|apple-touch|images).*)"],
}

```

In your `page.tsx`, add this:

```typescript
import { Props } from 'next-safe-i18n'
import i18n, { Locale } from '@/i18n'

export default async function Page({ params }: Props<Locale>) {
  const { locale, dictionary } = await i18n.fetchLocaleAndDictionary(params)
  return <></>
}
```
