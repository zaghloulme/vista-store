/**
 * next-intl Configuration
 * Defines supported locales and configuration for internationalization
 * Vista Store - English only configuration
 */

export const locales = ['en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
}

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
}
