/**
 * Root Layout
 * Provides i18n context and global styles
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { GoogleTagManager } from '@next/third-parties/google'
import { Inter } from 'next/font/google'
import { locales, localeDirections } from '@/i18n/config'
import { PageViewTracker } from '@/components/PageViewTracker'
import '../globals.css'

// Configure Inter font from Google Fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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

  return (
    <html lang={locale} dir={direction} className={inter.variable}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body className={inter.className}>
        {gtmId && (
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
        )}
        {children}
      </body>
    </html>
  )
}
