'use client'

/**
 * WhatsApp Button Component
 * Renders a button that opens WhatsApp with a pre-filled message
 */

import { useTranslations } from 'next-intl'
import type { ProductDTO } from '@/lib/cms/types/dtos'
import {
  generateProductWhatsAppLink,
  generateGeneralInquiryLink,
} from '@/lib/whatsapp'

interface WhatsAppButtonProps {
  product?: ProductDTO
  phoneNumber: string
  variant?: 'primary' | 'secondary' | 'floating'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  customMessage?: string
}

export default function WhatsAppButton({
  product,
  phoneNumber,
  variant = 'primary',
  size = 'md',
  className = '',
  customMessage,
}: WhatsAppButtonProps) {
  const t = useTranslations('whatsapp')

  // Generate WhatsApp link
  const whatsappLink = product
    ? generateProductWhatsAppLink(
        product,
        phoneNumber,
        process.env.NEXT_PUBLIC_SITE_URL
      )
    : generateGeneralInquiryLink(phoneNumber, customMessage)

  // Track WhatsApp click (GTM)
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: product ? `Product: ${product.name}` : 'General Inquiry',
        product_id: product?.id,
        product_name: product?.name,
      })
    }
  }

  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'

  // Variant styles
  const variantStyles = {
    primary: 'bg-[#25D366] hover:bg-[#20BA59] text-white focus:ring-[#25D366]',
    secondary: 'bg-white hover:bg-gray-50 text-[#25D366] border-2 border-[#25D366] focus:ring-[#25D366]',
    floating: 'fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA59] text-white shadow-lg hover:shadow-xl focus:ring-[#25D366] rounded-full',
  }

  // Size styles
  const sizeStyles = {
    sm: variant === 'floating' ? 'p-3' : 'px-4 py-2 text-sm',
    md: variant === 'floating' ? 'p-4' : 'px-6 py-3 text-base',
    lg: variant === 'floating' ? 'p-5' : 'px-8 py-4 text-lg',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={combinedClassName}
      aria-label={product ? t('ctaButton') : 'Contact us on WhatsApp'}
    >
      {/* WhatsApp Icon SVG */}
      <svg
        className={size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-7 h-7' : 'w-6 h-6'}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>

      {/* Button text (hide on floating variant) */}
      {variant !== 'floating' && (
        <span>{product ? t('ctaButton') : 'Contact Us'}</span>
      )}

      {/* Tooltip for floating variant */}
      {variant === 'floating' && (
        <span className="sr-only">{product ? t('ctaButton') : 'Contact us on WhatsApp'}</span>
      )}
    </a>
  )
}
