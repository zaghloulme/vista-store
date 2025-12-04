/**
 * Product Card Component
 * Displays product information in a card layout with image, name, price, and WhatsApp CTA
 */

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ProductDTO } from '@/lib/cms/types/dtos'
import WhatsAppButton from './WhatsAppButton'
import {
  formatPrice,
  calculateDiscount,
  hasDiscount,
} from '@/lib/whatsapp'

interface ProductCardProps {
  product: ProductDTO
  whatsappNumber?: string
  priority?: boolean
}

export default function ProductCard({
  product,
  whatsappNumber,
  priority = false,
}: ProductCardProps) {
  const t = useTranslations('product')
  const discount = hasDiscount(product)
    ? calculateDiscount(product.price, product.compareAtPrice!)
    : 0

  return (
    <article className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            placeholder={product.images[0].blurDataURL ? 'blur' : undefined}
            blurDataURL={product.images[0].blurDataURL}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!product.inStock && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {t('outOfStock')}
            </span>
          )}
          {product.featured && (
            <span className="bg-[var(--brand-gold)] text-black text-xs font-semibold px-2 py-1 rounded">
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[var(--brand-green)] text-white text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-[var(--brand-blue)] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        <Link
          href={`/products?category=${product.category.slug}`}
          className="text-sm text-[var(--brand-blue)] hover:underline mb-3 inline-block"
        >
          {product.category.name}
        </Link>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-black">
              {formatPrice(product.price)}
            </span>
            {hasDiscount(product) && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {product.inStock ? (
            <>
              {whatsappNumber && (
                <WhatsAppButton
                  product={product}
                  phoneNumber={whatsappNumber}
                  variant="primary"
                  size="md"
                  className="flex-1"
                />
              )}
              <Link
                href={`/products/${product.slug}`}
                className={`inline-flex items-center justify-center px-4 py-3 text-base font-semibold text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${!whatsappNumber ? 'w-full' : ''}`}
              >
                {t('viewDetails')}
              </Link>
            </>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-semibold text-white bg-gray-400 rounded-lg cursor-not-allowed"
            >
              {t('viewDetails')}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
