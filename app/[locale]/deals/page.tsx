/**
 * Deals Page
 * Shows all products with active discounts
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { getCMSService } from '@/lib/cms'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

interface DealsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: DealsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'deals' })

  return {
    title: 'Deals & Discounts | Vista Store',
    description: 'Shop our best deals and discounts on tech products. Limited time offers!',
  }
}

export default async function DealsPage({ params }: DealsPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'deals' })
  const cms = getCMSService()

  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Vista Store'

  // Fetch all products
  const allProducts = await cms.getProducts({ limit: 100 })

  // Filter products with discounts (compareAtPrice > price)
  const dealsProducts = allProducts.data.filter(
    (product) => product.compareAtPrice && product.compareAtPrice > product.price
  )

  // Get categories for header and site settings
  const [categories, siteSettings] = await Promise.all([
    cms.getCategories(),
    cms.getSiteSettings()
  ])

  // Calculate discount percentages and sort by highest discount
  const productsWithDiscounts = dealsProducts
    .map((product) => ({
      ...product,
      discountPercent: Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100
      ),
    }))
    .sort((a, b) => b.discountPercent - a.discountPercent)

  return (
    <>
      <Header categories={categories.categories} storeName={storeName} siteSettings={siteSettings} />

      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-orange-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block mb-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse">
                🔥 LIMITED TIME OFFERS
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Exclusive Deals & Discounts
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6">
                Save big on our best products. Deals updated daily!
              </p>
              <div className="flex items-center justify-center gap-4 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Up to 50% Off</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Free Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            {/* Stats Bar */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-bold text-brand-blue">{productsWithDiscounts.length}</span> amazing deals
                  </p>
                </div>
                {productsWithDiscounts.length > 0 && (
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-600">Biggest Discount:</span>
                      <span className="ml-2 font-bold text-red-600">
                        {productsWithDiscounts[0].discountPercent}% OFF
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average Savings:</span>
                      <span className="ml-2 font-bold text-green-600">
                        {Math.round(
                          productsWithDiscounts.reduce((acc, p) => acc + p.discountPercent, 0) /
                            productsWithDiscounts.length
                        )}
                        % OFF
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {productsWithDiscounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsWithDiscounts.map((product) => (
                  <ProductCard key={product.id} product={product} priority={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-block p-8 bg-gray-50 rounded-2xl mb-4">
                  <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Deals Available Right Now
                </h3>
                <p className="text-gray-600 mb-6">
                  Check back soon for amazing discounts on our products!
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:bg-brand-blue-dark transition-colors"
                >
                  Browse All Products
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {productsWithDiscounts.length > 0 && (
          <section className="py-16 bg-blue-600 text-white">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Don't Miss Out on These Deals!
              </h2>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Limited stock available. These prices won't last long.
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Shop Deals Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer
        storeName={storeName}
        siteSettings={siteSettings}
      />
    </>
  )
}
