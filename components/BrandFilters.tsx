'use client'

/**
 * Brand Filters Component
 * Client component for filtering brands with search and modern UI
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'

interface BrandFiltersProps {
    brands: string[]
    title: string
}

export default function BrandFilters({ brands, title }: BrandFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const t = useTranslations('products')
    const [searchQuery, setSearchQuery] = useState('')

    // Get current brand from URL
    const currentBrand = searchParams.get('brand')

    const handleBrandSelect = (brand: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (brand) {
            params.set('brand', brand)
        } else {
            params.delete('brand')
        }
        router.push(`/products?${params.toString()}`, { scroll: false })
    }

    // Filter brands based on search
    const filteredBrands = useMemo(() => {
        if (!searchQuery) return brands
        return brands.filter((brand) =>
            brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [brands, searchQuery])

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-sm font-bold uppercase tracking-wider text-gray-900">{title}</div>
                {currentBrand && (
                    <button
                        onClick={() => handleBrandSelect(null)}
                        className="text-[10px] font-semibold text-red-500 hover:text-red-700 uppercase tracking-wide transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Search Bar */}
            {brands.length > 5 && (
                <div className="relative mb-2">
                    <input
                        type="text"
                        placeholder={t('searchBrands')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pl-8 bg-gray-50"
                    />
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            )}

            <div className="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                {/* All Brands Option */}
                <label
                    className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${!currentBrand ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                >
                    <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                            type="radio"
                            name="brand"
                            checked={!currentBrand}
                            onChange={() => handleBrandSelect(null)}
                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-600 checked:border-[6px] transition-all cursor-pointer bg-white"
                        />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${!currentBrand ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                        {t('allBrands')}
                    </span>
                </label>

                {/* Filtered Brands List */}
                {filteredBrands.map((brand) => {
                    const isSelected = currentBrand === brand
                    return (
                        <label
                            key={brand}
                            className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="relative flex items-center justify-center w-5 h-5">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={isSelected}
                                    onChange={() => handleBrandSelect(brand)}
                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-600 checked:border-[6px] transition-all cursor-pointer bg-white"
                                />
                            </div>
                            <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-900'
                                }`}>
                                {brand}
                            </span>
                        </label>
                    )
                })}

                {filteredBrands.length === 0 && (
                    <div className="text-sm text-gray-500 py-2 text-center italic">
                        No brands found
                    </div>
                )}
            </div>
        </div>
    )
}
