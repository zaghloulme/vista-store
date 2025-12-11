/**
 * Sanity Client Configuration
 */

import { createClient } from '@sanity/client'
import type { SanityImageSource, ImageUrlBuilder } from '@sanity/image-url'

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

// Image URL builder - using require for package export compatibility
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const { createImageUrlBuilder } = require('@sanity/image-url')
const builder: ImageUrlBuilder = createImageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImageSource) {
  if (!source) return null
  return builder.image(source)
}
