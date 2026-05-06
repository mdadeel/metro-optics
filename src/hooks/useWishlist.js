import { useEffect, useState } from 'react'
import { useWishlistStore, useUIStore } from '../store'

export const useWishlist = () => {
  const { items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist, getWishlistCount } = useWishlistStore()
  const { addNotification } = useUIStore()

  // Add to wishlist with feedback
  const addToWishlist = (product) => {
    const result = addItem(product)
    
    if (result) {
      addNotification({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist`,
        variant: 'success'
      })
    } else {
      addNotification({
        title: 'Already in Wishlist',
        description: `${product.name} is already in your wishlist`,
        variant: 'info'
      })
    }
    
    return result
  }

  // Remove from wishlist with feedback
  const removeFromWishlist = (productId) => {
    const item = items.find(item => item.id === productId)
    removeItem(productId)
    
    if (item) {
      addNotification({
        title: 'Removed from Wishlist',
        description: `${item.name} has been removed from your wishlist`,
        variant: 'info'
      })
    }
  }

  // Toggle wishlist item
  const toggleWishlistItem = (product) => {
    const wasAdded = toggleItem(product)
    
    addNotification({
      title: wasAdded ? 'Added to Wishlist' : 'Removed from Wishlist',
      description: `${product.name} has been ${wasAdded ? 'added to' : 'removed from'} your wishlist`,
      variant: wasAdded ? 'success' : 'info'
    })
    
    return wasAdded
  }

  // Clear wishlist with confirmation
  const clearWishlistItems = () => {
    if (items.length === 0) return
    
    const confirmed = window.confirm(`Are you sure you want to remove all ${items.length} items from your wishlist?`)
    
    if (confirmed) {
      clearWishlist()
      addNotification({
        title: 'Wishlist Cleared',
        description: `All items have been removed from your wishlist`,
        variant: 'info'
      })
    }
  }

  // Get wishlist statistics
  const wishlistStats = {
    itemCount: getWishlistCount(),
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
    totalValue: items.reduce((total, item) => total + (item.price || 0), 0)
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

  // Get recently added items
  const getRecentlyAdded = (limit = 5) => {
    return [...items]
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, limit)
  }

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    clearWishlistItems,
    isInWishlist,
    wishlistStats,
    getItemsByCategory,
    getRecentlyAdded,
    getWishlistCount
  }
}