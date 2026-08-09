import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductsStore, useUIStore } from '../../store'
import { productService } from '../../services'
import { ModernProductCard, ModernButton, ModernCard, ModernInput } from '../components/ui'
import { Funnel as Filter, MagnifyingGlass as Search, X, SlidersHorizontal, GridFour as Grid3X3, List as Menu } from "@phosphor-icons/react"
import { cn } from '../../lib/utils'

const Shop = () => {
  const { products, loading, getCategories } = useProductsStore()
  const { searchQuery, setSearchQuery } = useUIStore()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Local state
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured')
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('categories')?.split(',') || []
  )
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice')) || 0,
    parseInt(searchParams.get('maxPrice')) || 50000
  ])
  const [viewMode, setViewMode] = useState('grid')

  // Initialize products on mount
  useEffect(() => {
    const unsubscribe = productService.initializeProducts()
    return unsubscribe
  }, [])

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (sortBy !== 'featured') params.set('sort', sortBy)
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','))
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0])
    if (priceRange[1] < 50000) params.set('maxPrice', priceRange[1])
    if (searchQuery) params.set('search', searchQuery)
    
    setSearchParams(params)
  }, [sortBy, selectedCategories, priceRange, searchQuery, setSearchParams])

  // Get unique categories
  const categories = useMemo(() => getCategories(), [getCategories])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category))
    }

    // Price filter
    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'popular':
        filtered = [...filtered].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) =>
          (b.rating || 0) - (a.rating || 0)
        )
        break
      default:
        break
    }

    return filtered
  }, [products, searchQuery, selectedCategories, priceRange, sortBy])

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setPriceRange([0, 50000])
    setSortBy('featured')
  }

  const hasActiveFilters = selectedCategories.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 50000 || 
    searchQuery

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                Eyewear Catalog
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Showing {filteredAndSortedProducts.length} of {products.length} premium frames
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'grid' 
                      ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    viewMode === 'list' 
                      ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Menu size={16} />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold py-2.5 px-4 focus:ring-primary focus:border-primary appearance-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest First</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="price-low">Sort: Price: Low to High</option>
                <option value="price-high">Sort: Price: High to Low</option>
                <option value="rating">Sort: Highest Rated</option>
              </select>

              {/* Mobile Filter Button */}
              <ModernButton
                variant="secondary"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
              </ModernButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="hidden lg:block">
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className={cn(
                'gap-y-12 gap-x-8',
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'space-y-6'
              )}>
                {filteredAndSortedProducts.map((product) => (
                  <ModernProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
              </div>
            ) : (
              <ModernCard className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    No products found
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <ModernButton onClick={clearFilters}>
                    Clear all filters
                  </ModernButton>
                </div>
              </ModernCard>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                categories={categories}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Filter Sidebar Component
const FilterSidebar = ({
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  clearFilters,
  hasActiveFilters
}) => {
  return (
    <ModernCard className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Filter size={18} />
          Filters
        </h3>
        {hasActiveFilters && (
          <ModernButton variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </ModernButton>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-sm font-bold mb-4 uppercase tracking-wide">Category</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-bold mb-4 uppercase tracking-wide">Price Range (BDT)</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ModernInput
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              placeholder="Min"
              className="w-full"
            />
            <span className="text-gray-400">-</span>
            <ModernInput
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              placeholder="Max"
              className="w-full"
            />
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>৳0</span>
            <span>৳50,000</span>
          </div>
        </div>
      </div>
    </ModernCard>
  )
}

export { Shop }