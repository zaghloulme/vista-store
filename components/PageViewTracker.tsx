/**
 * Page View Tracker
 * Tracks page views using Google Tag Manager
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics/tracking'

export function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

      trackEvent('page_view', {
        page_path: pathname,
        page_url: url,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}
