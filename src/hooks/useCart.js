import { useEffect } from 'react'
import { useCartStore, useUIStore } from '../store'

export const useCart = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, getCartTotal, getItemCount } = useCartStore()
  const { openCart, closeCart } = useUIStore()

  // Add product to cart with feedback
  const addToCart = (product, options = {}) => {
    const result = addItem({ ...product, ...options })
    
    // Open cart drawer after adding item
    if (result) {
      openCart()
    }
    
    return result
  }

  // Remove item with confirmation
  const removeFromCart = (id, lensType = null, confirm = false) => {
    if (confirm) {
      // TODO: Show confirmation dialog
      const confirmed = window.confirm('Are you sure you want to remove this item?')
      if (!confirmed) return false
    }
    
    removeItem(id, lensType)
    return true
  }

  // Update quantity with validation
  const updateItemQuantity = (id, quantity, lensType = null) => {
    const maxQuantity = 99
    const minQuantity = 1
    
    if (quantity < minQuantity) {
      return removeFromCart(id, lensType)
    }
    
    if (quantity > maxQuantity) {
      quantity = maxQuantity
    }
    
    updateQuantity(id, quantity, lensType)
    return quantity
  }

  // Get cart statistics
  const cartStats = {
    itemCount: getItemCount(),
    total: getCartTotal(),
    isEmpty: items.length === 0,
    hasItems: items.length > 0
  }

  // Get items by category
  const getItemsByCategory = () => {
    return items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    }, {})
  }

  // Get discounted total
  const getDiscountedTotal = (discountPercentage = 0) => {
    const total = getCartTotal()
    return total * (1 - discountPercentage / 100)
  }

  return {
    items,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    openCart,
    closeCart,
    getCartTotal,
    getItemCount,
    cartStats,
    getItemsByCategory,
    getDiscountedTotal
  }
}