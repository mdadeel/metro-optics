import { productRepository } from '../repositories'
import { useProductsStore } from '../store'
import { toast } from 'sonner'

export class ProductService {
  constructor() {
    this.repository = productRepository
    this.store = useProductsStore.getState()
  }
  
  // Initialize products with real-time subscription
  async initializeProducts() {
    try {
      useProductsStore.getState().setLoading(true)
      
      // Subscribe to real-time updates
      const unsubscribe = this.repository.subscribeToProducts(
        (products) => {
          useProductsStore.getState().setProducts(products)
          useProductsStore.getState().setLoading(false)
        },
        (error) => {
          console.error('Products subscription error:', error)
          this.handleProductsError(error)
        }
      )
      
      return unsubscribe
    } catch (error) {
      this.handleProductsError(error)
    }
  }
  
  // Get products with filters
  async getProducts(filters = {}) {
    try {
      useProductsStore.getState().setLoading(true)
      
      let products
      
      if (filters.search) {
        products = await this.repository.searchProducts(filters.search)
      } else if (filters.category) {
        products = await this.repository.getByCategory(filters.category)
      } else if (filters.bestsellers) {
        products = await this.repository.getBestsellers(filters.limit)
      } else if (filters.newArrivals) {
        products = await this.repository.getNewArrivals(filters.limit)
      } else {
        products = await this.repository.getAll()
      }
      
      useProductsStore.getState().setProducts(products)
      return products
    } catch (error) {
      this.handleProductsError(error)
      return []
    } finally {
      useProductsStore.getState().setLoading(false)
    }
  }
  
  // Create new product
  async createProduct(productData) {
    try {
      useProductsStore.getState().setLoading(true)
      
      // Validate required fields
      this.validateProductData(productData)
      
      const newProduct = await this.repository.create(productData)
      
      useProductsStore.getState().addProduct(newProduct)
      toast.success('Product created successfully')
      
      return newProduct
    } catch (error) {
      toast.error(`Failed to create product: ${error.message}`)
      throw error
    } finally {
      useProductsStore.getState().setLoading(false)
    }
  }
  
  // Update product
  async updateProduct(id, productData) {
    try {
      useProductsStore.getState().setLoading(true)
      
      // Validate product data
      this.validateProductData(productData, false)
      
      const updatedProduct = await this.repository.update(id, productData)
      
      useProductsStore.getState().updateProduct(id, updatedProduct)
      toast.success('Product updated successfully')
      
      return updatedProduct
    } catch (error) {
      toast.error(`Failed to update product: ${error.message}`)
      throw error
    } finally {
      useProductsStore.getState().setLoading(false)
    }
  }
  
  // Delete product
  async deleteProduct(id) {
    try {
      useProductsStore.getState().setLoading(true)
      
      await this.repository.delete(id)
      
      useProductsStore.getState().removeProduct(id)
      toast.success('Product deleted successfully')
      
      return true
    } catch (error) {
      toast.error(`Failed to delete product: ${error.message}`)
      throw error
    } finally {
      useProductsStore.getState().setLoading(false)
    }
  }
  
  // Product variant management
  async addProductVariant(productId, variantData) {
    try {
      const variant = {
        id: Date.now().toString(),
        ...variantData,
        createdAt: new Date().toISOString()
      }
      
      await this.repository.addVariant(productId, variant)
      
      toast.success('Product variant added')
      return variant
    } catch (error) {
      toast.error(`Failed to add variant: ${error.message}`)
      throw error
    }
  }
  
  async updateProductVariant(productId, variantId, variantData) {
    try {
      await this.repository.updateVariant(productId, variantId, variantData)
      toast.success('Product variant updated')
    } catch (error) {
      toast.error(`Failed to update variant: ${error.message}`)
      throw error
    }
  }
  
  async removeProductVariant(productId, variantId) {
    try {
      await this.repository.removeVariant(productId, variantId)
      toast.success('Product variant removed')
    } catch (error) {
      toast.error(`Failed to remove variant: ${error.message}`)
      throw error
    }
  }
  
  // Stock management
  async updateStock(productId, variantId, stock) {
    try {
      if (stock < 0) throw new Error('Stock cannot be negative')
      
      await this.repository.updateStock(productId, variantId, stock)
      toast.success('Stock updated successfully')
    } catch (error) {
      toast.error(`Failed to update stock: ${error.message}`)
      throw error
    }
  }
  
  // Product validation
  validateProductData(data, isCreate = true) {
    const errors = []
    
    if (isCreate && !data.name) {
      errors.push('Product name is required')
    }
    
    if (data.price && (data.price < 0 || isNaN(data.price))) {
      errors.push('Price must be a positive number')
    }
    
    if (data.stock && (data.stock < 0 || isNaN(data.stock))) {
      errors.push('Stock must be a non-negative number')
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
    
    return true
  }
  
  // Error handling
  handleProductsError(error) {
    console.error('Product service error:', error)
    useProductsStore.getState().setError(error.message)
    useProductsStore.getState().setLoading(false)
    
    // Fallback to local data if available
    if (typeof window !== 'undefined' && window.localProducts) {
      useProductsStore.getState().setProducts(window.localProducts)
      toast.warning('Using local product data')
    }
  }
  
  // Get product statistics
  async getProductStats() {
    try {
      const products = await this.repository.getAll()
      
      return {
        total: products.length,
        byCategory: products.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1
          return acc
        }, {}),
        lowStock: products.filter(p => (p.stock || 0) < 10).length,
        outOfStock: products.filter(p => (p.stock || 0) === 0).length,
        bestsellers: products.filter(p => p.isBestseller).length,
        newArrivals: products.filter(p => p.isNew).length,
        totalValue: products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0)
      }
    } catch (error) {
      console.error('Error getting product stats:', error)
      return null
    }
  }
}

// Create singleton instance
export const productService = new ProductService()