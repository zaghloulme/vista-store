/**
 * Root Layout
 * Provides i18n context and global styles
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { GoogleTagManager } from '@next/third-parties/google'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { locales, localeDirections } from '@/i18n/config'
import { PageViewTracker } from '@/components/PageViewTracker'
import CookieConsent from '@/components/CookieConsent'
import '../globals.css'

// Configure Inter font from Google Fonts with fallback
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const gtmId = process.env.NEXT_PUBLIC_GTM_ID

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure locale is valid
  if (!(locales as readonly string[]).includes(locale)) {
    notFound()
  }

  const direction = localeDirections[locale as keyof typeof localeDirections]
  const messages = await getMessages()

  return (
    <html lang={locale} dir={direction} className={inter.variable}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className={inter.className}>
        {gtmId && (
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
        )}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <CookieConsent />
      </body>
    </html>
  )
}
