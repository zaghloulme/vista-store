/**
 * Split Hero Component
 * Displays a split hero layout with 1 large image on the left and 2 stacked smaller images on the right
 * All images are clickable if they have associated links
 */

import Image from 'next/image'
import Link from 'next/link'
import type { HomepageDTO } from '@/lib/cms/types/dtos'

interface SplitHeroProps {
  homepageData: HomepageDTO
}

export default function SplitHero({ homepageData }: SplitHeroProps) {
  const { heroTitle, heroSubtitle, heroImages } = homepageData

  // Helper to render image with optional link
  const renderImage = (
    image: typeof heroImages.mainImage,
    alt: string,
    priority: boolean,
    className: string
  ) => {
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
    <section className="w-full" aria-label="Hero section">
      {/* Hero Title & Subtitle */}
      {(heroTitle || heroSubtitle) && (
        <div className="container mx-auto px-4 py-8 md:py-12">
          {heroTitle && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
              {heroTitle}
            </h1>
          )}
          {heroSubtitle && (
            <p className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      )}

      {/* Split Image Grid */}
      <div className="container mx-auto px-4 pb-8 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-h-[600px]">
          {/* Left: Large Image */}
          <div className="w-full h-full min-h-[400px] md:min-h-[500px]">
            {renderImage(
              heroImages.mainImage,
              'Featured product showcase',
              true,
              'w-full h-full rounded-lg'
            )}
          </div>

          {/* Right: Two Stacked Images */}
          <div className="grid grid-rows-2 gap-4 lg:gap-6 h-full min-h-[400px] md:min-h-[500px]">
            {/* Top Image */}
            <div className="w-full h-full">
              {renderImage(
                heroImages.topImage,
                'Featured category or promotion',
                false,
                'w-full h-full rounded-lg'
              )}
            </div>

            {/* Bottom Image */}
            <div className="w-full h-full">
              {renderImage(
                heroImages.bottomImage,
                'Featured collection or offer',
                false,
                'w-full h-full rounded-lg'
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
