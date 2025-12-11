'use client'

/**
 * Static Benefits Bar
 * Shows key selling points with icons in a stationary layout
 * Displays only 3 benefits in a centered grid
 */

import Image from 'next/image'

interface Benefit {
  icon: string // Emoji or image path
  text: string
  isImage?: boolean // True if icon is an image URL
}

interface BenefitsBarProps {
  benefits: Benefit[]
  speed?: number // Kept for backwards compatibility but not used
  showLabel?: boolean // Show label
  label?: string
}

export default function BenefitsBar({
  benefits,
  showLabel = false,
  label = 'Updates'
}: BenefitsBarProps) {
  // Only take the first 3 benefits
  const displayBenefits = benefits.slice(0, 3)

  if (displayBenefits.length === 0) {
    return null
  }

  return (
    <section
      className="relative w-full py-5 md:py-6 border-t border-b border-gray-200 bg-white"
      aria-label="Store benefits"
    >
      {/* Optional floating label */}
      {showLabel && (
        <p className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600 z-10 bg-white px-3 py-1 rounded-full border border-gray-200">
          {label}
        </p>
      )}

      {/* Static container with centered grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {displayBenefits.map((benefit, index) => (
            <div
              key={`${benefit.text}-${index}`}
              className="flex items-center justify-center gap-3 md:gap-4"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {benefit.isImage && benefit.icon ? (
                  <div className="relative w-10 h-10 md:w-12 md:h-12">
                    <Image
                      src={benefit.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <span className="text-2xl md:text-3xl" aria-hidden="true">
                    {benefit.icon}
                  </span>
                )}
              </div>

              {/* Text */}
              <span className="text-sm md:text-base font-medium text-gray-700 text-center md:text-left">
                {benefit.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
