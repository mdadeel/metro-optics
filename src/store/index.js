// Store index file - exports all stores
export { useUIStore } from './uiStore'
export { useCartStore } from './cartStore'
export { useWishlistStore } from './wishlistStore'
export { useAuthStore } from './authStore'
export { useProductsStore } from './productsStore'
export { useOrdersStore } from './ordersStore'

// Combined store hook for convenience
export const useStore = () => {
  const ui = useUIStore()
  const cart = useCartStore()
  const wishlist = useWishlistStore()
  const auth = useAuthStore()
  const products = useProductsStore()
  const orders = useOrdersStore()
  
  return {
    ui,
    cart,
    wishlist,
    auth,
    products,
    orders,
  }
}