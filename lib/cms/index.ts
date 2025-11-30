/**
 * CMS Module
 * Exports a single CMS instance for use throughout the application
 */

export * from './types'
export { getCMSService } from './factory'

// Export a singleton CMS instance
import { getCMSService } from './factory'
export const cms = getCMSService()
