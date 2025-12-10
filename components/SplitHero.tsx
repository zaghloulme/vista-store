'use client'

/**
 * Split Hero Component
 * Displays a split hero layout with a carousel on the left and 2 stacked smaller images on the right
 * All images are clickable if they have associated links
 */

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
    if (heroImages.mainImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.mainImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.mainImages.length])

  // Helper to render image with optional link
  const renderImage = (
    image: typeof heroImages.topImage,
    alt: string,
    priority: boolean,
    className: string
  ) => {
    // Don't render if image URL is empty or missing
    if (!image?.url) {
      return null
    }

    const imageElement = (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={image.url}
          alt={image.alt || alt}
          width={image.width}
          height={image.height}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          priority={priority}
          placeholder={image.blurDataURL ? 'blur' : undefined}
          blurDataURL={image.blurDataURL}
        />
      </div>
    )

    // Wrap in Link if URL exists
    if (image.link) {
      return (
        <Link
          href={image.link}
          className="block w-full h-full group"
          aria-label={`View ${image.alt || alt}`}
        >
          {imageElement}
        </Link>
      )
    }

    return imageElement
  }

  return (
    <section className="w-full py-6 md:py-8 bg-white" aria-label="Hero section">
      {/* Split Image Grid - Carousel with stacked smaller images */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Left: Carousel (takes 2 columns) */}
          <div className="lg:col-span-2 w-full">
            <div className="aspect-[16/9] relative overflow-hidden rounded-2xl bg-gray-100">
              {heroImages.mainImages.map((image, index) => (
                image?.url ? (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    {image.link ? (
                      <Link href={image.link} className="block w-full h-full">
                        <img
                          src={image.url}
                          alt={image.alt || 'Featured showcase'}
                          className="w-full h-full object-cover"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />
                      </Link>
                    ) : (
                      <img
                        src={image.url}
                        alt={image.alt || 'Featured showcase'}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    )}
                  </div>
                ) : null
              ))}

              {/* Carousel Indicators */}
              {heroImages.mainImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {heroImages.mainImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75 w-2'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Two Stacked Images (1 column) */}
          <div className="grid grid-rows-2 gap-3 md:gap-4">
            {/* Top Image */}
            <div className="w-full h-full">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                {heroImages.topImage?.url && (
                  heroImages.topImage.link ? (
                    <Link href={heroImages.topImage.link} className="block w-full h-full">
                      <img
                        src={heroImages.topImage.url}
                        alt={heroImages.topImage.alt || 'Featured promotion'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </Link>
                  ) : (
                    <img
                      src={heroImages.topImage.url}
                      alt={heroImages.topImage.alt || 'Featured promotion'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )
                )}
              </div>
            </div>

            {/* Bottom Image */}
            <div className="w-full h-full">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                {heroImages.bottomImage?.url && (
                  heroImages.bottomImage.link ? (
                    <Link href={heroImages.bottomImage.link} className="block w-full h-full">
                      <img
                        src={heroImages.bottomImage.url}
                        alt={heroImages.bottomImage.alt || 'Featured offer'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </Link>
                  ) : (
                    <img
                      src={heroImages.bottomImage.url}
                      alt={heroImages.bottomImage.alt || 'Featured offer'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
