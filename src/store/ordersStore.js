import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Orders Store for managing orders state
export const useOrdersStore = create(
  devtools(
    (set, get) => ({
      orders: [],
      loading: true,
      error: null,
      
      // Orders actions
      setOrders: (orders) => set({ orders }),
      
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders]
        })),
      
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map(order =>
            order.id === id ? { ...order, status } : order
          )
        })),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      // Helper methods
      getOrderById: (id) => {
        const { orders } = get()
        return orders.find(order => order.id === id)
      },
      
      getOrdersByStatus: (status) => {
        const { orders } = get()
        return orders.filter(order => order.status === status)
      },
      
      getOrderStats: () => {
        const { orders } = get()
        return {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing').length,
          shipped: orders.filter(o => o.status === 'shipped').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
        }
      },
    }),
    { name: 'OrdersStore' }
  )
)