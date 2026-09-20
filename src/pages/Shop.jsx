import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  LayoutGrid,
  Grid3X3,
  List,
  RotateCcw,
  Check,
  ChevronDown,
  X,
  Search,
} from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import ProductCard from '../components/product/ProductCard';
import ProductQuickView from '../components/product/ProductQuickView';
import { Slider } from '../components/ui/slider';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';
import { useProductStore } from '../stores/useProductStore';
import { CATEGORIES, BRANDS, FRAME_SHAPES, LENS_TYPES, SORT_OPTIONS } from '../../src/lib/constants';
import { formatPrice } from '../lib/utils';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const dealsParam = searchParams.get('deals');

  const {
    products,
    activeCategory,
    setActiveCategory,
    selectedBrands,
    toggleBrand,
    selectedShapes,
    toggleShape,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    clearAllFilters,
    getFilteredProducts,
  } = useProductStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync URL search params to store
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (brandParam && !selectedBrands.includes(brandParam)) {
      toggleBrand(brandParam);
    }
    if (dealsParam === 'true') {
      setSortBy('price-low');
    }
  }, [categoryParam, brandParam, dealsParam, setActiveCategory, toggleBrand, selectedBrands, setSortBy]);

  const filteredProducts = getFilteredProducts();

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === activeCategory);

  return (
    <div className="max-w-[1320px] mx-auto px-4 py-6">
      {/* Breadcrumb Trail */}
      <Breadcrumb
        items={[
          { label: 'Shop', to: '/shop' },
          ...(activeCategory && activeCategory !== 'all'
            ? [{ label: activeCategoryObj?.name || activeCategory }]
            : []),
        ]}
      />

      {/* Main Layout: Filters Sidebar (Left) + Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter Products</span>
          </button>
          <span className="text-xs text-gray-500">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {/* Sidebar Filters Desktop (and Mobile Drawer) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 p-6 overflow-y-auto shadow-2xl transition-transform duration-300 lg:static lg:w-auto lg:p-0 lg:shadow-none lg:z-auto lg:translate-x-0 ${
            mobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase">
              Filter By
            </h3>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <span>Filters</span>
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Filter Accordions */}
            <Accordion type="multiple" defaultValue={['category', 'price', 'brands', 'shape']}>
              {/* Category */}
              <AccordionItem value="category">
                <AccordionTrigger>Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`w-full text-left text-xs font-semibold px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        activeCategory === 'all'
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-[11px] text-gray-400">({products.length})</span>
                    </button>
                    {CATEGORIES.map((cat) => {
                      const count = products.filter((p) => p.category === cat.slug).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.slug)}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                            activeCategory === cat.slug
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className="text-[11px] text-gray-400">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Price Range */}
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={500}
                      step={10}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Brands */}
              <AccordionItem value="brands">
                <AccordionTrigger>Brands</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {BRANDS.map((brand) => {
                      const count = products.filter((p) => p.brand === brand).length;
                      const checked = selectedBrands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-primary transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleBrand(brand)}
                              className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span>{brand}</span>
                          </div>
                          <span className="text-[11px] text-gray-400">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Frame Shapes */}
              <AccordionItem value="shape">
                <AccordionTrigger>Frame Shape</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {FRAME_SHAPES.map((shape) => {
                      const count = products.filter((p) => p.shape === shape).length;
                      const checked = selectedShapes.includes(shape);
                      return (
                        <label
                          key={shape}
                          className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-primary transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleShape(shape)}
                              className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span>{shape}</span>
                          </div>
                          <span className="text-[11px] text-gray-400">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* In Stock Only */}
              <AccordionItem value="stock">
                <AccordionTrigger>Availability</AccordionTrigger>
                <AccordionContent>
                  <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                    <span>In-Stock Ready to Ship</span>
                  </label>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>

        {/* Product Catalog Grid (Right 3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Control Bar: Total count, active chips, view toggles, sort */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white capitalize leading-tight">
                {activeCategory && activeCategory !== 'all'
                  ? `${activeCategoryObj?.name || activeCategory} Collection`
                  : 'All Eyewear Models'}
              </h2>
              <p className="text-xs text-gray-500">
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-semibold hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid / List View Toggles */}
              <div className="hidden sm:flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedBrands.length > 0 ||
            selectedShapes.length > 0 ||
            activeCategory !== 'all' ||
            inStockOnly) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-gray-400 font-semibold">Active:</span>

              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                  Category: {activeCategory}
                  <button onClick={() => setActiveCategory('all')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {b}
                  <button onClick={() => toggleBrand(b)}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              ))}

              {selectedShapes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {s}
                  <button onClick={() => toggleShape(s)}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              ))}

              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:underline font-bold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid or List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                No matching frames found
              </p>
              <p className="text-xs text-gray-500 mt-1 mb-4">
                Try loosening your filter criteria or adjusting price range.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm"
                >
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-primary">
                      {product.brand}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-lg font-black text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductQuickView />
    </div>
  );
}
