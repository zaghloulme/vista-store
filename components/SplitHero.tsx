'use client'

/**
 * Split Hero Component
 * Impactful hero section with carousel and side promotions
 * Optimized for visual impact and alignment
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { HomepageDTO } from '@/lib/cms/types/dtos'

interface SplitHeroProps {
  homepageData: HomepageDTO
}

export default function SplitHero({ homepageData }: SplitHeroProps) {
  const { heroImages } = homepageData
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel
  useEffect(() => {
    if (heroImages.mainImages.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % heroImages.mainImages.length
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.mainImages.length])

  return (
    <section className="w-full bg-gray-50" aria-label="Hero section">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          {/* Main Carousel - 9 columns on desktop (75% width) with 16:9 ratio */}
          <div className="lg:col-span-9 w-full">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-blue-50 to-gray-100">
              {heroImages.mainImages.map((image, index) => (
                image?.url ? (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    {image.link ? (
                      <Link 
                        href={image.link} 
                        className="block w-full h-full group"
                      >
                        <img
                          src={image.url}
                          alt={image.alt || 'Featured showcase'}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    ) : (
                      <img
                        src={image.url}
                        alt={image.alt || 'Featured showcase'}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    )}
                  </div>
                ) : null
              ))}

              {/* Carousel Navigation Dots - Always show for testing */}
              {heroImages.mainImages.length >= 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-full">
                  {heroImages.mainImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white w-10 shadow-lg'
                          : 'bg-white/60 hover:bg-white/80 w-2.5'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Previous/Next Buttons - Always show for testing */}
              {heroImages.mainImages.length >= 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide((prev) => 
                      prev === 0 ? heroImages.mainImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => 
                      (prev + 1) % heroImages.mainImages.length
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Side Promotions - 3 columns on desktop (25% width), smaller images */}
          <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6 min-h-[400px] lg:min-h-full">
            {/* Top Promotion - Smaller */}
            {heroImages.topImage?.url && (
              <div className="relative flex-1 min-h-[200px] lg:min-h-0 overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-purple-50 to-gray-100 group">
                {heroImages.topImage.link ? (
                  <Link href={heroImages.topImage.link} className="block absolute inset-0">
                    <img
                      src={heroImages.topImage.url}
                      alt={heroImages.topImage.alt || 'Featured promotion'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ) : (
                  <img
                    src={heroImages.topImage.url}
                    alt={heroImages.topImage.alt || 'Featured promotion'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            )}

            {/* Bottom Promotion - Smaller */}
            {heroImages.bottomImage?.url && (
              <div className="relative flex-1 min-h-[200px] lg:min-h-0 overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-orange-50 to-gray-100 group">
                {heroImages.bottomImage.link ? (
                  <Link href={heroImages.bottomImage.link} className="block absolute inset-0">
                    <img
                      src={heroImages.bottomImage.url}
                      alt={heroImages.bottomImage.alt || 'Featured offer'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ) : (
                  <img
                    src={heroImages.bottomImage.url}
                    alt={heroImages.bottomImage.alt || 'Featured offer'}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
