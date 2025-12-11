'use client'

/**
 * Header Component - Creative High-Conversion Design
 * Modern navbar with gradient accents, prominent search, and strategic CTAs
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { CategoryDTO } from '@/lib/cms/types/dtos'
import type { SiteSettingsDTO } from '@/lib/cms/types/dtos'
import AnnouncementBar from './AnnouncementBar'

interface HeaderProps {
  categories: CategoryDTO[]
  storeName: string
  siteSettings?: SiteSettingsDTO | null
}

export default function Header({ categories, storeName, siteSettings }: HeaderProps) {
  const t = useTranslations('nav')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Filter categories
  const navCategories = categories
    .filter((cat) => cat.showInNavigation)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 6)

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white border-b border-gray-100'}`}>
      {/* Announcement Bar */}
      {siteSettings?.announcementBar?.enabled && siteSettings?.announcementBar?.message && (
        <AnnouncementBar
          message={siteSettings.announcementBar.message}
          backgroundColor={siteSettings.announcementBar.backgroundColor}
          textColor={siteSettings.announcementBar.textColor}
        />
      )}

      {/* Main Navigation */}
      <nav className="container mx-auto" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo - Enhanced with brand color */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600">
              {storeName}
            </h1>
          </Link>

          {/* Center: Enhanced Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <input
                type="search"
                placeholder="Search for products, brands, categories..."
                className="w-full px-6 py-3.5 pl-14 pr-32 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all text-sm bg-gray-50 hover:bg-white"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transition-all text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Right: Navigation + Icons */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Products Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 rounded-xl hover:bg-blue-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Products
                  <svg className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Mega Menu */}
                {productsOpen && (
                  <div className="absolute top-full right-0 mt-3 w-[650px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-2 gap-5">
                      {/* All Products Link - Featured */}
                      <Link
                        href="/products"
                        className="col-span-2 p-5 rounded-2xl bg-blue-600 text-white group hover:bg-blue-700 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold block mb-1">Browse All Products</span>
                            <span className="text-sm text-blue-100">Explore our complete collection</span>
                          </div>
                          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>

                      {/* Category Grid */}
                      {navCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="group p-5 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all border-2 border-transparent hover:border-blue-200"
                        >
                          <div className="flex items-center gap-4 mb-3">
                            {category.image?.url ? (
                              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-blue-300 transition-all">
                                <img
                                  src={category.image.url}
                                  alt={category.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <span className="text-white text-2xl">📦</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
                                {category.name}
                              </h3>
                            </div>
                          </div>
                          {category.description && (
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {category.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Deals - With Badge */}
              <Link
                href="/deals"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Deals
              </Link>

              {/* About */}
              <Link
                href="/"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
              >
                About
              </Link>
            </div>

            {/* Mobile Search Icon */}
            <button
              className="md:hidden p-3 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden pb-4 px-4 animate-in slide-in-from-top">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 pr-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-sm bg-gray-50"
                autoFocus
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 mt-2 animate-in slide-in-from-top">
            <div className="py-4 space-y-2 px-4">
              <Link
                href="/"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Products Section */}
              <div className="px-4 py-2">
                <div className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Products
                </div>
                <Link
                  href="/products"
                  className="block py-2.5 px-4 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                {navCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block py-2 px-4 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/deals"
                className="block px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl hover:shadow-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔥 Deals
              </Link>

              <Link
                href="/"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}