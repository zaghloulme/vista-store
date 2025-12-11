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
  ProductDTO,
  ProductsResponse,
  CategoryDTO,
  CategoriesResponse,
  HomepageDTO,
  SiteSettingsDTO,
  BrandDTO,
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
    return sanityClient.fetch(query, { locale })
  }

  async getAllPostSlugs(locale: string): Promise<string[]> {
    const query = `*[_type == "post" && locale == $locale].slug.current`
    return sanityClient.fetch(query, { locale })
  }

  async getProducts(params?: {
    category?: string
    brand?: string
    featured?: boolean
    minPrice?: number
    maxPrice?: number
    limit?: number
    offset?: number
    search?: string
  }): Promise<ProductsResponse> {
    const limit = params?.limit || 20
    const offset = params?.offset || 0
    const end = offset + limit

    // Build filter conditions
    let filters = `_type == "product"`
    const queryParams: Record<string, unknown> = {}

    if (params?.category) {
      filters += ` && category->slug.current == $category`
      queryParams.category = params.category
    }

    if (params?.brand) {
      filters += ` && brand == $brand`
      queryParams.brand = params.brand
    }

    if (params?.featured !== undefined) {
      filters += ` && featured == $featured`
      queryParams.featured = params.featured
    }

    if (params?.minPrice !== undefined) {
      filters += ` && price >= $minPrice`
      queryParams.minPrice = params.minPrice
    }

    if (params?.maxPrice !== undefined) {
      filters += ` && price <= $maxPrice`
      queryParams.maxPrice = params.maxPrice
    }

    if (params?.search) {
      // Search in name, brand, and description
      filters += ` && (
        name match $search ||
        brand match $search ||
        description match $search
      )`
      queryParams.search = `*${params.search}*`
    }

    // Get total count
    const countQuery = `count(*[${filters}])`
    const total = await sanityClient.fetch(countQuery, queryParams)

    // Get paginated products
    const query = `*[${filters}] | order(featured desc, _createdAt desc) [${offset}...${end}] {
      _id,
      _createdAt,
      name,
      slug,
      sku,
      brand,
      price,
      compareAtPrice,
      description,
      shortDescription,
      images[] {
        asset->,
        alt
      },
      category->{
        _id,
        name,
        slug,
        description,
        image,
        order,
        showInNavigation
      },
      specifications,
      inStock,
      featured,
      seo,
      publishedAt
    }`

    const products = await sanityClient.fetch(query, queryParams)

    return {
      data: products.map(SanityTransformer.transformProduct),
      total,
      limit,
      offset,
    }
  }

  async getProductBySlug(slug: string): Promise<ProductDTO | null> {
    const query = `*[_type == "product" && slug.current == $slug][0] {
      _id,
      _createdAt,
      name,
      slug,
      sku,
      brand,
      price,
      compareAtPrice,
      description,
      shortDescription,
      images[] {
        asset->,
        alt
      },
      category->{
        _id,
        name,
        slug,
        description,
        image,
        order,
        showInNavigation
      },
      specifications,
      inStock,
      featured,
      seo,
      publishedAt
    }`

    const product = await sanityClient.fetch(query, { slug })
    return product ? SanityTransformer.transformProduct(product) : null
  }

  async getCategories(): Promise<CategoriesResponse> {
    const query = `*[_type == "category"] | order(order asc) {
      _id,
      name,
      slug,
      description,
      image {
        asset->,
        alt
      },
      order,
      showInNavigation
    }`

    const categories = await sanityClient.fetch(query)

    return {
      categories: categories.map(SanityTransformer.transformCategory),
    }
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
    const query = `*[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      image {
        asset->,
        alt
      },
      order,
      showInNavigation
    }`

    const category = await sanityClient.fetch(query, { slug })
    return category ? SanityTransformer.transformCategory(category) : null
  }

  async getHomepageSettings(): Promise<HomepageDTO | null> {
    const query = `*[_type == "homepage"][0] {
      heroTitle,
      heroSubtitle,
      heroImages {
        mainImages[] {
          asset->,
          alt,
          link
        },
        topImage {
          asset->,
          alt,
          link
        },
        bottomImage {
          asset->,
          alt,
          link
        }
      },
      featuredCategories[]->{
        _id,
        name,
        slug,
        description,
        image {
          asset->,
          alt
        },
        order,
        showInNavigation
      },
      whatsappNumber,
      storeLocation,
      highlightedSection,
      categoriesSection,
      moreProductsSection,
      whyBuyFromUs
    }`

    const homepage = await sanityClient.fetch(query)
    return homepage ? SanityTransformer.transformHomepage(homepage) : null
  }

  async getSiteSettings(): Promise<SiteSettingsDTO | null> {
    const query = `*[_type == "siteSettings"][0] {
      footerDescription,
      businessHours,
      quickLinks,
      socialLinks,
      announcementBar
    }`

    const settings = await sanityClient.fetch(query)
    return settings || null
  }

  async getBrands(): Promise<BrandDTO[]> {
    const query = `*[_type == "brandsCarousel" && isActive == true] | order(order asc) {
      _id,
      name,
      logo,
      order,
      isActive
    }`

    const brands = await sanityClient.fetch<Array<{
      _id: string
      name: string
      logo?: unknown
      order?: number
      isActive?: boolean
    }>>(query)
    return brands.map((brand) => ({
      id: brand._id,
      name: brand.name,
      logo: SanityTransformer.transformBrandLogo(brand.logo),
      order: brand.order ?? 0,
      isActive: brand.isActive ?? true,
    }))
  }
}
