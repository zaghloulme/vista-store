/**
 * Dynamic robots.txt
 * Environment-aware with explicit AI crawler support
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const isProduction = process.env.VERCEL_ENV === 'production'

  if (!isProduction) {
    // Block all crawlers in preview/dev
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  // Allow all crawlers including AI in production
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // Explicitly allow AI crawlers (OpenAI, Anthropic, Google)
      {
        userAgent: 'GPTBot', // OpenAI
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing
        allow: '/',
      },
      {
        userAgent: 'Claude-Web', // Anthropic Claude
        allow: '/',
      },
      {
        userAgent: 'Google-Extended', // Google Bard/Gemini
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot', // Perplexity
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
