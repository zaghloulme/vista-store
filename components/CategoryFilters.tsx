'use client'

/**
 * Category Filters Component
 * Client component for multi-select category filtering with checkboxes
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { CategoryDTO } from '@/lib/cms/types/dtos'

interface CategoryFiltersProps {
  categories: CategoryDTO[]
  title: string
  allCategoriesLabel: string
}

export default function CategoryFilters({
  categories,
  title,
  allCategoriesLabel,
}: CategoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse selected categories from URL (comma-separated)
  const categoryParam = searchParams.get('category')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? categoryParam.split(',') : []
  )

  // Update URL when selected categories change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    } else {
      params.delete('category')
    }

    router.push(`/products?${params.toString()}`)
  }, [selectedCategories, router, searchParams])

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categorySlug)) {
        // Remove category
        return prev.filter((slug) => slug !== categorySlug)
      } else {
        // Add category
        return [...prev, categorySlug]
      }
    })
  }

  const handleClearAll = () => {
    setSelectedCategories([])
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-2">
        {categories
          .filter((cat) => cat.showInNavigation)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 text-sm py-1 cursor-pointer hover:text-blue-600 group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.slug)}
                onChange={() => handleCategoryToggle(category.slug)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span
                className={`${
                  selectedCategories.includes(category.slug)
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 group-hover:text-blue-600'
                }`}
              >
                {category.name}
              </span>
            </label>
          ))}
      </div>
      {selectedCategories.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
        </div>
      )}
    </div>
  )
}
