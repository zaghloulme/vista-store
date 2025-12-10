/**
 * Example Unit Test
 * Tests for utility functions and components
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductCard from '../components/ProductCard'
import type { ProductDTO } from '../lib/cms/types/dtos'

// Mock Next.js modules
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    [key: string]: unknown
  }) => <img src={src} alt={alt} {...props} />,
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      outOfStock: 'Out of Stock',
      viewDetails: 'View Details',
    }
    return translations[key] || key
  },
}))

describe('ProductCard Component', () => {
  const mockProduct: ProductDTO = {
    id: '1',
    name: 'Test Laptop',
    slug: 'test-laptop',
    sku: 'TEST-001',
    brand: 'TestBrand',
    price: 50000,
    compareAtPrice: 60000,
    description: 'A test laptop',
    shortDescription: 'Test short description',
    images: [
      {
        url: '/test-image.jpg',
        alt: 'Test Laptop',
        width: 800,
        height: 600,
      },
    ],
    category: {
      id: 'cat1',
      name: 'Laptops',
      slug: 'laptops',
      showInNavigation: true,
    },
    specifications: [
      { label: 'CPU', value: 'Intel i7' },
      { label: 'RAM', value: '16GB' },
    ],
    inStock: true,
    featured: true,
    seo: {
      title: 'Test Laptop',
      description: 'Test',
      keywords: [],
      ogType: 'product',
      twitterCard: 'summary_large_image',
      noindex: false,
      nofollow: false,
    },
    publishedAt: new Date('2025-01-01'),
  }

  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Laptop')).toBeInTheDocument()
  })

  it('renders product brand', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('TestBrand')).toBeInTheDocument()
  })

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/50,000/)).toBeInTheDocument()
  })

  it('shows discount badge when compareAtPrice is set', () => {
    render(<ProductCard product={mockProduct} />)
    // Should show discount: (60000 - 50000) / 60000 * 100 = 16.67% ≈ 17%
    expect(screen.getByText(/-17%/)).toBeInTheDocument()
  })

  it('shows out of stock badge when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false }
    render(<ProductCard product={outOfStockProduct} />)
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('renders view details link', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('View Details')).toBeInTheDocument()
  })
})

describe('SEO Metadata Utils', () => {
  it('merges metadata objects correctly', async () => {
    const { mergeMetadata } = await import('../lib/seo/metadata')

    const base = {
      title: 'Base Title',
      description: 'Base Description',
    }

    const override = {
      title: 'Override Title',
    }

    const result = mergeMetadata(base, override)

    expect(result.title).toBe('Override Title')
    expect(result.description).toBe('Base Description')
  })
})
