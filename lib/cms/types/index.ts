/**
 * CMS Service Interface
 * All CMS implementations (Sanity, Payload, etc.) must implement this interface
 * to ensure consistency across the application.
 */

import type {
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
} from './dtos'

export * from './dtos'

export interface CMSService {
  /**
   * Get a single page by slug and locale
   */
  getPage(slug: string, locale: string): Promise<PageDTO | null>

  /**
   * Get all pages for a specific locale
   */
  getPages(locale: string): Promise<PageDTO[]>

  /**
   * Get global site settings for a specific locale
   */
  getSettings(locale: string): Promise<SettingsDTO>

  /**
   * Get navigation items for a specific locale
   */
  getNavigation(locale: string): Promise<NavigationDTO>

  /**
   * Get a single blog post by slug and locale
   */
  getPost(slug: string, locale: string): Promise<BlogPostDTO | null>

  /**
   * Get paginated blog posts for a specific locale
   */
  getPosts(
    locale: string,
    options?: {
      page?: number
      pageSize?: number
      category?: string
      tag?: string
    }
  ): Promise<PaginatedResponse<BlogPostDTO>>

  /**
   * Get all page slugs for a specific locale (used for static generation)
   */
  getAllPageSlugs(locale: string): Promise<string[]>

  /**
   * Get all blog post slugs for a specific locale (used for static generation)
   */
  getAllPostSlugs(locale: string): Promise<string[]>

  /**
   * Get products with optional filtering
   */
  getProducts(params?: {
    category?: string
    brand?: string
    featured?: boolean
    minPrice?: number
    maxPrice?: number
    limit?: number
    offset?: number
    search?: string
  }): Promise<ProductsResponse>

  /**
   * Get a single product by slug
   */
  getProductBySlug(slug: string): Promise<ProductDTO | null>

  /**
   * Get all product categories
   */
  getCategories(): Promise<CategoriesResponse>

  /**
   * Get a single category by slug
   */
  getCategoryBySlug(slug: string): Promise<CategoryDTO | null>

  /**
   * Get homepage settings
   */
  getHomepageSettings(): Promise<HomepageDTO | null>

  /**
   * Get site settings (footer, business hours, etc.)
   */
  getSiteSettings(): Promise<SiteSettingsDTO | null>

  /**
   * Get all brands
   */
  getBrands(): Promise<BrandDTO[]>
}
