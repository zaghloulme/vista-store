/**
 * SEO Metadata Generators
 * Helpers for generating Next.js metadata
 */

import type { Metadata } from 'next'
import type { SEOMetadata } from '../cms/types/dtos'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

/**
 * Generate metadata from SEO DTO
 */
export function generateMetadataFromSEO(
  seo: SEOMetadata,
  locale: string = 'en'
): Metadata {
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: {
      index: !seo.noindex,
      follow: !seo.nofollow,
      googleBot: {
        index: !seo.noindex,
        follow: !seo.nofollow,
      },
    },
    alternates: {
      canonical: seo.canonical,
      languages: {
        'x-default': `${siteUrl}/en`,
        en: `${siteUrl}/en`,
        ar: `${siteUrl}/ar`,
        de: `${siteUrl}/de`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: siteUrl,
      siteName: seo.title,
      locale: locale,
      type: (seo.ogType as 'website' | 'article' | 'book' | 'profile') || 'website',
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage.url,
              width: seo.ogImage.width,
              height: seo.ogImage.height,
              alt: seo.ogImage.alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: seo.twitterCard || 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage.url] : undefined,
    },
  }
}

/**
 * Generate metadata for a page with custom title
 */
export function generatePageMetadata(
  title: string,
  description: string,
  locale: string = 'en',
  options?: {
    keywords?: string[]
    ogImage?: string
    canonical?: string
    noindex?: boolean
  }
): Metadata {
  return {
    title,
    description,
    keywords: options?.keywords,
    robots: {
      index: !options?.noindex,
      follow: !options?.noindex,
    },
    alternates: {
      canonical: options?.canonical,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: title,
      locale: locale,
      type: 'website',
      images: options?.ogImage
        ? [
            {
              url: options.ogImage,
              width: 1200,
              height: 630,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: options?.ogImage ? [options.ogImage] : undefined,
    },
  }
}

/**
 * Merge metadata objects with proper precedence
 */
export function mergeMetadata(...metadataObjects: Metadata[]): Metadata {
  return metadataObjects.reduce((acc, curr) => {
    const result: Metadata = {
      ...acc,
      ...curr,
    }

    // Merge openGraph if both have it
    if (acc.openGraph && curr.openGraph) {
      result.openGraph = { ...acc.openGraph, ...curr.openGraph }
    }

    // Merge twitter if both have it
    if (acc.twitter && curr.twitter) {
      result.twitter = { ...acc.twitter, ...curr.twitter }
    }

    // For robots, just use the latest value (no merge needed)

    return result
  }, {} as Metadata)
}
