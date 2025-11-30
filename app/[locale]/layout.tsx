/**
 * Root Layout
 * Provides i18n context and global styles
 */

import { notFound } from 'next/navigation'
import { GoogleTagManager } from '@next/third-parties/google'
import { locales, localeDirections } from '@/i18n/config'
import { PageViewTracker } from '@/components/PageViewTracker'
import '../globals.css'

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
    <html lang={locale} dir={direction}>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        {gtmId && <PageViewTracker />}
        {children}
      </body>
    </html>
  )
}
