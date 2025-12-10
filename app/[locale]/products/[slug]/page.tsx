/**
 * Product Detail Page
 * Detailed product view with specifications, images, and similar product recommendations
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCMSService } from '@/lib/cms'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getTranslations } from 'next-intl/server'
import { formatPrice, hasDiscount, calculateDiscount } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const cms = getCMSService()

  try {
    const product = await cms.getProductBySlug(slug)

    if (!product) {
      return {
        title: 'Product Not Found',
      }
    }

    return {
      title: `${product.name} | Vista Store`,
      description: product.shortDescription || product.description,
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description,
        images: product.images.map((img) => ({
          url: img.url,
          width: img.width,
          height: img.height,
          alt: img.alt,
        })),
      },
    }
  } catch (error) {
    return {
      title: 'Product Not Found',
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'product' })
  const cms = getCMSService()

  const storeName = process.env.NEXT_PUBLIC_SITE_NAME || 'Vista Store'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  // Fetch product
  let product
  try {
    product = await cms.getProductBySlug(slug)
  } catch (error) {
    console.error('Error fetching product:', error)
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Fetch categories for header and site settings
  let categories: Awaited<ReturnType<typeof cms.getCategories>> = {
    categories: [],
  }
  let siteSettings: Awaited<ReturnType<typeof cms.getSiteSettings>> = null
  try {
    ;[categories, siteSettings] = await Promise.all([
      cms.getCategories(),
      cms.getSiteSettings(),
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  // Fetch similar products (same category or brand)
  let similarProducts: typeof product[] = []
  try {
    const [categoryProducts, brandProducts] = await Promise.all([
      cms.getProducts({
        category: product.category.slug,
        limit: 8,
      }),
      cms.getProducts({
        brand: product.brand,
        limit: 8,
      }),
    ])

    // Combine and deduplicate, excluding current product
    const combined = [
      ...categoryProducts.data,
      ...brandProducts.data,
    ].filter((p) => p.id !== product.id)

    const uniqueMap = new Map(combined.map((p) => [p.id, p]))
    similarProducts = Array.from(uniqueMap.values()).slice(0, 4)
  } catch (error) {
    console.error('Error fetching similar products:', error)
  }

  const discount = hasDiscount(product)
    ? calculateDiscount(product.price, product.compareAtPrice!)
    : 0

  return (
    <>
      <Header categories={categories.categories} storeName={storeName} siteSettings={siteSettings} />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-brand-blue">
                {t('home')}
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-brand-blue">
                {t('products')}
              </Link>
              <span>/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-brand-blue"
              >
                {product.category.name}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
                {/* Product Images */}
                <div className="space-y-4">
                  {product.images[0] && (
                    <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        fill
                        className="object-contain"
                        priority
                      />
                      {discount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          -{discount}%
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-gray-900 text-white px-6 py-2 rounded-lg text-lg font-semibold">
                            {t('outOfStock')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(1, 5).map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  {/* Brand */}
                  {product.brand && (
                    <div className="text-sm text-brand-blue font-medium mb-2">
                      {product.brand}
                    </div>
                  )}

                  {/* Product Name */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>

                  {/* Short Description */}
                  {product.shortDescription && (
                    <p className="text-lg text-gray-600 mb-6">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {discount > 0 && product.compareAtPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    {discount > 0 && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        {t('save')} {formatPrice(product.compareAtPrice! - product.price)}
                      </div>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-6">
                    {product.inStock ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">{t('inStock')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">{t('outOfStock')}</span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp CTA */}
                  {product.inStock && whatsappNumber && (
                    <div className="mb-6">
                      <WhatsAppButton
                        product={product}
                        phoneNumber={whatsappNumber}
                        variant="primary"
                        size="lg"
                        className="w-full"
                      />
                      <p className="mt-3 text-sm text-gray-600 text-center">
                        {t('buyViaWhatsApp')}
                      </p>
                    </div>
                  )}

                  {/* Trust Signals */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-brand-blue mb-1">
                        <svg
                          className="w-8 h-8 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">
                        {t('authenticGuarantee')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-brand-green mb-1">
                        <svg
                          className="w-8 h-8 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">
                        {t('securePayment')}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-brand-blue mb-1">
                        <svg
                          className="w-8 h-8 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">{t('support')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="border-t border-gray-200">
                <div className="p-6 md:p-8">
                  {/* Description */}
                  {product.description && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('description')}
                      </h2>
                      <div className="prose max-w-none text-gray-600">
                        <p>{product.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Specifications */}
                  {product.specifications && product.specifications.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('specifications')}
                      </h2>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          {product.specifications.map((spec, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-200 last:border-b-0"
                            >
                              <dt className="font-medium text-gray-900 mb-1 sm:mb-0">
                                {spec.label}
                              </dt>
                              <dd className="text-gray-600">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Products / Recommendations */}
        {similarProducts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('youMayAlsoLike')}
                </h2>
                <p className="text-gray-600">
                  {t('similarProducts')}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard key={similarProduct.id} product={similarProduct} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="inline-block px-6 py-3 border-2 border-brand-blue text-brand-blue rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition-colors"
                >
                  {t('viewAllInCategory', { category: product.category.name })}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Why Buy From Us */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('whyBuyFromUs')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-brand-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('qualityAssurance')}
                </h3>
                <p className="text-gray-600">
                  {t('qualityAssuranceDesc')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-brand-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('competitivePrices')}
                </h3>
                <p className="text-gray-600">
                  {t('competitivePricesDesc')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-brand-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('expertSupport')}
                </h3>
                <p className="text-gray-600">
                  {t('expertSupportDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
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
