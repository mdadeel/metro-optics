import { create } from 'zustand';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../config/firebase';
import { DEMO_PRODUCTS } from '../lib/constants';

export const useProductStore = create((set, get) => ({
  products: DEMO_PRODUCTS,
  loading: false,
  error: null,
  activeCategory: 'all',
  searchQuery: '',
  selectedBrands: [],
  selectedShapes: [],
  selectedLensTypes: [],
  priceRange: [0, 500],
  inStockOnly: false,
  sortBy: 'default',
  viewMode: 'grid', // 'grid' | 'list'

  fetchProducts: async () => {
    if (!hasFirebaseConfig || !db) {
      set({ products: DEMO_PRODUCTS, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({
        products: fetched.length > 0 ? fetched : DEMO_PRODUCTS,
        loading: false,
      });
    } catch (err) {
      console.warn('Using demo products fallback:', err.message);
      set({ products: DEMO_PRODUCTS, loading: false, error: err.message });
    }
  },

  getProductById: (id) => {
    return get().products.find((p) => String(p.id) === String(id));
  },

  getProductsByCategory: (category) => {
    const { products } = get();
    if (!category || category === 'all') return products;
    return products.filter((p) => p.category === category);
  },

  getFeaturedDeals: () => {
    return get().products.filter((p) => p.isDeal || p.originalPrice > p.price);
  },

  getNewArrivals: () => {
    return get().products.filter((p) => p.tags?.includes('new') || p.isFeatured);
  },

  // Filter actions
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setSelectedBrands: (selectedBrands) => set({ selectedBrands }),
  toggleBrand: (brand) => {
    const { selectedBrands } = get();
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    set({ selectedBrands: next });
  },
  setSelectedShapes: (selectedShapes) => set({ selectedShapes }),
  toggleShape: (shape) => {
    const { selectedShapes } = get();
    const next = selectedShapes.includes(shape)
      ? selectedShapes.filter((s) => s !== shape)
      : [...selectedShapes, shape];
    set({ selectedShapes: next });
  },
  setPriceRange: (priceRange) => set({ priceRange }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),

  clearAllFilters: () => {
    set({
      searchQuery: '',
      activeCategory: 'all',
      selectedBrands: [],
      selectedShapes: [],
      selectedLensTypes: [],
      priceRange: [0, 500],
      inStockOnly: false,
      sortBy: 'default',
    });
  },

  // Computed filtered & sorted list
  getFilteredProducts: () => {
    const state = get();
    let result = [...state.products];

    // Category
    if (state.activeCategory && state.activeCategory !== 'all') {
      result = result.filter((p) => p.category === state.activeCategory);
    }

    // Search
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Brands
    if (state.selectedBrands.length > 0) {
      result = result.filter((p) => state.selectedBrands.includes(p.brand));
    }

    // Shapes
    if (state.selectedShapes.length > 0) {
      result = result.filter((p) => state.selectedShapes.includes(p.shape));
    }

    // Price
    result = result.filter(
      (p) => p.price >= state.priceRange[0] && p.price <= state.priceRange[1]
    );

    // In Stock
    if (state.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    switch (state.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        break;
    }

    return result;
  },
}));
