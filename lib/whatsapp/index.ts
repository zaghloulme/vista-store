/**
 * WhatsApp Integration Utilities
 * Handles WhatsApp Business API deep linking for product inquiries
 */

import type { ProductDTO } from '../cms/types/dtos'

/**
 * Format phone number for WhatsApp (remove spaces and ensure + prefix)
 */
export function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove all spaces and special characters except +
  let formatted = phoneNumber.replace(/[^\d+]/g, '')

  // Ensure it starts with +
  if (!formatted.startsWith('+')) {
    formatted = '+' + formatted
  }

  return formatted
}

/**
 * Generate WhatsApp message for product inquiry
 */
export function generateProductMessage(product: ProductDTO, siteUrl?: string): string {
  const productUrl = siteUrl ? `${siteUrl}/products/${product.slug}` : ''

  let message = `Hello! I'm interested in this product:\n\n`
  message += `📱 ${product.name}\n`

  if (product.brand) {
    message += `🏷️ Brand: ${product.brand}\n`
  }

  message += `💰 Price: ${formatPrice(product.price)}\n`

  if (productUrl) {
    message += `\n🔗 ${productUrl}`
  }

  return message
}

/**
 * Generate WhatsApp deep link URL
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const formattedNumber = formatWhatsAppNumber(phoneNumber)
  const encodedMessage = encodeURIComponent(message)

  // Use wa.me for better mobile/desktop compatibility
  return `https://wa.me/${formattedNumber.replace('+', '')}?text=${encodedMessage}`
}

/**
 * Generate WhatsApp link for product inquiry
 */
export function generateProductWhatsAppLink(
  product: ProductDTO,
  phoneNumber: string,
  siteUrl?: string
): string {
  const message = generateProductMessage(product, siteUrl)
  return generateWhatsAppLink(phoneNumber, message)
}

/**
 * Format price in Egyptian Pounds (EGP)
 */
export function formatPrice(price: number): string {
  // Format price with EGP currency symbol
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace(/^EGP\s*/, 'EGP ')
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, compareAtPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/**
 * Check if product has discount
 */
export function hasDiscount(product: ProductDTO): boolean {
  return !!(
    product.compareAtPrice &&
    product.compareAtPrice > product.price
  )
}

/**
 * Generate general inquiry WhatsApp link
 */
export function generateGeneralInquiryLink(
  phoneNumber: string,
  customMessage?: string
): string {
  const defaultMessage = 'Hello! I have a question about Vista Store products.'
  const message = customMessage || defaultMessage
  return generateWhatsAppLink(phoneNumber, message)
}
