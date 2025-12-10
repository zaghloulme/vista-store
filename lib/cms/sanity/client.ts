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

// Dynamic import for image URL builder to avoid build issues
let builderInstance: any = null

export function urlForImage(source: unknown) {
  if (!source) return null

  // Lazy init builder to avoid import issues
  if (!builderInstance) {
    const { createImageUrlBuilder } = require('@sanity/image-url')
    builderInstance = createImageUrlBuilder(sanityClient)
  }

  return builderInstance.image(source)
}
