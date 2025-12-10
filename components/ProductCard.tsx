/**
 * Product Card Component
 * Displays product information in a card layout with image, name, price, and view product CTA
 * Designed for consistent sizing across all cards regardless of content length
 */

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { ProductDTO } from '@/lib/cms/types/dtos'
import {
  formatPrice,
  calculateDiscount,
  hasDiscount,
} from '@/lib/whatsapp'

interface ProductCardProps {
  product: ProductDTO
  priority?: boolean
}

export default function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const t = useTranslations('product')
  const discount = hasDiscount(product)
    ? calculateDiscount(product.price, product.compareAtPrice!)
    : 0

  return (
    <article className="group card-modern overflow-hidden flex flex-col h-full relative">
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none z-10" />

      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        {product.images[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            placeholder={product.images[0].blurDataURL ? 'blur' : undefined}
            blurDataURL={product.images[0].blurDataURL}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Image
              src="/placeholders/product-placeholder.svg"
              alt="Product placeholder"
              width={400}
              height={400}
              className="object-contain opacity-50"
            />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {!product.inStock && (
            <span className="glass bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              {t('outOfStock')}
            </span>
          )}

          {discount > 0 && (
            <span className="glass bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Product Info - flex-1 to fill space */}
      <div className="p-5 flex flex-col flex-1 relative z-20">
        {/* Brand - fixed height */}
        {product.brand && (
          <p className="text-xs font-semibold text-brand-blue uppercase tracking-wider mb-2 h-4">
            {product.brand}
          </p>
        )}

        {/* Product Name - fixed 2 lines with min-height */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] text-gray-900 group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        <Link
          href={`/products?category=${product.category.slug}`}
          className="text-xs text-gray-500 hover:text-brand-blue font-medium mb-3 inline-block transition-colors"
        >
          {product.category.name}
        </Link>

        {/* Short Description - fixed 3 lines with min-height */}
        {product.shortDescription && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-3 min-h-[54px] leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount(product) && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <div className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
              Save {discount}%
            </div>
          )}
        </div>

        {/* Actions - pushed to bottom with mt-auto */}
        <div className="mt-auto pt-3">
          {product.inStock ? (
            <Link
              href={`/products/${product.slug}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group/btn"
            >
              {t('viewDetails')}
              <svg
                className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-gray-400 rounded-xl cursor-not-allowed opacity-60"
            >
              {t('viewDetails')}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
