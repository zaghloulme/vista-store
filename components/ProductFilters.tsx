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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-sm text-gray-600">
        Showing <span className="font-bold text-gray-900">{resultCount}</span> products
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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