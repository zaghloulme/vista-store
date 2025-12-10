'use client'

/**
 * Infinite Scrolling Benefits Bar
 * Inspired by loading-eg.com's "Updates" section
 * Shows key selling points with icons in a smooth infinite scroll
 */

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface Benefit {
  icon: string // Emoji or image path
  text: string
  isImage?: boolean // True if icon is an image URL
}

interface BenefitsBarProps {
  benefits: Benefit[]
  speed?: number // Animation duration in seconds (default: 40)
  showLabel?: boolean // Show "Updates" label
  label?: string
}

export default function BenefitsBar({
  benefits,
  speed = 40,
  showLabel = false,
  label = 'Updates'
}: BenefitsBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Triple the benefits array for seamless infinite scroll
  const tripledBenefits = [...benefits, ...benefits, ...benefits]

  if (benefits.length === 0) {
    return null
  }

  return (
    <section
      className="relative w-full py-5 md:py-6 border-t border-b border-gray-200 bg-white overflow-hidden"
      aria-label="Store benefits"
    >
      {/* Optional floating label */}
      {showLabel && (
        <p className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600 z-10 bg-white px-3 py-1 rounded-full border border-gray-200">
          {label}
        </p>
      )}

      {/* Scrolling container */}
      <div
        ref={containerRef}
        className="benefits-scroll-container flex items-center gap-8 md:gap-12"
        style={{
          animation: `infiniteScroll ${speed}s linear infinite`,
        }}
      >
        {tripledBenefits.map((benefit, index) => (
          <div
            key={`${benefit.text}-${index}`}
            className="flex items-center gap-3 md:gap-4 flex-shrink-0 px-4 md:px-6"
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
            <span className="text-sm md:text-base font-medium text-gray-700 whitespace-nowrap">
              {benefit.text}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes infiniteScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .benefits-scroll-container {
          width: fit-content;
        }
      `}</style>
    </section>
  )
}
