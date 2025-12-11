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

  // Use mainImages for side slots if available, otherwise fallback to configured top/bottom images
  // This allows the user to just upload 3 images to the carousel and have them populate the grid
  const displayMainImages = heroImages.mainImages.length > 0 ? heroImages.mainImages : []

  // The first image goes to the main carousel
  // If we have distinct side images configured in CMS, use them. 
  // OTHERWISE, if we have extra images in the carousel list, use those for the side slots to create a "Gallery" feel.
  // The user interaction suggests they expect the "Carousel" images to populate these slots.
  const sideTopImage = heroImages.topImage?.url ? heroImages.topImage : (displayMainImages.length > 1 ? displayMainImages[1] : null)
  const sideBottomImage = heroImages.bottomImage?.url ? heroImages.bottomImage : (displayMainImages.length > 2 ? displayMainImages[2] : null)

  // Filter main carousel to only show images NOT used in side slots? 
  // Or just show all? Usually a carousel shows all. 
  // But if the user says "these three images belong to the carousel", they might mean a static grid.
  // Let's keep the carousel functionality for the main slot, identifying it as the "Hero" slot.
  // We'll iterate through ALL mainImages in the carousel, but the side slots show static previews of 2 & 3.

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
    <section className="w-full bg-gray-50 mb-8" aria-label="Hero section">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Fixed height on desktop to ensure perfect alignment and no empty space */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:h-[500px]">
          {/* Main Carousel - 9 columns on desktop */}
          <div className="lg:col-span-9 w-full h-full">
            <div className="relative w-full h-[300px] lg:h-full overflow-hidden rounded-2xl shadow-xl bg-gray-200">
              {heroImages.mainImages.map((image, index) => (
                image?.url ? (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
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

              {/* Carousel Navigation Dots */}
              {heroImages.mainImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-full">
                  {heroImages.mainImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                          ? 'bg-white w-10 shadow-lg'
                          : 'bg-white/60 hover:bg-white/80 w-2.5'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              {heroImages.mainImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentSlide((prev) => prev === 0 ? heroImages.mainImages.length - 1 : prev - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentSlide((prev) => (prev + 1) % heroImages.mainImages.length);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
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

          {/* Side Promotions - Fill height to match carousel */}
          <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6 h-full">
            {/* Top Promotion */}
            <div className="relative flex-1 rounded-xl shadow-md overflow-hidden bg-gray-100 group h-[200px] lg:h-auto">
              {sideTopImage?.url ? (
                sideTopImage.link ? (
                  <Link href={sideTopImage.link} className="block w-full h-full">
                    <img
                      src={sideTopImage.url}
                      alt={sideTopImage.alt || 'Featured promotion'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>
                ) : (
                  <img
                    src={sideTopImage.url}
                    alt={sideTopImage.alt || 'Featured promotion'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                  <span className="text-sm">Coming Soon</span>
                </div>
              )}
            </div>

            {/* Bottom Promotion */}
            <div className="relative flex-1 rounded-xl shadow-md overflow-hidden bg-gray-100 group h-[200px] lg:h-auto">
              {sideBottomImage?.url ? (
                sideBottomImage.link ? (
                  <Link href={sideBottomImage.link} className="block w-full h-full">
                    <img
                      src={sideBottomImage.url}
                      alt={sideBottomImage.alt || 'Featured offer'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>
                ) : (
                  <img
                    src={sideBottomImage.url}
                    alt={sideBottomImage.alt || 'Featured offer'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                  <span className="text-sm">Coming Soon</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
