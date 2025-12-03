/**
 * Home Page
 * Vista Store homepage with split hero and featured products
 */

import { getCMSService } from '@/lib/cms'
import SplitHero from '@/components/SplitHero'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

// Force dynamic rendering during build to handle CMS configuration
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const cms = getCMSService()

  // Fetch homepage data with error handling
  let homepageData: Awaited<ReturnType<typeof cms.getHomepageSettings>> = null
  let featuredProducts: Awaited<ReturnType<typeof cms.getProducts>> = {
    data: [],
    total: 0,
    limit: 8,
    offset: 0,
  }
  let categories: Awaited<ReturnType<typeof cms.getCategories>> = {
    categories: [],
  }

  try {
    ;[homepageData, featuredProducts, categories] = await Promise.all([
      cms.getHomepageSettings(),
      cms.getProducts({ featured: true, limit: 8 }),
      cms.getCategories(),
    ])
  } catch (error) {
    // Gracefully handle CMS errors during build (Sanity not configured yet)
    console.warn('CMS not configured - showing placeholder content:', error)
  }

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
      />

      <main>
        {/* Split Hero Section */}
        {homepageData && <SplitHero homepageData={homepageData} />}

        {/* Featured Products Section */}
        {featuredProducts.data.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Discover our top picks for laptops, accessories, and tech gear
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.data.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={whatsappNumber}
                  priority={index < 4}
                />
              ))}
            </div>

            {/* View All Products CTA */}
            <div className="mt-12 text-center">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                View All Products
              </a>
            </div>
          </section>
        )}

        {/* Featured Categories */}
        {homepageData?.featuredCategories &&
          homepageData.featuredCategories.length > 0 && (
            <section className="bg-gray-50 py-12">
              <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Shop by Category
                  </h2>
                  <p className="text-gray-600">
                    Find exactly what you're looking for
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {homepageData.featuredCategories.map((category) => (
                    <a
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="group bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                    >
                      <div className="text-4xl mb-3">
                        {/* Placeholder icon - can be replaced with category.image */}
                        📦
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-[var(--brand-blue)] transition-colors">
                        {category.name}
                      </h3>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

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
      />
    </>
  )
}
