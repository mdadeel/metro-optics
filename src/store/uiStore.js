import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// UI Store for managing UI state
export const useUIStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Cart drawer state
        isCartOpen: false,
        openCart: () => set({ isCartOpen: true }),
        closeCart: () => set({ isCartOpen: false }),
        
        // Mobile menu state
        isMobileMenuOpen: false,
        openMobileMenu: () => set({ isMobileMenuOpen: true }),
        closeMobileMenu: () => set({ isMobileMenuOpen: false }),
        
        // MagnifyingGlass state
        searchQuery: '',
        setSearchQuery: (query) => set({ searchQuery: query }),
        
        // Loading states
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),
        
        // Toast notifications
        notifications: [],
        addNotification: (notification) => 
          set((state) => ({
            notifications: [...state.notifications, { 
              id: Date.now(), 
              ...notification 
            }]
          })),
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          })),
        
        // Theme
        theme: 'light',
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: 'metro-optics-ui',
        partialize: (state) => ({
          theme: state.theme,
          searchQuery: state.searchQuery,
        }),
      }
    ),
    { name: 'UIStore' }
  )
)