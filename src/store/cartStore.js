import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Cart Store for managing cart state
export const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        
        // Cart actions
        addItem: (product) => {
          const { items } = get()
          const existingItem = items.find(
            item => item.id === product.id && item.lensType === product.lensType
          )
          
          if (existingItem) {
            set((state) => ({
              items: state.items.map(item =>
                item.id === product.id && item.lensType === product.lensType
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            }))
          } else {
            set((state) => ({
              items: [...state.items, { ...product, quantity: 1 }]
            }))
          }
        },
        
        removeItem: (id, lensType = null) => {
          set((state) => ({
            items: state.items.filter(item => 
              !(item.id === id && (lensType === null || item.lensType === lensType))
            )
          }))
        },
        
        updateQuantity: (id, quantity, lensType = null) => {
          if (quantity <= 0) {
            get().removeItem(id, lensType)
            return
          }
          
          const validQuantity = Math.min(Math.max(quantity, 1), 99)
          
          set((state) => ({
            items: state.items.map(item =>
              (item.id === id && (lensType === null || item.lensType === lensType))
                ? { ...item, quantity: validQuantity }
                : item
            )
          }))
        },
        
        clearCart: () => set({ items: [] }),
        
        // Computed values
        getCartTotal: () => {
          const { items } = get()
          return items.reduce((total, item) => total + (item.price * item.quantity), 0)
        },
        
        getItemCount: () => {
          const { items } = get()
          return items.reduce((count, item) => count + item.quantity, 0)
        },
        
        getItemQuantity: (id, lensType = null) => {
          const { items } = get()
          const item = items.find(item => 
            item.id === id && (lensType === null || item.lensType === lensType)
          )
          return item?.quantity || 0
        },
      }),
      {
        name: 'metro-optics-cart',
      }
    ),
    { name: 'CartStore' }
  )
)