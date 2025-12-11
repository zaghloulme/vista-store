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

    const img = sanityImage as Record<string, unknown>
    const asset = img.asset as Record<string, unknown> | undefined

    // Check if asset exists (it can be either a reference or a populated object)
    if (!asset) return undefined

    const builder = urlForImage(sanityImage)
    if (!builder) return undefined

    const imageUrl = builder.width(1200).height(630).url()
    if (!imageUrl) return undefined

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
   * Transform brand logo image without cropping
   * Preserves original aspect ratio
   */
  static transformBrandLogo(sanityImage: unknown): ImageDTO | undefined {
    if (!sanityImage) return undefined

    const img = sanityImage as Record<string, unknown>
    const asset = img.asset as Record<string, unknown> | undefined

    // Check if asset exists (it can be either a reference or a populated object)
    if (!asset) return undefined

    const builder = urlForImage(sanityImage)
    if (!builder) return undefined

    // Don't force dimensions - preserve aspect ratio
    // Just optimize with auto format and quality
    const imageUrl = builder.auto('format').quality(90).url()
    if (!imageUrl) return undefined

    const metadata = asset?.metadata as Record<string, unknown> | undefined
    const dimensions = metadata?.dimensions as Record<string, unknown> | undefined

    return {
      url: imageUrl,
      alt: (img.alt as string) || '',
      width: (dimensions?.width as number) || 800,
      height: (dimensions?.height as number) || 600,
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
      ogImage: SanityTransformer.transformImage(seo?.ogImage),
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
      seo: SanityTransformer.transformSEO(page.seo),
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
      logo: SanityTransformer.transformImage(settings.logo),
      favicon: SanityTransformer.transformImage(settings.favicon),
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
    const basePage = SanityTransformer.transformPage(sanityPost)
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
          avatar: SanityTransformer.transformImage(author.avatar),
          social: author.social as Record<string, string>,
        }
        : undefined,
      categories: (post.categories as unknown[])?.map((cat) =>
        SanityTransformer.transformCategory(cat)
      ),
      tags: (post.tags as string[]) || [],
      featuredImage: SanityTransformer.transformImage(post.featuredImage),
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
      image: SanityTransformer.transformImage(category.image),
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
      .map((img) => SanityTransformer.transformImage(img))
      .filter((img): img is ImageDTO => img !== undefined)

    // Transform specifications
    const specifications = (product.specifications as Array<Record<string, unknown>> || [])
      .map((spec) => ({
        label: spec.label as string,
        value: spec.value as string,
      }))

    // Build SEO metadata
    const seo: SEOMetadata = product.seo
      ? SanityTransformer.transformSEO(product.seo)
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
      category: category ? SanityTransformer.transformCategory(category) : {
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
    const mainImages = heroImages.mainImages as unknown[] || []
    const mainImage = heroImages.mainImage as Record<string, unknown> // Old single image for backwards compatibility
    const topImage = heroImages.topImage as Record<string, unknown>
    const bottomImage = heroImages.bottomImage as Record<string, unknown>

    const transformImageWithLink = (img: Record<string, unknown> | undefined) => {
      if (!img) {
        return undefined
      }
      const transformed = SanityTransformer.transformImage(img)
      if (!transformed) {
        return undefined
      }
      return { ...transformed, link: img.link as string }
    }

    // Transform main images array - handle backwards compatibility
    let transformedMainImages = mainImages
      .map((img) => transformImageWithLink(img as Record<string, unknown>))
      .filter((img) => img !== undefined) as Array<ImageDTO & { link?: string }>

    // If mainImages is empty but old mainImage exists, use it
    if (transformedMainImages.length === 0 && mainImage) {
      const oldMainImage = transformImageWithLink(mainImage)
      if (oldMainImage) {
        transformedMainImages = [oldMainImage]
      }
    }

    // Transform featured categories (resolve references)
    const featuredCategories = (homepage.featuredCategories as unknown[] || [])
      .map((cat) => SanityTransformer.transformCategory(cat))
      .filter((cat): cat is CategoryDTO => cat !== undefined)

    // Transform side images
    const transformedTopImage = transformImageWithLink(topImage)
    const transformedBottomImage = transformImageWithLink(bottomImage)

    return {
      heroTitle: homepage.heroTitle as string,
      heroSubtitle: homepage.heroSubtitle as string,
      heroImages: {
        mainImages: transformedMainImages.length > 0 ? transformedMainImages : [{
          url: '',
          alt: '',
          width: 1200,
          height: 630,
        }],
        topImage: transformedTopImage || {
          url: '',
          alt: '',
          width: 600,
          height: 400,
        },
        bottomImage: transformedBottomImage || {
          url: '',
          alt: '',
          width: 600,
          height: 400,
        },
      },
      featuredCategories,
      highlightedSection: homepage.highlightedSection as { title: string; description: string } || null,
      categoriesSection: homepage.categoriesSection as { title: string; description: string } || null,
      moreProductsSection: homepage.moreProductsSection as { title: string; description: string } || null,
      whyBuyFromUs: (homepage.whyBuyFromUs as unknown[] || []) as Array<{ title: string; description: string; icon: string }>,
      whatsappNumber: homepage.whatsappNumber as string,
      storeLocation: homepage.storeLocation as string,
      benefitsBarTop: (homepage.benefitsBarTop as unknown[] || []) as Array<{ icon: string; text: string }>,
      benefitsBarBottom: (homepage.benefitsBarBottom as unknown[] || []) as Array<{ icon: string; text: string }>,
      productDisplaySettings: homepage.productDisplaySettings as { featuredProductsLimit?: number; moreProductsLimit?: number } || undefined,
    }
  }
}
