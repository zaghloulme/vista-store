/**
 * Products Listing Page
 * Browse all products with filtering, sorting, and search
 */

import { Metadata } from 'next'
import Link from 'next/link'
import { getCMSService } from '@/lib/cms'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductFilters from '@/components/ProductFilters'
import CategoryFilters from '@/components/CategoryFilters'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    search?: string
    sort?: string
  }>
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'products' })

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const t = await getTranslations({ locale, namespace: 'products' })
  const cms = getCMSService()

  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Vista Store'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  // Get filters from search params
  const categoryParam = resolvedSearchParams.category
  const categorySlugs = categoryParam ? categoryParam.split(',').filter(Boolean) : []
  const brand = resolvedSearchParams.brand
  const minPrice = resolvedSearchParams.minPrice
    ? parseInt(resolvedSearchParams.minPrice)
    : undefined
  const maxPrice = resolvedSearchParams.maxPrice
    ? parseInt(resolvedSearchParams.maxPrice)
    : undefined
  const search = resolvedSearchParams.search
  const sort = resolvedSearchParams.sort || 'featured'

  // Fetch products and categories
  let productsResponse: Awaited<ReturnType<typeof cms.getProducts>> = {
    data: [],
    total: 0,
    limit: 20,
    offset: 0,
  }
  let categories: Awaited<ReturnType<typeof cms.getCategories>> = {
    categories: [],
  }
  let siteSettings: Awaited<ReturnType<typeof cms.getSiteSettings>> = null
  let brands: string[] = []

  try {
    ;[categories, siteSettings] = await Promise.all([
      cms.getCategories(),
      cms.getSiteSettings(),
    ])

    // Fetch products - handle multiple categories with OR logic
    if (categorySlugs.length > 0) {
      // Fetch products for each category and combine
      const categoryProductsPromises = categorySlugs.map((slug) =>
        cms.getProducts({
          category: slug,
          brand,
          minPrice,
          maxPrice,
          search,
          limit: 50,
        })
      )
      const categoryProductsResults = await Promise.all(categoryProductsPromises)

      // Combine and deduplicate products by ID
      const allProducts = categoryProductsResults.flatMap((result) => result.data)
      const uniqueProducts = Array.from(
        new Map(allProducts.map((p) => [p.id, p])).values()
      )

      productsResponse = {
        data: uniqueProducts,
        total: uniqueProducts.length,
        limit: 50,
        offset: 0,
      }
    } else {
      // No category filter - fetch all products
      productsResponse = await cms.getProducts({
        brand,
        minPrice,
        maxPrice,
        search,
        limit: 50,
      })
    }

    // Extract unique brands from all products for filter
    const allProductsForBrands = await cms.getProducts({ limit: 100 })
    brands = [
      ...new Set(
        allProductsForBrands.data.map((p) => p.brand).filter(Boolean)
      ),
    ].sort()
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  // Sort products based on selected sort option
  const products = [...productsResponse.data]
  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'featured':
    default:
      products.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
  }

  // Get current category names for display
  const selectedCategoryNames = categorySlugs
    .map((slug) => categories.categories.find((cat) => cat.slug === slug)?.name)
    .filter(Boolean)
    .join(', ')

  return (
    <>
      <Header categories={categories.categories} storeName={storeName} siteSettings={siteSettings} />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {selectedCategoryNames || t('allProducts')}
            </h1>
            {selectedCategoryNames && categorySlugs.length === 1 && (
              <p className="text-gray-600 text-lg">
                {categories.categories.find((cat) => cat.slug === categorySlugs[0])?.description}
              </p>
            )}
            <div className="mt-4 text-sm text-gray-500">
              {t('showing')} {products.length} {t('products')}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('filters')}
                </h2>

                {/* Category Filter */}
                {categories.categories.length > 0 && (
                  <CategoryFilters
                    categories={categories.categories}
                    title={t('category')}
                    allCategoriesLabel={t('allCategories')}
                  />
                )}

                {/* Brand Filter */}
                {brands.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {t('brand')}
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href={`/products${categoryParam ? `?category=${categoryParam}` : ''}`}
                        className={`block text-sm py-1 ${
                          !brand
                            ? 'text-brand-blue font-semibold'
                            : 'text-gray-600 hover:text-brand-blue'
                        }`}
                      >
                        {t('allBrands')}
                      </Link>
                      {brands.map((b) => (
                        <Link
                          key={b}
                          href={`/products?${categoryParam ? `category=${categoryParam}&` : ''}brand=${b}`}
                          className={`block text-sm py-1 ${
                            brand === b
                              ? 'text-brand-blue font-semibold'
                              : 'text-gray-600 hover:text-brand-blue'
                          }`}
                        >
                          {b}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t('priceRange')}
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href={`/products${categoryParam ? `?category=${categoryParam}` : ''}`}
                      className={`block text-sm py-1 ${
                        !minPrice && !maxPrice
                          ? 'text-brand-blue font-semibold'
                          : 'text-gray-600 hover:text-brand-blue'
                      }`}
                    >
                      {t('allPrices')}
                    </Link>
                    <Link
                      href={`/products?${categoryParam ? `category=${categoryParam}&` : ''}maxPrice=10000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      {t('under')} EGP 10,000
                    </Link>
                    <Link
                      href={`/products?${categoryParam ? `category=${categoryParam}&` : ''}minPrice=10000&maxPrice=30000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      EGP 10,000 - 30,000
                    </Link>
                    <Link
                      href={`/products?${categoryParam ? `category=${categoryParam}&` : ''}minPrice=30000&maxPrice=50000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      EGP 30,000 - 50,000
                    </Link>
                    <Link
                      href={`/products?${categoryParam ? `category=${categoryParam}&` : ''}minPrice=50000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      {t('above')} EGP 50,000
                    </Link>
                  </div>
                </div>

                {/* Clear Filters */}
                {(categoryParam || brand || minPrice || maxPrice) && (
                  <Link
                    href="/products"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border-2 border-red-500 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {t('clearFilters')}
                  </Link>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <ProductFilters resultCount={products.length} />

              {/* Products Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('noProductsFound')}
                  </h3>
                  <p className="text-gray-600 mb-6">{t('tryAdjustingFilters')}</p>
                  <Link
                    href="/products"
                    className="inline-block px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    {t('clearFilters')}
                  </Link>
                </div>
              )}


            </div>
          </div>
        </div>
      </main>
      <Footer
        storeName={storeName}
        storeLocation="Alexandria, Egypt"
        whatsappNumber={whatsappNumber}
        siteSettings={siteSettings}
      />
    </>
  )
}
