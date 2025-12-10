'use client'

/**
 * Sanity Studio Route
 * This page renders the Sanity Studio at /studio
 * Uses optional catch-all routing to handle all studio sub-routes
 */

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
