import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Products Store for managing products state
export const useProductsStore = create(
  devtools(
    (set, get) => ({
      products: [],
      loading: true,
      error: null,
      
      // Products actions
      setProducts: (products) => set({ products }),
      
      addProduct: (product) => 
        set((state) => ({
          products: [...state.products, product]
        })),
      
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map(product =>
            product.id === id ? { ...product, ...updatedProduct } : product
          )
        })),
      
      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        })),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      // Product filtering and sorting
      getBestsellers: (limit = 8) => {
        const { products } = get()
        return products
          .filter(p => p.isBestseller)
          .slice(0, limit)
      },
      
      getNewArrivals: (limit = 6) => {
        const { products } = get()
        return products
          .filter(p => p.isNew)
          .slice(0, limit)
      },
      
      getProductsByCategory: (category) => {
        const { products } = get()
        return products.filter(p => p.category === category)
      },
      
      searchProducts: (queryText) => {
        const { products } = get()
        if (!queryText) return products
        
        const lowerQuery = queryText.toLowerCase()
        return products.filter(p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      },
      
      getProductById: (id) => {
        const { products } = get()
        return products.find(p => p.id === id)
      },
      
      // Get unique categories
      getCategories: () => {
        const { products } = get()
        return [...new Set(products.map(p => p.category))]
      },
    }),
    { name: 'ProductsStore' }
  )
)