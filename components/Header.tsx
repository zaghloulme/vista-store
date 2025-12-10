'use client'

/**
 * Header Component - Modern Glassmorphic Design
 * Main navigation header with logo, categories, and mobile menu
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

  // Filter categories - limit to top 5-7 for clean navigation
  const navCategories = categories
    .filter((cat) => cat.showInNavigation)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 6) // Limit to 6 categories max

  // Handle scroll for sticky header behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}>
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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left aligned */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 hover:text-brand-blue transition-colors">
              {storeName}
            </h1>
          </Link>

          {/* Center: Search Bar (Desktop) - Prominent like Amazon */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2.5 pl-12 pr-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-brand-blue transition-colors text-sm"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right: Navigation Links + Icons */}
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Products Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-blue transition-colors flex items-center gap-1.5">
                  Products
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mega Menu Dropdown */}
                {productsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[600px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* All Products Link */}
                      <Link
                        href="/products"
                        className="col-span-2 pb-3 border-b border-gray-100 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                            Browse All Products
                          </span>
                          <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>

                      {/* Category Grid */}
                      {navCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="group p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {category.image?.url ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={category.image.url}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-lg">📦</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-gray-900 group-hover:text-brand-blue transition-colors">
                                {category.name}
                              </h3>
                            </div>
                          </div>
                          {category.description && (
                            <p className="text-xs text-gray-500 line-clamp-2 ml-16">
                              {category.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/deals"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-blue transition-colors"
              >
                Deals
              </Link>

              <Link
                href="/"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-brand-blue transition-colors"
              >
                About
              </Link>
            </div>

            {/* Mobile Search Icon */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
          <div className="md:hidden pb-4 animate-in slide-in-from-top">
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-2.5 pl-12 pr-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-brand-blue transition-colors text-sm"
                autoFocus
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-2 animate-in slide-in-from-top">
            <div className="py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Products Section */}
              <div className="px-4 py-2">
                <div className="font-semibold text-gray-900 mb-2">Products</div>
                <Link
                  href="/products"
                  className="block py-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                {navCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="block py-2 text-sm text-gray-700 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/deals"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </Link>

              <Link
                href="/"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
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