/**
 * Sanity Client Configuration
 */

import { createClient } from '@sanity/client'

// Use placeholder values during build if not configured
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

// Helper for generating image URLs
// Lazy-load imageUrlBuilder to avoid Turbopack CommonJS interop issues
//eslint-disable-next-line @typescript-eslint/no-explicit-any
let builder: any = null

export function urlForImage(source: unknown) {
  if (!source) return null

  // Lazy initialize builder on first use
  if (!builder) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const imageUrlBuilder = require('@sanity/image-url')
    builder = imageUrlBuilder(sanityClient)
  }

  return builder.image(source)
}
