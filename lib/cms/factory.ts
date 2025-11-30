/**
 * CMS Factory
 * Selects and instantiates the appropriate CMS service based on environment configuration
 */

import type { CMSService } from './types'
import { SanityService } from './sanity/service'
import { PayloadService } from './payload/service'

/**
 * Get the configured CMS service instance
 * The CMS provider is determined by the CMS_PROVIDER environment variable
 */
export function getCMSService(): CMSService {
  const provider = process.env.CMS_PROVIDER || 'sanity'

  switch (provider.toLowerCase()) {
    case 'sanity':
      return new SanityService()
    case 'payload':
      return new PayloadService()
    default:
      console.warn(
        `Unknown CMS provider "${provider}". Falling back to Sanity.`
      )
      return new SanityService()
  }
}
