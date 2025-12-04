/**
 * Products Listing Page
 * Browse all products with filtering, sorting, and search
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCMSService } from '@/lib/cms'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
  const categorySlug = resolvedSearchParams.category
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
  let brands: string[] = []

  try {
    ;[productsResponse, categories] = await Promise.all([
      cms.getProducts({
        category: categorySlug,
        brand,
        minPrice,
        maxPrice,
        search,
        limit: 50,
      }),
      cms.getCategories(),
    ])

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
  let products = [...productsResponse.data]
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

  // Get current category name
  const currentCategory = categories.categories.find(
    (cat) => cat.slug === categorySlug
  )

  return (
    <>
      <Header categories={categories.categories} storeName={storeName} />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {currentCategory ? currentCategory.name : t('allProducts')}
            </h1>
            {currentCategory?.description && (
              <p className="text-gray-600 text-lg">
                {currentCategory.description}
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
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {t('category')}
                    </h3>
                    <div className="space-y-2">
                      <a
                        href="/products"
                        className={`block text-sm py-1 ${
                          !categorySlug
                            ? 'text-brand-blue font-semibold'
                            : 'text-gray-600 hover:text-brand-blue'
                        }`}
                      >
                        {t('allCategories')}
                      </a>
                      {categories.categories
                        .filter((cat) => cat.showInNavigation)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((category) => (
                          <a
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            className={`block text-sm py-1 ${
                              categorySlug === category.slug
                                ? 'text-brand-blue font-semibold'
                                : 'text-gray-600 hover:text-brand-blue'
                            }`}
                          >
                            {category.name}
                          </a>
                        ))}
                    </div>
                  </div>
                )}

                {/* Brand Filter */}
                {brands.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {t('brand')}
                    </h3>
                    <div className="space-y-2">
                      <a
                        href={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
                        className={`block text-sm py-1 ${
                          !brand
                            ? 'text-brand-blue font-semibold'
                            : 'text-gray-600 hover:text-brand-blue'
                        }`}
                      >
                        {t('allBrands')}
                      </a>
                      {brands.map((b) => (
                        <a
                          key={b}
                          href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}brand=${b}`}
                          className={`block text-sm py-1 ${
                            brand === b
                              ? 'text-brand-blue font-semibold'
                              : 'text-gray-600 hover:text-brand-blue'
                          }`}
                        >
                          {b}
                        </a>
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
                    <a
                      href={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
                      className={`block text-sm py-1 ${
                        !minPrice && !maxPrice
                          ? 'text-brand-blue font-semibold'
                          : 'text-gray-600 hover:text-brand-blue'
                      }`}
                    >
                      {t('allPrices')}
                    </a>
                    <a
                      href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}maxPrice=10000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      {t('under')} EGP 10,000
                    </a>
                    <a
                      href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}minPrice=10000&maxPrice=30000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      EGP 10,000 - 30,000
                    </a>
                    <a
                      href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}minPrice=30000&maxPrice=50000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      EGP 30,000 - 50,000
                    </a>
                    <a
                      href={`/products?${categorySlug ? `category=${categorySlug}&` : ''}minPrice=50000`}
                      className="block text-sm py-1 text-gray-600 hover:text-brand-blue"
                    >
                      {t('above')} EGP 50,000
                    </a>
                  </div>
                </div>

                {/* Clear Filters */}
                {(categorySlug || brand || minPrice || maxPrice) && (
                  <a
                    href="/products"
                    className="block w-full text-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t('clearFilters')}
                  </a>
                )}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  {t('showing')} <span className="font-semibold">{products.length}</span>{' '}
                  {t('products')}
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">
                    {t('sortBy')}:
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => {
                      const params = new URLSearchParams(window.location.search)
                      params.set('sort', e.target.value)
                      window.location.href = `/products?${params.toString()}`
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="featured">{t('featured')}</option>
                    <option value="price-asc">{t('priceLowToHigh')}</option>
                    <option value="price-desc">{t('priceHighToLow')}</option>
                    <option value="name">{t('name')}</option>
                  </select>
                </div>
              </div>

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
                  <a
                    href="/products"
                    className="inline-block px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    {t('clearFilters')}
                  </a>
                </div>
              )}

              {/* Call to Action - Contact Us */}
              {whatsappNumber && products.length > 0 && (
                <div className="mt-12 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">
                    {t('needHelp')}
                  </h2>
                  <p className="text-white/90 mb-6">
                    {t('contactUs')}
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(t('inquiryMessage'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {t('contactWhatsApp')}
                  </a>
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
      />
    </>
  )
}
