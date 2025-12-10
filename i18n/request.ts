/**
 * next-intl Request Configuration
 * Configures i18n for server components
 */

import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, defaultLocale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from request or use default
  let locale = await requestLocale

  // If no locale provided, use default
  if (!locale) {
    locale = defaultLocale
  }

  // Ensure locale is valid
  if (!(locales as readonly string[]).includes(locale)) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
