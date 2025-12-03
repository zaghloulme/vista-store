/**
 * Data Transfer Objects (DTOs) for CMS content
 * These types are CMS-agnostic and represent the standardized data structure
 * used throughout the application, regardless of the underlying CMS.
 */

export interface ImageDTO {
  url: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
}

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: ImageDTO
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
}

export interface PageDTO {
  id: string
  slug: string
  title: string
  description: string
  content: unknown // Flexible content - can be Portable Text, HTML, or custom structure
  seo: SEOMetadata
  publishedAt: Date
  updatedAt: Date
  locale?: string
}

export interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  github?: string
}

export interface SettingsDTO {
  siteName: string
  siteUrl: string
  siteDescription: string
  logo?: ImageDTO
  favicon?: ImageDTO
  social: SocialLinks
  gtmId?: string
  contactEmail?: string
  defaultLocale: string
  supportedLocales: string[]
}

export interface NavItemDTO {
  id: string
  label: string
  href: string
  target?: '_blank' | '_self'
  children?: NavItemDTO[]
}

export interface NavigationDTO {
  items: NavItemDTO[]
}

export interface BlogPostDTO extends PageDTO {
  excerpt: string
  author?: AuthorDTO
  categories?: CategoryDTO[]
  tags?: string[]
  featuredImage?: ImageDTO
  estimatedReadingTime?: number
}

export interface AuthorDTO {
  id: string
  name: string
  bio?: string
  avatar?: ImageDTO
  social?: SocialLinks
}

export interface CategoryDTO {
  id: string
  name: string
  slug: string
  description?: string
  image?: ImageDTO
  order?: number
  showInNavigation: boolean
}

export interface ProductDTO {
  id: string
  name: string
  slug: string
  sku?: string
  brand: string
  price: number
  compareAtPrice?: number
  description: string
  shortDescription?: string
  images: ImageDTO[]
  category: CategoryDTO
  specifications?: Array<{ label: string; value: string }>
  inStock: boolean
  featured: boolean
  seo: SEOMetadata
  publishedAt: Date
}

export interface HomepageDTO {
  heroTitle?: string
  heroSubtitle?: string
  heroImages: {
    mainImage: ImageDTO & { link?: string }
    topImage: ImageDTO & { link?: string }
    bottomImage: ImageDTO & { link?: string }
  }
  featuredCategories: CategoryDTO[]
  whatsappNumber?: string
  storeLocation?: string
}

export interface ProductsResponse {
  data: ProductDTO[]
  total: number
  limit: number
  offset: number
}

export interface CategoriesResponse {
  categories: CategoryDTO[]
}

/**
 * Generic list response for paginated content
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
