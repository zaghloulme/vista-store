/**
 * Next.js Proxy
 * Handles locale detection and routing
 */

import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export const proxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always use locale prefix in URL
})

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
