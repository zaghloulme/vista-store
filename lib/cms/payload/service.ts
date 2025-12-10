/**
 * Payload CMS Service Implementation (Stub)
 * Implements the CMSService interface using Payload as the backend
 *
 * NOTE: This is a stub implementation. Users need to:
 * 1. Install Payload CMS dependencies
 * 2. Configure Payload server
 * 3. Create collections matching the DTOs
 * 4. Implement the transformer and full service
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
} from '../types'

/**
 * This is a stub implementation for template users to complete.
 * Parameters are intentionally unused - users will implement actual Payload CMS queries.
 * When implementing, remove the eslint-disable comment below and use all parameters.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class PayloadService implements CMSService {
  async getPage(slug: string, locale: string): Promise<PageDTO | null> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return null
  }

  async getPages(locale: string): Promise<PageDTO[]> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return []
  }

  async getSettings(locale: string): Promise<SettingsDTO> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return {
      siteName: 'My Site',
      siteUrl: '',
      siteDescription: '',
      social: {},
      defaultLocale: locale,
      supportedLocales: [locale],
    }
  }

  async getNavigation(locale: string): Promise<NavigationDTO> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return { items: [] }
  }

  async getPost(slug: string, locale: string): Promise<BlogPostDTO | null> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return null
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
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return {
      items: [],
      total: 0,
      page: options?.page || 1,
      pageSize: options?.pageSize || 10,
      hasMore: false,
    }
  }

  async getAllPageSlugs(locale: string): Promise<string[]> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return []
  }

  async getAllPostSlugs(locale: string): Promise<string[]> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return []
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
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return {
      data: [],
      total: 0,
      limit: params?.limit || 20,
      offset: params?.offset || 0,
    }
  }

  async getProductBySlug(slug: string): Promise<ProductDTO | null> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return null
  }

  async getCategories(): Promise<CategoriesResponse> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return {
      categories: [],
    }
  }

  async getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return null
  }

  async getHomepageSettings(): Promise<HomepageDTO | null> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return null
  }

  async getSiteSettings(): Promise<SiteSettingsDTO | null> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return null
  }

  async getBrands(): Promise<import('../types').BrandDTO[]> {
    // TODO: Implement Payload API call
    console.warn('Payload service not fully implemented. Please configure Payload CMS.')
    return []
  }
}
