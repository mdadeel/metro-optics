import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Wishlist Store for managing wishlist state
export const useWishlistStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        
        // Wishlist actions
        addItem: (product) => {
          const { items } = get()
          if (items.find(item => item.id === product.id)) {
            return false // Item already exists
          }
          
          set((state) => ({
            items: [...state.items, { ...product, addedAt: new Date().toISOString() }]
          }))
          return true
        },
        
        removeItem: (productId) => {
          set((state) => ({
            items: state.items.filter(item => item.id !== productId)
          }))
        },
        
        toggleItem: (product) => {
          const { items, addItem, removeItem } = get()
          const exists = items.find(item => item.id === product.id)
          
          if (exists) {
            removeItem(product.id)
            return false
          } else {
            addItem(product)
            return true
          }
        },
        
        clearWishlist: () => set({ items: [] }),
        
        // Helper methods
        isInWishlist: (productId) => {
          const { items } = get()
          return items.some(item => item.id === productId)
        },
        
        getWishlistCount: () => {
          const { items } = get()
          return items.length
        },
      }),
      {
        name: 'metro-optics-wishlist',
      }
    ),
    { name: 'WishlistStore' }
  )
)