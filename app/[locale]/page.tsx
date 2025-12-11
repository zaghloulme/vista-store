/**
 * Home Page
 * Vista Store homepage with split hero and featured products
 */

import Link from 'next/link'
import Image from 'next/image'
import { getCMSService } from '@/lib/cms'
import SplitHero from '@/components/SplitHero'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import BrandCarousel from '@/components/BrandCarousel'
import BenefitsBar from '@/components/BenefitsBar'
import ProductSlider from '@/components/ProductSlider'

// Force dynamic rendering during build to handle CMS configuration
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const cms = getCMSService()

  // Fetch homepage data with error handling
  let homepageData: Awaited<ReturnType<typeof cms.getHomepageSettings>> = null
  let siteSettings: Awaited<ReturnType<typeof cms.getSiteSettings>> = null
  let featuredProducts: Awaited<ReturnType<typeof cms.getProducts>> = {
    data: [],
    total: 0,
    limit: 8,
    offset: 0,
  }
  let moreProducts: Awaited<ReturnType<typeof cms.getProducts>> = {
    data: [],
    total: 0,
    limit: 8,
    offset: 0,
  }
  let newlyAddedProducts: Awaited<ReturnType<typeof cms.getProducts>> = {
    data: [],
    total: 0,
    limit: 8,
    offset: 0,
  }
  let categories: Awaited<ReturnType<typeof cms.getCategories>> = {
    categories: [],
  }
  let brands: Awaited<ReturnType<typeof cms.getBrands>> = []
  let categoryProducts: Array<{
    category: { id: string; name: string; slug: string; description?: string }
    products: Awaited<ReturnType<typeof cms.getProducts>>['data']
  }> = []

  try {
    // First fetch homepage data and settings
    ;[homepageData, siteSettings, categories, brands] = await Promise.all([
      cms.getHomepageSettings(),
      cms.getSiteSettings(),
      cms.getCategories(),
      cms.getBrands(),
    ])

    // Get product limits from CMS or use defaults
    const featuredLimit = homepageData?.productDisplaySettings?.featuredProductsLimit || 8
    const moreProductsLimit = homepageData?.productDisplaySettings?.moreProductsLimit || 8

      // Fetch products with CMS-configured limits
      ;[featuredProducts, moreProducts, newlyAddedProducts] = await Promise.all([
        cms.getProducts({ featured: true, limit: featuredLimit }),
        cms.getProducts({ limit: moreProductsLimit, offset: featuredLimit }),
        cms.getProducts({ limit: 8, offset: 0 }), // Newly added products
      ])

    // Fetch products for each featured category
    const categoryProductsPromises = (homepageData?.featuredCategories || []).map(async (category) => {
      const products = await cms.getProducts({
        category: category.slug,
        limit: 8,
      })
      return {
        category,
        products: products.data,
      }
    })

    categoryProducts = await Promise.all(categoryProductsPromises)
  } catch (error) {
    console.error('❌ CMS FETCH ERROR:', error)
    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
    }
  }

  console.log('📊 Data Status:', {
    homepage: !!homepageData,
    siteSettings: !!siteSettings,
    products: featuredProducts.data.length,
    categories: categories.categories.length,
    brands: brands.length,
  })

  // Get WhatsApp number from homepage settings or env
  const whatsappNumber =
    homepageData?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    ''

  // Get store name from env
  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Vista Store'

  return (
    <>
      <Header
        categories={categories.categories}
        storeName={storeName}
        siteSettings={siteSettings}
      />

      <main>
        {/* SEO: Main heading for homepage - visually hidden */}
        <h1 className="sr-only">{storeName} - Your Premier Tech Store</h1>

        {/* Hero Section - Full width carousel */}
        {homepageData && <SplitHero homepageData={homepageData} />}

        {/* Benefits Bar #1 - Static promotions (from CMS with fallback) */}
        <BenefitsBar
          benefits={homepageData?.benefitsBarTop && homepageData.benefitsBarTop.length > 0
            ? homepageData.benefitsBarTop
            : [
              { icon: '💳', text: 'Installments Up To 5 Months With No Interest' },
              { icon: '🛡️', text: '1-Year Warranty on Products' },
              { icon: '🚚', text: 'Free Shipping Over 1999 EGP' },
            ]
          }
        />

        {/* Brand Carousel - Brands we carry */}
        <BrandCarousel brands={brands} />

        {/* Featured Products - Horizontal Slider (loading-eg style) */}
        {featuredProducts.data.length > 0 && (
          <ProductSlider
            products={featuredProducts.data}
            title={homepageData?.highlightedSection?.title || 'Featured Products'}
            description={homepageData?.highlightedSection?.description || 'Discover our top picks for laptops, accessories, and tech gear'}
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 5 }}
          />
        )}

        {/* Newly Added Products - Horizontal Slider */}
        {newlyAddedProducts?.data && newlyAddedProducts.data.length > 0 && (
          <ProductSlider
            products={newlyAddedProducts.data}
            title="New Arrivals"
            description="Recently added to our collection"
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 5 }}
          />
        )}

        {/* Categories Section - 5 column grid (loading-eg style) */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="mb-8 md:mb-10 text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                {homepageData?.categoriesSection?.title || 'Shop by Category'}
              </h2>
              <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">
                {homepageData?.categoriesSection?.description || "Find exactly what you're looking for"}
              </p>
            </div>

            {homepageData?.featuredCategories && homepageData.featuredCategories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
                {homepageData.featuredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group flex flex-col items-center p-4 md:p-6 bg-white rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {category.image?.url ? (
                      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden">
                        <Image
                          src={category.image.url}
                          alt={category.image.alt || category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square mb-4 rounded-xl bg-blue-100 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300">
                        📦
                      </div>
                    )}
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-blue-600 transition-colors text-center">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-500 mb-4">No categories featured yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Category-Specific Product Sections */}
        {categoryProducts.map(({ category, products }) => (
          products.length > 0 && (
            <ProductSlider
              key={category.id}
              products={products}
              title={category.name}
              description={category.description || `Browse our ${category.name.toLowerCase()} collection`}
              slidesPerView={{ mobile: 1, tablet: 2, desktop: 5 }}
            />
          )
        ))}

        {/* More Products - Horizontal Slider */}
        {moreProducts.data.length > 0 && (
          <ProductSlider
            products={moreProducts.data}
            title={homepageData?.moreProductsSection?.title || 'More Products'}
            description={homepageData?.moreProductsSection?.description || 'Continue browsing our extensive collection'}
            slidesPerView={{ mobile: 1, tablet: 2, desktop: 5 }}
          />
        )}

        {/* View All Products CTA */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 group"
            >
              View All Products
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* Floating WhatsApp Button */}
        {whatsappNumber && (
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            variant="floating"
            size="lg"
          />
        )}
      </main>

      <Footer
        storeName={storeName}
        storeLocation={homepageData?.storeLocation}
        whatsappNumber={whatsappNumber}
        siteSettings={siteSettings}
      />
    </>
  )
}
