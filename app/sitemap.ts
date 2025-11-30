/**
 * Dynamic sitemap.xml
 * Multi-locale sitemap with CMS content
 */

import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { cms } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  // Static pages (add your static routes here)
  const staticPages = ['', '/about', '/contact', '/blog']

  // Generate static page entries for all locales
  const staticEntries = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  )

  // Get dynamic pages from CMS for all locales
  const dynamicEntries = await Promise.all(
    locales.map(async (locale) => {
      try {
        const pages = await cms.getAllPageSlugs(locale)
        return pages.map((slug) => ({
          url: `${baseUrl}/${locale}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
      } catch (error) {
        console.error(`Error fetching pages for locale ${locale}:`, error)
        return []
      }
    })
  ).then((results) => results.flat())

  // Get blog posts from CMS for all locales
  const blogEntries = await Promise.all(
    locales.map(async (locale) => {
      try {
        const posts = await cms.getAllPostSlugs(locale)
        return posts.map((slug) => ({
          url: `${baseUrl}/${locale}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
      } catch (error) {
        console.error(`Error fetching posts for locale ${locale}:`, error)
        return []
      }
    })
  ).then((results) => results.flat())

  return [...staticEntries, ...dynamicEntries, ...blogEntries]
}
