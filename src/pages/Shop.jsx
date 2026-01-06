import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import { Link } from 'react-router-dom';
import { Filter, X, Search, ChevronDown, Home, SlidersHorizontal } from 'lucide-react';

const Shop = () => {
    const { products } = useProducts();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // Get search query from URL
    const urlSearchQuery = new URLSearchParams(window.location.search).get('search') || '';
    const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
    const [sortBy, setSortBy] = useState('featured');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Get unique categories
    const categories = [...new Set(products.map(p => p.category))];

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        // Price filter
        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered = [...filtered].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered = [...filtered].sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'popular':
                filtered = [...filtered].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
                break;
            case 'rating':
                filtered = [...filtered].sort((a, b) =>
                    (b.ratings?.average || 0) - (a.ratings?.average || 0)
                );
                break;
            default:
                break;
        }

        return filtered;
    }, [products, searchQuery, selectedCategories, priceRange, sortBy]);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategories([]);
        setPriceRange([0, 10000]);
        setSortBy('featured');
    };

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setTimeout(() => setQuickViewProduct(null), 300);
    };

    return (
        <div className="shop-page">
            <div className="shop-container">
                {/* Breadcrumbs */}
                <nav className="shop-breadcrumbs">
                    <Link to="/" className="shop-breadcrumb-link">
                        <Home size={16} />
                        Home
                    </Link>
                    <span className="shop-breadcrumb-separator">/</span>
                    <span className="shop-breadcrumb-current">Shop</span>
                </nav>

                {/* Header */}
                <div className="shop-header">
                    <div className="shop-header-left">
                        {/* Title and product count removed as per request */}
                    </div>

                    {/* Mobile Filter Button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="shop-filter-btn-mobile"
                    >
                        <SlidersHorizontal size={20} />
                        Filters
                    </button>
                </div>

                {/* Search and Sort Bar */}
                <div className="shop-toolbar">
                    {/* Search */}
                    <div className="shop-search">
                        <Search className="shop-search-icon" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="shop-search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="shop-search-clear"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="shop-sort">
                        <label htmlFor="sort" className="shop-sort-label">Sort by:</label>
                        <div className="shop-sort-select-wrapper">
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="shop-sort-select"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                            <ChevronDown className="shop-sort-icon" size={16} />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="shop-content">
                    {/* Desktop Sidebar */}
                    <aside className="shop-sidebar">
                        <FilterSidebar
                            categories={categories}
                            products={products}
                            selectedCategories={selectedCategories}
                            toggleCategory={toggleCategory}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            clearFilters={clearFilters}
                        />
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {isFilterOpen && (
                        <div className="shop-filter-drawer-overlay" onClick={() => setIsFilterOpen(false)}>
                            <div className="shop-filter-drawer" onClick={(e) => e.stopPropagation()}>
                                <div className="shop-filter-drawer-header">
                                    <h2 className="shop-filter-drawer-title">Filters</h2>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="shop-filter-drawer-close"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="shop-filter-drawer-content">
                                    <FilterSidebar
                                        categories={categories}
                                        products={products}
                                        selectedCategories={selectedCategories}
                                        toggleCategory={toggleCategory}
                                        priceRange={priceRange}
                                        setPriceRange={setPriceRange}
                                        clearFilters={clearFilters}
                                    />
                                </div>
                                <div className="shop-filter-drawer-footer">
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="shop-filter-drawer-apply"
                                    >
                                        View {filteredAndSortedProducts.length} Products
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="shop-products">
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="shop-products-grid">
                                {filteredAndSortedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={handleQuickView}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="shop-empty-state">
                                <div className="shop-empty-icon">🔍</div>
                                <h3 className="shop-empty-title">No products found</h3>
                                <p className="shop-empty-text">
                                    Try adjusting your filters or search query
                                </p>
                                <button onClick={clearFilters} className="shop-empty-btn">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <ProductQuickView
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={closeQuickView}
            />
        </div>
    );
};

// FilterSidebar component extracted to avoid creating during render
const FilterSidebar = ({
    categories,
    products,
    selectedCategories,
    toggleCategory,
    priceRange,
    setPriceRange,
    clearFilters
}) => (
    <div className="shop-filters">
        <div className="shop-filters-header">
            <h3 className="shop-filters-title">Filters</h3>
            <button onClick={clearFilters} className="shop-filters-clear">
                Clear All
            </button>
        </div>

        {/* Categories */}
        <div className="shop-filter-section">
            <h4 className="shop-filter-title">Categories</h4>
            <div className="shop-filter-options">
                {categories.map((category) => (
                    <label key={category} className="shop-filter-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                        />
                        <span>{category}</span>
                        <span className="shop-filter-count">
                            ({products.filter(p => p.category === category).length})
                        </span>
                    </label>
                ))}
            </div>
        </div>

        {/* Price Range */}
        <div className="shop-filter-section">
            <h4 className="shop-filter-title">Price Range</h4>
            <div className="shop-price-range">
                <div className="shop-price-inputs">
                    <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                        className="shop-price-input"
                        placeholder="Min"
                    />
                    <span className="shop-price-separator">-</span>
                    <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                        className="shop-price-input"
                        placeholder="Max"
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="shop-price-slider"
                />
                <div className="shop-price-labels">
                    <span>৳0</span>
                    <span>৳10,000</span>
                </div>
            </div>
        </div>
    </div>
);

export default Shop;
