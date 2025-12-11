'use client'

/**
 * Brand Carousel Component
 * Infinite scrolling carousel of brand logos
 * No interaction - continuous auto-scroll
 */

import { useEffect, useRef } from 'react'
import type { BrandDTO } from '@/lib/cms/types/dtos'

interface BrandCarouselProps {
  brands: BrandDTO[]
}

export default function BrandCarousel({ brands }: BrandCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || brands.length === 0) return

    let animationFrameId: number
    let scrollPosition = 0
    const scrollSpeed = 1 // Pixels per frame (increased for smoother visible movement)

    const animate = () => {
      if (!scrollContainer) return

      scrollPosition += scrollSpeed

      // Calculate the width of one set of logos
      // We have 3 sets of brands, so one set is 1/3 of the total width
      const containerWidth = scrollContainer.scrollWidth / 3

      // Reset scroll position when we've scrolled through one full set
      if (scrollPosition >= containerWidth) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [brands.length])

  if (brands.length === 0) {
    return null
  }

  // Triple the brands array for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands]

  return (
    <section className="py-8 md:py-12">
      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-12 md:gap-16 px-8 overflow-x-scroll scrollbar-hide"
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {duplicatedBrands.map((brand, index) => (
          brand.logo ? (
            <div
              key={`${brand.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              style={{ width: '180px', height: '100px' }}
            >
              <img
                src={brand.logo.url}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
                style={{ maxWidth: '160px' }}
              />
            </div>
          ) : null
        ))}
      </div>
    </section>
  )
}
