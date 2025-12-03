/**
 * Sanity Transformer
 * Converts Sanity CMS responses to standardized DTOs
 */

import type {
  PageDTO,
  SettingsDTO,
  NavigationDTO,
  NavItemDTO,
  BlogPostDTO,
  ImageDTO,
  SEOMetadata,
  ProductDTO,
  CategoryDTO,
  HomepageDTO,
} from '../types/dtos'
import { urlForImage } from './client'

export class SanityTransformer {
  /**
   * Transform Sanity image to ImageDTO
   */
  static transformImage(sanityImage: unknown): ImageDTO | undefined {
    if (!sanityImage) return undefined

    const builder = urlForImage(sanityImage)
    if (!builder) return undefined

    const imageUrl = builder.width(1200).height(630).url()

    const img = sanityImage as Record<string, unknown>
    const asset = img.asset as Record<string, unknown> | undefined
    const metadata = asset?.metadata as Record<string, unknown> | undefined
    const dimensions = metadata?.dimensions as Record<string, unknown> | undefined

    return {
      url: imageUrl,
      alt: (img.alt as string) || '',
      width: (dimensions?.width as number) || 1200,
      height: (dimensions?.height as number) || 630,
      blurDataURL: metadata?.lqip as string,
    }
  }

  /**
   * Transform Sanity SEO object to SEOMetadata
   */
  static transformSEO(sanitySEO: unknown): SEOMetadata {
    const seo = sanitySEO as Record<string, unknown>
    return {
      title: (seo?.title as string) || '',
      description: (seo?.description as string) || '',
      keywords: (seo?.keywords as string[]) || [],
      ogImage: this.transformImage(seo?.ogImage),
      ogType: (seo?.ogType as string) || 'website',
      twitterCard: (seo?.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
      canonical: seo?.canonical as string,
      noindex: (seo?.noindex as boolean) || false,
      nofollow: (seo?.nofollow as boolean) || false,
    }
  }

  /**
   * Transform Sanity page to PageDTO
   */
  static transformPage(sanityPage: unknown): PageDTO {
    const page = sanityPage as Record<string, unknown>
    return {
      id: page._id as string,
      slug: (page.slug as Record<string, unknown>)?.current as string || '',
      title: (page.title as string) || '',
      description: (page.description as string) || '',
      content: page.content, // Keep Portable Text as-is
      seo: this.transformSEO(page.seo),
      publishedAt: new Date((page.publishedAt || page._createdAt) as string),
      updatedAt: new Date(page._updatedAt as string),
      locale: (page.locale as string) || 'en',
    }
  }

  /**
   * Transform Sanity settings to SettingsDTO
   */
  static transformSettings(sanitySettings: unknown): SettingsDTO {
    const settings = sanitySettings as Record<string, unknown>
    const social = settings.social as Record<string, unknown> || {}
    return {
      siteName: (settings.siteName as string) || 'My Site',
      siteUrl: (settings.siteUrl as string) || '',
      siteDescription: (settings.siteDescription as string) || '',
      logo: this.transformImage(settings.logo),
      favicon: this.transformImage(settings.favicon),
      social: {
        facebook: social.facebook as string,
        twitter: social.twitter as string,
        instagram: social.instagram as string,
        linkedin: social.linkedin as string,
        youtube: social.youtube as string,
        github: social.github as string,
      },
      gtmId: settings.gtmId as string,
      contactEmail: settings.contactEmail as string,
      defaultLocale: (settings.defaultLocale as string) || 'en',
      supportedLocales: (settings.supportedLocales as string[]) || ['en'],
    }
  }

  /**
   * Transform Sanity navigation to NavigationDTO
   */
  static transformNavigation(sanityNav: unknown): NavigationDTO {
    const transformNavItems = (items: unknown[] = []): NavItemDTO[] => {
      return items.map((item) => {
        const navItem = item as Record<string, unknown>
        return {
          id: (navItem._key || navItem._id) as string,
          label: (navItem.label as string) || '',
          href: (navItem.href as string) || '',
          target: navItem.target as '_blank' | '_self',
          children: navItem.children ? transformNavItems(navItem.children as unknown[]) : undefined,
        }
      })
    }

    const nav = sanityNav as Record<string, unknown>
    return {
      items: transformNavItems(nav.items as unknown[]),
    }
  }

  /**
   * Transform Sanity blog post to BlogPostDTO
   */
  static transformPost(sanityPost: unknown): BlogPostDTO {
    const basePage = this.transformPage(sanityPost)
    const post = sanityPost as Record<string, unknown>
    const author = post.author as Record<string, unknown>

    return {
      ...basePage,
      excerpt: (post.excerpt as string) || '',
      author: author
        ? {
            id: author._id as string,
            name: author.name as string,
            bio: author.bio as string,
            avatar: this.transformImage(author.avatar),
            social: author.social as Record<string, string>,
          }
        : undefined,
      categories: (post.categories as unknown[])?.map((cat) =>
        this.transformCategory(cat)
      ),
      tags: (post.tags as string[]) || [],
      featuredImage: this.transformImage(post.featuredImage),
      estimatedReadingTime: post.estimatedReadingTime as number,
    }
  }

  /**
   * Transform Sanity category to CategoryDTO
   */
  static transformCategory(sanityCategory: unknown): CategoryDTO {
    const category = sanityCategory as Record<string, unknown>
    return {
      id: category._id as string,
      name: (category.name as string) || '',
      slug: (category.slug as Record<string, unknown>)?.current as string || '',
      description: category.description as string,
      image: this.transformImage(category.image),
      order: category.order as number,
      showInNavigation: (category.showInNavigation as boolean) ?? true,
    }
  }

  /**
   * Transform Sanity product to ProductDTO
   */
  static transformProduct(sanityProduct: unknown): ProductDTO {
    const product = sanityProduct as Record<string, unknown>
    const category = product.category as Record<string, unknown>

    // Transform all product images
    const images = (product.images as unknown[] || [])
      .map((img) => this.transformImage(img))
      .filter((img): img is ImageDTO => img !== undefined)

    // Transform specifications
    const specifications = (product.specifications as Array<Record<string, unknown>> || [])
      .map((spec) => ({
        label: spec.label as string,
        value: spec.value as string,
      }))

    // Build SEO metadata
    const seo: SEOMetadata = product.seo
      ? this.transformSEO(product.seo)
      : {
          title: `${product.name as string} | Vista Store`,
          description: (product.shortDescription as string) || (product.description as string) || '',
          keywords: [
            product.name as string,
            product.brand as string,
            category?.name as string,
          ].filter(Boolean),
          ogImage: images[0],
          ogType: 'product',
          twitterCard: 'summary_large_image',
          noindex: false,
          nofollow: false,
        }

    return {
      id: product._id as string,
      name: (product.name as string) || '',
      slug: (product.slug as Record<string, unknown>)?.current as string || '',
      sku: product.sku as string,
      brand: (product.brand as string) || '',
      price: (product.price as number) || 0,
      compareAtPrice: product.compareAtPrice as number,
      description: (product.description as string) || '',
      shortDescription: product.shortDescription as string,
      images,
      category: category ? this.transformCategory(category) : {
        id: '',
        name: 'Uncategorized',
        slug: 'uncategorized',
        showInNavigation: false,
      },
      specifications,
      inStock: (product.inStock as boolean) ?? true,
      featured: (product.featured as boolean) ?? false,
      seo,
      publishedAt: new Date((product.publishedAt || product._createdAt) as string),
    }
  }

  /**
   * Transform Sanity homepage to HomepageDTO
   */
  static transformHomepage(sanityHomepage: unknown): HomepageDTO {
    const homepage = sanityHomepage as Record<string, unknown>
    const heroImages = homepage.heroImages as Record<string, unknown> || {}

    // Transform hero images with links
    const mainImage = heroImages.mainImage as Record<string, unknown>
    const topImage = heroImages.topImage as Record<string, unknown>
    const bottomImage = heroImages.bottomImage as Record<string, unknown>

    const transformImageWithLink = (img: Record<string, unknown>) => {
      const transformed = this.transformImage(img)
      return transformed ? { ...transformed, link: img.link as string } : undefined
    }

    // Transform featured categories (resolve references)
    const featuredCategories = (homepage.featuredCategories as unknown[] || [])
      .map((cat) => this.transformCategory(cat))
      .filter((cat): cat is CategoryDTO => cat !== undefined)

    return {
      heroTitle: homepage.heroTitle as string,
      heroSubtitle: homepage.heroSubtitle as string,
      heroImages: {
        mainImage: transformImageWithLink(mainImage) || {
          url: '',
          alt: '',
          width: 1200,
          height: 630,
        },
        topImage: transformImageWithLink(topImage) || {
          url: '',
          alt: '',
          width: 600,
          height: 400,
        },
        bottomImage: transformImageWithLink(bottomImage) || {
          url: '',
          alt: '',
          width: 600,
          height: 400,
        },
      },
      featuredCategories,
      whatsappNumber: homepage.whatsappNumber as string,
      storeLocation: homepage.storeLocation as string,
    }
  }
}
