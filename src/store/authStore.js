import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Auth Store for managing authentication state
export const useAuthStore = create(
  devtools(
    (set, get) => ({
      user: null,
      isAdmin: false,
      isLoading: true,
      
      // Auth actions
      setUser: (user) => set({ user }),
      
      setAdminStatus: (isAdmin) => set({ isAdmin }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      logout: () => set({ user: null, isAdmin: false }),
      
      // Computed values
      isAuthenticated: () => {
        const { user } = get()
        return !!user
      },
      
      getUserDisplayName: () => {
        const { user } = get()
        return user?.displayName || user?.email || 'User'
      },
    }),
    { name: 'AuthStore' }
  )
)