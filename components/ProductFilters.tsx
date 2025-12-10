'use client'

/**
 * Product Filters Component
 * Client component for filtering and sorting products
 */

import { useRouter, useSearchParams } from 'next/navigation'

interface ProductFiltersProps {
  resultCount: number
}

export default function ProductFilters({ resultCount }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || 'featured'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{resultCount}</span> products
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-600">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  )
}