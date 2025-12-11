'use client'

/**
 * Horizontal Product Slider
 * Inspired by loading-eg.com's product grid sliders
 * Features: prev/next buttons, slide counter, peek effect
 */

import { useState, useRef, useEffect } from 'react'
import ProductCard from './ProductCard'
import type { ProductDTO } from '@/lib/cms/types/dtos'

interface ProductSliderProps {
  products: ProductDTO[]
  title?: string
  description?: string
  slidesPerView?: {
    mobile: number
    tablet: number
    desktop: number
  }
}

export default function ProductSlider({
  products,
  title,
  description,
  slidesPerView = { mobile: 1, tablet: 2, desktop: 4 }
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(slidesPerView.desktop)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Calculate max slides
  const maxIndex = Math.max(0, products.length - slidesToShow)

  // Handle responsive slides
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setSlidesToShow(slidesPerView.mobile)
      } else if (width < 1024) {
        setSlidesToShow(slidesPerView.tablet)
      } else {
        setSlidesToShow(slidesPerView.desktop)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [slidesPerView])

  // Navigation handlers
  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  // Scroll to current index
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.scrollWidth / products.length
      sliderRef.current.scrollTo({
        left: slideWidth * currentIndex,
        behavior: 'smooth'
      })
    }
  }, [currentIndex, products.length])

  if (products.length === 0) return null

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="mb-8 md:mb-10">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm md:text-base text-gray-600 max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Slider Container */}
        <div className="relative">
          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-3 md:gap-4 overflow-x-hidden scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{
                  width: `calc((100% - ${(slidesToShow - 1) * (slidesToShow > 2 ? 16 : 12)}px) / ${slidesToShow})`
                }}
              >
                <ProductCard product={product} priority={index < slidesToShow} />
              </div>
            ))}
          </div>

          {/* Navigation - Only show if there are more products than visible */}
          {products.length > slidesToShow && (
            <>
              {/* Previous Button */}
              <button
                onClick={goToPrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all z-10 group"
                aria-label="Previous products"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gray-900 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all z-10 group"
                aria-label="Next products"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-gray-900 transition-colors"
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
              </button>

              {/* Counter */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{currentIndex + 1}</span>
                <span>/</span>
                <span>{products.length - slidesToShow + 1}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
