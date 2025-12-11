'use client'

/**
 * Price Range Slider Component
 * Interactive dual-handle slider for filtering products by price
 */

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface PriceRangeSliderProps {
    minPrice?: number
    maxPrice?: number
}

export default function PriceRangeSlider({ minPrice = 0, maxPrice = 100000 }: PriceRangeSliderProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get initial price range from URL or use defaults
    const [priceRange, setPriceRange] = useState({
        min: parseInt(searchParams.get('minPrice') || minPrice.toString()),
        max: parseInt(searchParams.get('maxPrice') || maxPrice.toString())
    })

    const handlePriceChange = (type: 'min' | 'max', value: number) => {
        setPriceRange(prev => ({
            ...prev,
            [type]: value
        }))
    }

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString())
        const categoryParam = searchParams.get('category')

        // Preserve category filter
        if (categoryParam) {
            params.set('category', categoryParam)
        }

        if (priceRange.min > minPrice) {
            params.set('minPrice', priceRange.min.toString())
        } else {
            params.delete('minPrice')
        }
        if (priceRange.max < maxPrice) {
            params.set('maxPrice', priceRange.max.toString())
        } else {
            params.delete('maxPrice')
        }
        router.push(`/products?${params.toString()}`, { scroll: false })
    }

    const resetPriceFilter = () => {
        setPriceRange({ min: minPrice, max: maxPrice })
        const params = new URLSearchParams(searchParams.toString())
        params.delete('minPrice')
        params.delete('maxPrice')
        router.push(`/products?${params.toString()}`, { scroll: false })
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price)
    }

    const isFiltered = priceRange.min > minPrice || priceRange.max < maxPrice

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-bold uppercase tracking-wider text-gray-900">Price Range</div>
                {isFiltered && (
                    <button
                        onClick={resetPriceFilter}
                        className="text-[10px] font-semibold text-red-600 hover:text-red-700 uppercase tracking-wide transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Dual Range Slider */}
            <div className="relative h-6 mb-4 px-1">
                {/* Track */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    {/* Active Range */}
                    <div
                        className="absolute h-full bg-blue-600 transition-all rounded-full"
                        style={{
                            left: `${((priceRange.min - minPrice) / (maxPrice - minPrice)) * 100}%`,
                            right: `${100 - ((priceRange.max - minPrice) / (maxPrice - minPrice)) * 100}%`
                        }}
                    />
                </div>

                {/* Min Slider */}
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', Math.min(parseInt(e.target.value), priceRange.max - 1000))}
                    onMouseUp={applyPriceFilter}
                    onTouchEnd={applyPriceFilter}
                    className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                />

                {/* Max Slider */}
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', Math.max(parseInt(e.target.value), priceRange.min + 1000))}
                    onMouseUp={applyPriceFilter}
                    onTouchEnd={applyPriceFilter}
                    className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-600 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform"
                />
            </div>

            {/* Price Display */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-1 w-[45%] items-center">
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Min</span>
                    <div className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-center">
                        {formatPrice(priceRange.min)}
                    </div>
                </div>
                <div className="text-gray-300 font-light mt-4">—</div>
                <div className="flex flex-col gap-1 w-[45%] items-center">
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Max</span>
                    <div className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 text-center">
                        {formatPrice(priceRange.max)}
                    </div>
                </div>
            </div>
        </div>
    )
}
