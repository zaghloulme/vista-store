/**
 * Sanity Client Configuration
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url/lib/types/builder'

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
const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: unknown) {
  if (!source) return null
  return builder.image(source)
}
