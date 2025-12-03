'use client'

/**
 * Header Component
 * Main navigation header with logo, categories, and mobile menu
 */

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { CategoryDTO } from '@/lib/cms/types/dtos'

interface HeaderProps {
  categories: CategoryDTO[]
  storeName: string
}

export default function Header({ categories, storeName }: HeaderProps) {
  const t = useTranslations('nav')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Filter categories that should show in navigation
  const navCategories = categories
    .filter((cat) => cat.showInNavigation)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <nav className="container mx-auto px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-black hover:text-[var(--brand-blue)] transition-colors"
          >
            {storeName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-base font-medium text-gray-700 hover:text-black transition-colors"
            >
              {t('home')}
            </Link>

            <Link
              href="/products"
              className="text-base font-medium text-gray-700 hover:text-black transition-colors"
            >
              {t('products')}
            </Link>

            {/* Categories Dropdown */}
            {navCategories.length > 0 && (
              <div className="relative group">
                <button className="text-base font-medium text-gray-700 hover:text-black transition-colors flex items-center gap-1">
                  {t('categories')}
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
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

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {navCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-blue)] transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--brand-blue)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="py-4 space-y-1">
              <Link
                href="/"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home')}
              </Link>

              <Link
                href="/products"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('products')}
              </Link>

              {/* Mobile Categories */}
              {navCategories.length > 0 && (
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    {t('categories')}
                  </p>
                  <div className="space-y-1 pl-4">
                    {navCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="block py-2 text-sm text-gray-600 hover:text-[var(--brand-blue)]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
