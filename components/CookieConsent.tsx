'use client'

/**
 * Cookie Consent Component
 * Implements Google Consent Mode v2 for GDPR compliance
 */

import { useEffect, useState, useCallback } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(() => {
    // Only check on client side
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('cookie-consent')
    }
    return false
  })
  const [gtmId] = useState<string | null>(process.env.NEXT_PUBLIC_GTM_ID || null)

  const updateConsent = useCallback((preferences: {
    analytics: boolean
    marketing: boolean
    preferences: boolean
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        ad_user_data: preferences.marketing ? 'granted' : 'denied',
        ad_personalization: preferences.marketing ? 'granted' : 'denied',
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        functionality_storage: preferences.preferences ? 'granted' : 'denied',
        personalization_storage: preferences.preferences ? 'granted' : 'denied',
      })
    }
  }, [])

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')

    // Initialize Google Consent Mode with default denied state
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag(...args) {
        window.dataLayer?.push(args as unknown as Record<string, unknown>)
      }

      window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted', // Always granted for security
      })

      // Apply saved consent if exists
      if (consent) {
        const preferences = JSON.parse(consent)
        updateConsent(preferences)
      }
    }
  }, [updateConsent])

  const acceptAll = () => {
    const preferences = {
      analytics: true,
      marketing: true,
      preferences: true,
    }
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    updateConsent(preferences)
    setShowBanner(false)
  }

  const rejectAll = () => {
    const preferences = {
      analytics: false,
      marketing: false,
      preferences: false,
    }
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    updateConsent(preferences)
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    const preferences = {
      analytics: false,
      marketing: false,
      preferences: false,
    }
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    updateConsent(preferences)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Google Tag Manager - Consent Mode v2 */}
      {gtmId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t-2 border-gray-200 shadow-2xl">
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                🍪 We use cookies
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-blue-600 hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={acceptNecessary}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Necessary Only
              </button>
              <button
                onClick={rejectAll}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
