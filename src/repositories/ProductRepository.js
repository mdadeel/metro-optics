import { BaseRepository } from './BaseRepository'

export class ProductRepository extends BaseRepository {
  constructor(firestoreService) {
    super(firestoreService)
    this.collection = firestoreService.collection(firestoreService.db, 'products')
  }
  
  // Product-specific methods
  async getBestsellers(limit = 8) {
    return this.getAll({
      where: [{ field: 'isBestseller', operator: '==', value: true }],
      limit,
      orderBy: { field: 'name', direction: 'asc' }
    })
  }
  
  async getNewArrivals(limit = 6) {
    return this.getAll({
      where: [{ field: 'isNew', operator: '==', value: true }],
      limit,
      orderBy: { field: 'createdAt', direction: 'desc' }
    })
  }
  
  async getByCategory(category) {
    return this.getAll({
      where: [{ field: 'category', operator: '==', value: category }],
      orderBy: { field: 'name', direction: 'asc' }
    })
  }
  
  async searchProducts(queryText) {
    if (!queryText) return this.getAll()
    
    // For now, get all products and filter client-side
    // In a real app, you'd implement full-text search with Algolia or similar
    const products = await this.getAll()
    const lowerQuery = queryText.toLowerCase()
    
    return products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
  
  // Subscribe to real-time updates
  subscribeToProducts(callback) {
    return this.subscribe(callback, {
      orderBy: { field: 'name', direction: 'asc' }
    })
  }
  
  // Product variants management
  async addVariant(productId, variant) {
    const product = await this.getById(productId)
    if (!product) throw new Error('Product not found')
    
    const variants = product.variants || []
    variants.push(variant)
    
    return this.update(productId, { variants })
  }
  
  async updateVariant(productId, variantId, variantData) {
    const product = await this.getById(productId)
    if (!product) throw new Error('Product not found')
    
    const variants = product.variants || []
    const variantIndex = variants.findIndex(v => v.id === variantId)
    
    if (variantIndex === -1) throw new Error('Variant not found')
    
    variants[variantIndex] = { ...variants[variantIndex], ...variantData }
    
    return this.update(productId, { variants })
  }
  
  async removeVariant(productId, variantId) {
    const product = await this.getById(productId)
    if (!product) throw new Error('Product not found')
    
    const variants = product.variants || []
    const filteredVariants = variants.filter(v => v.id !== variantId)
    
    return this.update(productId, { variants: filteredVariants })
  }
  
  // Inventory management
  async updateStock(productId, variantId, stock) {
    const product = await this.getById(productId)
    if (!product) throw new Error('Product not found')
    
    if (variantId) {
      // Update variant stock
      const variants = product.variants || []
      const variantIndex = variants.findIndex(v => v.id === variantId)
      
      if (variantIndex === -1) throw new Error('Variant not found')
      
      variants[variantIndex].stock = stock
      return this.update(productId, { variants })
    } else {
      // Update main product stock
      return this.update(productId, { stock })
    }
  }
}