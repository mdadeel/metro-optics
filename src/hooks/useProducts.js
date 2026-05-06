import { useEffect, useState } from 'react'
import { useProductsStore } from '../store'
import { productService } from '../services'

export const useProducts = (filters = {}) => {
  const { products, loading, error, setProducts, setLoading, setError } = useProductsStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeProducts = async () => {
      try {
        setLoading(true)
        const unsubscribe = productService.initializeProducts()
        setInitialized(true)
        return unsubscribe
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    const unsubscribe = initializeProducts()
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [setProducts, setLoading, setError])

  // Filter products based on provided filters
  const filteredProducts = products.filter(product => {
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.category && product.category !== filters.category) {
      return false
    }
    if (filters.minPrice && product.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false
    }
    return true
  })

  return {
    products: filteredProducts,
    loading: loading || !initialized,
    error,
    refetch: () => productService.getProducts(filters)
  }
}