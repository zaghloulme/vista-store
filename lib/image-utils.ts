/**
 * Image Utilities
 * Helper functions for handling images and placeholders
 */

import type { ImageDTO } from './cms/types/dtos'

/**
 * Get placeholder image path based on type
 */
export function getPlaceholderImage(type: 'product' | 'category' | 'hero'): string {
  return `/placeholders/${type}-placeholder.png`
}

/**
 * Get image URL with fallback to placeholder
 */
export function getImageWithFallback(
  image?: ImageDTO,
  type: 'product' | 'category' | 'hero' = 'product'
): string {
  return image?.url || getPlaceholderImage(type)
}

/**
 * Check if image is a placeholder
 */
export function isPlaceholderImage(url: string): boolean {
  return url.includes('/placeholders/')
}
