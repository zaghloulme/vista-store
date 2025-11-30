/**
 * Sanity CMS Service Implementation
 * Implements the CMSService interface using Sanity as the backend
 */

import type {
  CMSService,
  PageDTO,
  SettingsDTO,
  NavigationDTO,
  BlogPostDTO,
  PaginatedResponse,
} from '../types'
import { sanityClient } from './client'
import { SanityTransformer } from './transformer'

export class SanityService implements CMSService {
  async getPage(slug: string, locale: string): Promise<PageDTO | null> {
    const query = `*[_type == "page" && slug.current == $slug && locale == $locale][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      content,
      seo,
      publishedAt,
      locale
    }`

    const page = await sanityClient.fetch(query, { slug, locale })
    return page ? SanityTransformer.transformPage(page) : null
  }

  async getPages(locale: string): Promise<PageDTO[]> {
    const query = `*[_type == "page" && locale == $locale] | order(publishedAt desc) {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      content,
      seo,
      publishedAt,
      locale
    }`

    const pages = await sanityClient.fetch(query, { locale })
    return pages.map(SanityTransformer.transformPage)
  }

  async getSettings(locale: string): Promise<SettingsDTO> {
    const query = `*[_type == "siteSettings" && locale == $locale][0] {
      siteName,
      siteUrl,
      siteDescription,
      logo,
      favicon,
      social,
      gtmId,
      contactEmail,
      defaultLocale,
      supportedLocales
    }`

    const settings = await sanityClient.fetch(query, { locale })

    // Return default settings if none found
    if (!settings) {
      return {
        siteName: 'My Site',
        siteUrl: '',
        siteDescription: '',
        social: {},
        defaultLocale: locale,
        supportedLocales: [locale],
      }
    }

    return SanityTransformer.transformSettings(settings)
  }

  async getNavigation(locale: string): Promise<NavigationDTO> {
    const query = `*[_type == "navigation" && locale == $locale][0] {
      items[] {
        _key,
        label,
        href,
        target,
        children[] {
          _key,
          label,
          href,
          target
        }
      }
    }`

    const nav = await sanityClient.fetch(query, { locale })

    // Return empty navigation if none found
    if (!nav) {
      return { items: [] }
    }

    return SanityTransformer.transformNavigation(nav)
  }

  async getPost(slug: string, locale: string): Promise<BlogPostDTO | null> {
    const query = `*[_type == "post" && slug.current == $slug && locale == $locale][0] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      excerpt,
      content,
      seo,
      publishedAt,
      locale,
      featuredImage,
      author->{
        _id,
        name,
        bio,
        avatar,
        social
      },
      categories[]->{
        _id,
        name,
        slug,
        description
      },
      tags,
      estimatedReadingTime
    }`

    const post = await sanityClient.fetch(query, { slug, locale })
    return post ? SanityTransformer.transformPost(post) : null
  }

  async getPosts(
    locale: string,
    options?: {
      page?: number
      pageSize?: number
      category?: string
      tag?: string
    }
  ): Promise<PaginatedResponse<BlogPostDTO>> {
    const page = options?.page || 1
    const pageSize = options?.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize

    // Build filter conditions
    let filters = `_type == "post" && locale == $locale`
    const params: Record<string, unknown> = { locale }

    if (options?.category) {
      filters += ` && $category in categories[]->slug.current`
      params.category = options.category
    }

    if (options?.tag) {
      filters += ` && $tag in tags`
      params.tag = options.tag
    }

    // Get total count
    const countQuery = `count(*[${filters}])`
    const total = await sanityClient.fetch(countQuery, params)

    // Get paginated posts
    const query = `*[${filters}] | order(publishedAt desc) [${start}...${end}] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      excerpt,
      content,
      seo,
      publishedAt,
      locale,
      featuredImage,
      author->{
        _id,
        name,
        bio,
        avatar,
        social
      },
      categories[]->{
        _id,
        name,
        slug,
        description
      },
      tags,
      estimatedReadingTime
    }`

    const posts = await sanityClient.fetch(query, params)

    return {
      items: posts.map(SanityTransformer.transformPost),
      total,
      page,
      pageSize,
      hasMore: end < total,
    }
  }

  async getAllPageSlugs(locale: string): Promise<string[]> {
    const query = `*[_type == "page" && locale == $locale].slug.current`
    return sanityClient.fetch(query, { locale})
  }

  async getAllPostSlugs(locale: string): Promise<string[]> {
    const query = `*[_type == "post" && locale == $locale].slug.current`
    return sanityClient.fetch(query, { locale })
  }
}
