/**
 * Google Tag Manager Event Tracking
 * Utilities for tracking custom events
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * Push custom event to Google Tag Manager
 */
export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    })
  }
}

/**
 * Track button click event
 */
export function trackButtonClick(buttonName: string, additionalData?: Record<string, unknown>) {
  trackEvent('button_click', {
    button_name: buttonName,
    ...additionalData,
  })
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, additionalData?: Record<string, unknown>) {
  trackEvent('form_submit', {
    form_name: formName,
    ...additionalData,
  })
}

/**
 * Track link click (external)
 */
export function trackExternalLink(url: string, linkText?: string) {
  trackEvent('external_link_click', {
    link_url: url,
    link_text: linkText,
  })
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultCount?: number) {
  trackEvent('search', {
    search_query: query,
    result_count: resultCount,
  })
}

/**
 * Track content view
 */
export function trackContentView(contentType: string, contentId: string, contentTitle?: string) {
  trackEvent('content_view', {
    content_type: contentType,
    content_id: contentId,
    content_title: contentTitle,
  })
}

/**
 * Track scroll depth
 */
export function trackScrollDepth(percentage: number) {
  trackEvent('scroll_depth', {
    scroll_percentage: percentage,
  })
}

/**
 * Track video interaction
 */
export function trackVideo(action: 'play' | 'pause' | 'complete', videoId: string, videoTitle?: string) {
  trackEvent('video_interaction', {
    video_action: action,
    video_id: videoId,
    video_title: videoTitle,
  })
}

/**
 * Track e-commerce events
 */
export function trackEcommerce(action: string, data: Record<string, unknown>) {
  trackEvent(`ecommerce_${action}`, data)
}
