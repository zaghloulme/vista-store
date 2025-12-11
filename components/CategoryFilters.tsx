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

  // Parse selected categories from URL
  const categoryParam = searchParams.get('category')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? categoryParam.split(',') : []
  )

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    } else {
      params.delete('category')
    }
    router.push(`/products?${params.toString()}`, { scroll: false })
  }, [selectedCategories, router, searchParams])

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categorySlug)) {
        return prev.filter((slug) => slug !== categorySlug)
      } else {
        return [...prev, categorySlug]
      }
    })
  }

  const handleClearAll = () => setSelectedCategories([])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold uppercase tracking-wider text-gray-900">{title}</div>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[10px] font-semibold text-red-600 hover:text-red-700 uppercase tracking-wide transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {categories
          .filter((cat) => cat.showInNavigation)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((category) => {
            const isSelected = selectedCategories.includes(category.slug)
            return (
              <label
                key={category.id}
                className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
              >
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category.slug)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                  />
                  <svg
                    className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'
                  }`}>
                  {category.name}
                </span>
              </label>
            )
          })}
      </div>
    </div>
  )
}
