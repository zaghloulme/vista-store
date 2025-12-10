/**
 * Next.js Proxy
 * Handles locale detection and routing
 * For single-locale app, uses 'as-needed' to hide /en prefix
 */

import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true
})

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel`, or `/studio`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
}
