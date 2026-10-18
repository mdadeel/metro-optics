import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import SEO from '../components/SEO';
import ProductCard from '../components/product/ProductCard';
import { Slider } from '../components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useProductStore, getMaxPriceFromProducts } from '../stores/useProductStore';
import { BRANDS, CATEGORIES, FRAME_SHAPES, SORT_OPTIONS } from '../lib/constants';
import { formatPrice } from '../lib/utils';
import { buildBreadcrumbSchema, buildItemListSchema, isDemoCatalog } from '../lib/seo';

const ITEMS_PER_PAGE = 12;
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function FilterPanel({
  products,
  activeCategory,
  setActiveCategory,
  selectedBrands,
  toggleBrand,
  selectedShapes,
  toggleShape,
  priceRange,
  setPriceRange,
  maxPrice,
  inStockOnly,
  setInStockOnly,
  onClear,
  onClose,
  closeButtonRef,
  filteredCount,
  mobileOpen,
}) {
  return (
    <>
      <div className="mo-shop-filter-heading">
        <div>
          <p className="mo-shop-eyebrow">NARROW YOUR SEARCH</p>
          <h2 id="mo-shop-filter-title">Refine your view</h2>
        </div>
        <div className="mo-shop-filter-heading__actions">
          <button type="button" className="mo-shop-reset" onClick={onClear}>
            <RotateCcw size={13} aria-hidden="true" /> Reset
          </button>
          <button ref={closeButtonRef} type="button" className="mo-shop-close" onClick={onClose} aria-label="Close filters">
            <X size={19} aria-hidden="true" />
          </button>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'brands', 'shape', 'availability']} className="mo-shop-accordion">
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="mo-shop-category-options">
              <button type="button" onClick={() => setActiveCategory('all')} aria-pressed={activeCategory === 'all'} className={activeCategory === 'all' ? 'is-selected' : ''}>
                <span>All eyewear</span><small>{products.length}</small>
              </button>
              {CATEGORIES.map((category) => {
                const count = products.filter((product) => {
                  const cat = product.category?.toLowerCase() || '';
                  const target = category.slug.toLowerCase();
                  if (cat === target) return true;
                  if (target === 'optical' && (cat === 'eyeglasses' || cat === 'frames')) return true;
                  if (target === 'eyeglasses' && cat === 'optical') return true;
                  if (target === 'blue-light' && (cat.includes('blue') || cat === 'blue-light')) return true;
                  if (target === 'reading' && cat.includes('read')) return true;
                  if (target === 'sports' && cat.includes('sport')) return true;
                  return false;
                }).length;
                return (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => setActiveCategory(category.slug)}
                    aria-pressed={activeCategory === category.slug}
                    className={activeCategory === category.slug ? 'is-selected' : ''}
                  >
                    <span>{category.name}</span><small>{count}</small>
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price range</AccordionTrigger>
          <AccordionContent>
            <div className="mo-shop-price-filter">
              <Slider
                value={priceRange}
                min={0}
                max={maxPrice}
                step={maxPrice > 1000 ? 50 : 10}
                onValueChange={setPriceRange}
                aria-label="Price range"
              />
              <div><span>{formatPrice(priceRange[0])}</span><span>{formatPrice(priceRange[1])}</span></div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="mo-shop-checkbox-list">
              {BRANDS.map((brand) => {
                const count = products.filter((product) => product.brand === brand).length;
                const checked = selectedBrands.includes(brand);
                return (
                  <label key={brand}>
                    <span><input type="checkbox" checked={checked} onChange={() => toggleBrand(brand)} /><span>{brand}</span></span>
                    <small>{count}</small>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shape">
          <AccordionTrigger>Frame shape</AccordionTrigger>
          <AccordionContent>
            <div className="mo-shop-checkbox-list">
              {FRAME_SHAPES.map((shape) => {
                const count = products.filter((product) => product.shape === shape).length;
                const checked = selectedShapes.includes(shape);
                return (
                  <label key={shape}>
                    <span><input type="checkbox" checked={checked} onChange={() => toggleShape(shape)} /><span>{shape}</span></span>
                    <small>{count}</small>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <label className="mo-shop-availability">
              <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
              <span>Ready to ship</span>
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {mobileOpen && (
        <div className="mo-shop-filter-footer">
          <button type="button" onClick={onClose}>Show {filteredCount} {filteredCount === 1 ? 'style' : 'styles'}</button>
        </div>
      )}
    </>
  );
}

function FilterChip({ children, onRemove, label }) {
  return (
    <span className="mo-shop-chip">
      <span>{children}</span>
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`}><X size={13} aria-hidden="true" /></button>
    </span>
  );
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const dealsParam = searchParams.get('deals');
  const queryParam = searchParams.get('q') || '';
  const appliedParams = useRef({ category: undefined, brand: undefined, deals: undefined, query: undefined });
  const filterPanelRef = useRef(null);
  const filterTriggerRef = useRef(null);
  const filterCloseRef = useRef(null);

  const {
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
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

  const maxPrice = useMemo(() => getMaxPriceFromProducts(products), [products]);

  useEffect(() => {
    if (priceRange[1] < maxPrice && priceRange[1] === 500) {
      setPriceRange([priceRange[0], maxPrice]);
    }
  }, [maxPrice, priceRange, setPriceRange]);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    if (appliedParams.current.category !== categoryParam) {
      setActiveCategory(categoryParam || 'all');
      appliedParams.current.category = categoryParam;
    }
    if (appliedParams.current.brand !== brandParam) {
      const previousBrand = appliedParams.current.brand;
      if (previousBrand && selectedBrands.includes(previousBrand)) toggleBrand(previousBrand);
      if (brandParam && !selectedBrands.includes(brandParam)) toggleBrand(brandParam);
      appliedParams.current.brand = brandParam;
    }
    if (appliedParams.current.deals !== dealsParam) {
      if (dealsParam === 'true') setSortBy('price-low');
      appliedParams.current.deals = dealsParam;
    }
    if (appliedParams.current.query !== queryParam) {
      setSearchQuery(queryParam);
      appliedParams.current.query = queryParam;
    }
  }, [categoryParam, brandParam, dealsParam, queryParam, selectedBrands, setActiveCategory, setSearchQuery, setSortBy, toggleBrand]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event) => {
      if (event.matches) setMobileFilterOpen(false);
    };
    desktopQuery.addEventListener('change', closeOnDesktop);
    return () => desktopQuery.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!mobileFilterOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    filterCloseRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileFilterOpen(false);
        filterTriggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(filterPanelRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || []);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !filterPanelRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !filterPanelRef.current?.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileFilterOpen]);

  const filteredProducts = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (visiblePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, visiblePage]);

  const activeCategoryObj = CATEGORIES.find((category) => category.slug === activeCategory);
  const collectionTitle = activeCategory === 'all'
    ? 'Everyday eyewear, considered.'
    : `${activeCategoryObj?.name || activeCategory} collection`;
  const seoTitle = activeCategory === 'all'
    ? 'Shop Eyeglasses & Sunglasses'
    : `${activeCategoryObj?.name || activeCategory} Collection`;
  const shopDescription = `Browse ${activeCategoryObj?.name?.toLowerCase() || 'eyeglasses, sunglasses and everyday frames'} at Metro Optics. Refine by style, brand, price and availability, then review current product details.`;
  const catalogIsDemo = isDemoCatalog(products);
  const collectionSchema = !catalogIsDemo && !searchQuery
    ? buildItemListSchema(paginatedProducts, {
        path: '/shop',
        startPosition: (visiblePage - 1) * ITEMS_PER_PAGE + 1,
      })
    : null;
  const priceRangeActive = priceRange[0] !== 0 || priceRange[1] !== 500;
  const activeFilterCount = Number(activeCategory !== 'all') + selectedBrands.length + selectedShapes.length + Number(inStockOnly) + Number(priceRangeActive) + Number(Boolean(searchQuery));
  const resultStart = filteredProducts.length === 0 ? 0 : (visiblePage - 1) * ITEMS_PER_PAGE + 1;
  const resultEnd = Math.min(visiblePage * ITEMS_PER_PAGE, filteredProducts.length);

  const closeFilterDrawer = () => {
    setMobileFilterOpen(false);
    requestAnimationFrame(() => filterTriggerRef.current?.focus());
  };

  const handleClearFilters = () => {
    clearAllFilters();
    setCurrentPage(1);
  };

  const activeChips = (
    <div className="mo-shop-active-filters" aria-label="Active filters">
      {activeCategory !== 'all' && <FilterChip label="category" onRemove={() => setActiveCategory('all')}>{activeCategoryObj?.name || activeCategory}</FilterChip>}
      {searchQuery && <FilterChip label="search" onRemove={() => setSearchQuery('')}>“{searchQuery}”</FilterChip>}
      {selectedBrands.map((brand) => <FilterChip key={brand} label={brand} onRemove={() => toggleBrand(brand)}>{brand}</FilterChip>)}
      {selectedShapes.map((shape) => <FilterChip key={shape} label={shape} onRemove={() => toggleShape(shape)}>{shape}</FilterChip>)}
      {priceRangeActive && <FilterChip label="price range" onRemove={() => setPriceRange([0, 500])}>{formatPrice(priceRange[0])}–{formatPrice(priceRange[1])}</FilterChip>}
      {inStockOnly && <FilterChip label="availability" onRemove={() => setInStockOnly(false)}>Ready to ship</FilterChip>}
      {activeFilterCount > 0 && <button type="button" className="mo-shop-clear-all" onClick={handleClearFilters}>Clear all</button>}
    </div>
  );

  return (
    <div className="mo-shop-page">
      <SEO
        title={seoTitle}
        description={shopDescription}
        url="/shop"
        noIndex={catalogIsDemo || Boolean(searchQuery)}
        structuredData={[
          collectionSchema,
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Shop', path: '/shop' },
          ]),
        ]}
      />
      <div className="mo-shop-shell">
        <div className="mo-shop-breadcrumb"><Breadcrumb items={[
          { label: 'Shop', to: '/shop' },
          ...(activeCategory !== 'all' ? [{ label: activeCategoryObj?.name || activeCategory }] : []),
        ]} /></div>

        <div className="mo-shop-mobile-bar">
          <button
            type="button"
            ref={filterTriggerRef}
            className="mo-shop-mobile-filter"
            onClick={() => setMobileFilterOpen(true)}
            aria-expanded={mobileFilterOpen}
            aria-controls="mo-shop-filter-panel"
          >
            <SlidersHorizontal size={16} aria-hidden="true" /> Filters
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>
          <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'style' : 'styles'}</span>
        </div>

        <div className="mo-shop-layout">
          <aside
            ref={filterPanelRef}
            id="mo-shop-filter-panel"
            className={`mo-shop-sidebar${mobileFilterOpen ? ' is-open' : ''}`}
            aria-labelledby="mo-shop-filter-title"
            aria-modal={mobileFilterOpen ? 'true' : undefined}
            role={mobileFilterOpen ? 'dialog' : undefined}
          >
            <FilterPanel
              products={products}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              selectedShapes={selectedShapes}
              toggleShape={toggleShape}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onClear={handleClearFilters}
              onClose={closeFilterDrawer}
              closeButtonRef={filterCloseRef}
              filteredCount={filteredProducts.length}
              mobileOpen={mobileFilterOpen}
            />
          </aside>

          <section className="mo-shop-collection" aria-labelledby="mo-shop-title">
            <header className="mo-shop-collection-heading">
              <div>
                <p className="mo-shop-eyebrow">METRO OPTICS / THE COLLECTION</p>
                <h1 id="mo-shop-title">{collectionTitle}</h1>
                <p>Frames selected for how you see and how you live.</p>
              </div>
              <span className="mo-shop-collection-mark">MO / 01</span>
            </header>

            <div className="mo-shop-toolbar">
              <div className="mo-shop-toolbar__results" aria-live="polite">
                <strong>{filteredProducts.length}</strong>
                <span>{filteredProducts.length === 1 ? 'style' : 'styles'} found</span>
                {filteredProducts.length > 0 && <small>Showing {resultStart}–{resultEnd}</small>}
              </div>

              <form className="mo-shop-search" role="search" onSubmit={(event) => event.preventDefault()}>
                <Search size={16} aria-hidden="true" />
                <label className="sr-only" htmlFor="mo-shop-search-input">Search this collection</label>
                <input id="mo-shop-search-input" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search this collection" />
                {searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={14} /></button>}
              </form>

              <div className="mo-shop-toolbar__controls">
                <label className="mo-shop-sort">
                  <span>Sort</span>
                  <span className="mo-shop-sort__select">
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
                      {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <ChevronDown size={14} aria-hidden="true" />
                  </span>
                </label>
                <div className="mo-shop-view-toggle" role="group" aria-label="Product view">
                  <button type="button" className={viewMode === 'grid' ? 'is-active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode === 'grid'}><Grid2X2 size={16} /></button>
                  <button type="button" className={viewMode === 'list' ? 'is-active' : ''} onClick={() => setViewMode('list')} aria-label="List view" aria-pressed={viewMode === 'list'}><List size={17} /></button>
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && activeChips}

            {filteredProducts.length === 0 ? (
              <div className="mo-shop-empty">
                <p className="mo-shop-eyebrow">NO MATCHES JUST YET</p>
                <h2>Try a different point of view.</h2>
                <p>Adjust your filters or clear them to see the full collection.</p>
                <button type="button" onClick={handleClearFilters}>Clear filters</button>
              </div>
            ) : (
              <div className={`mo-shop-product-grid${viewMode === 'list' ? ' is-list' : ''}`}>
                {paginatedProducts.map((product) => <ProductCard key={product.id} product={product} variant={viewMode} />)}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mo-shop-pagination" aria-label="Product pages">
                <button type="button" onClick={() => setCurrentPage(Math.max(1, visiblePage - 1))} disabled={visiblePage === 1} aria-label="Previous page"><ChevronLeft size={16} /> Previous</button>
                <div className="mo-shop-pagination__pages">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={page === visiblePage ? 'is-current' : ''}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={page === visiblePage ? 'page' : undefined}
                    >{page}</button>
                  ))}
                </div>
                <span className="mo-shop-pagination__status">Page <strong>{visiblePage}</strong> of {totalPages}</span>
                <button type="button" onClick={() => setCurrentPage(Math.min(totalPages, visiblePage + 1))} disabled={visiblePage === totalPages} aria-label="Next page">Next <ChevronRight size={16} /></button>
              </nav>
            )}
          </section>
        </div>
      </div>

      {mobileFilterOpen && <button type="button" className="mo-shop-backdrop" onClick={closeFilterDrawer} aria-label="Close filter panel" />}
    </div>
  );
}
