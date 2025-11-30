/**
 * JSON-LD Schema Builders
 * Helpers for generating structured data
 */

import type { BlogPostDTO, SettingsDTO } from '../cms/types/dtos'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

/**
 * Organization schema for the website
 */
export function generateOrganizationSchema(settings: SettingsDTO) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    url: siteUrl,
    logo: settings.logo?.url,
    description: settings.siteDescription,
    contactPoint: settings.contactEmail
      ? {
          '@type': 'ContactPoint',
          email: settings.contactEmail,
          contactType: 'Customer Service',
        }
      : undefined,
    sameAs: [
      settings.social.facebook,
      settings.social.twitter,
      settings.social.instagram,
      settings.social.linkedin,
      settings.social.youtube,
      settings.social.github,
    ].filter(Boolean),
  }
}

/**
 * Website schema
 */
export function generateWebsiteSchema(settings: SettingsDTO) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: siteUrl,
    description: settings.siteDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * WebPage schema
 */
export function generateWebPageSchema(
  title: string,
  description: string,
  url: string,
  publishedAt?: Date,
  updatedAt?: Date
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: url,
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt?.toISOString(),
  }
}

/**
 * Article schema for blog posts
 */
export function generateArticleSchema(post: BlogPostDTO, locale: string = 'en') {
  const articleUrl = `${siteUrl}/${locale}/blog/${post.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || post.excerpt,
    image: post.featuredImage?.url,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          description: post.author.bio,
          image: post.author.avatar?.url,
          sameAs: Object.values(post.author.social || {}).filter(Boolean),
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Site Name',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: post.tags?.join(', '),
    articleSection: post.categories?.map((cat) => cat.name).join(', '),
    wordCount: post.estimatedReadingTime ? post.estimatedReadingTime * 200 : undefined,
  }
}

/**
 * Breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * FAQ schema
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Helper to stringify JSON-LD schema
 * Use in a script tag: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }} />
 */
export function toJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema)
}
