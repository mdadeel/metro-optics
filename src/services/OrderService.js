import { orderRepository } from '../repositories'
import { useOrdersStore } from '../store'
import { toast } from 'sonner'

export class OrderService {
  constructor() {
    this.repository = orderRepository
    this.store = useOrdersStore.getState()
  }
  
  // Initialize orders with real-time subscription
  async initializeOrders(userId = null, isAdmin = false) {
    try {
      useOrdersStore.getState().setLoading(true)
      
      // Subscribe to real-time updates
      const unsubscribe = this.repository.subscribeToOrders(
        (orders) => {
          useOrdersStore.getState().setOrders(orders)
          useOrdersStore.getState().setLoading(false)
        },
        userId,
        isAdmin
      )
      
      return unsubscribe
    } catch (error) {
      this.handleOrdersError(error)
    }
  }
  
  // Create new order
  async createOrder(orderData) {
    try {
      useOrdersStore.getState().setLoading(true)
      
      // Validate order data
      this.validateOrderData(orderData)
      
      const newOrder = await this.repository.createOrder(orderData)
      
      useOrdersStore.getState().addOrder(newOrder)
      toast.success('Order placed successfully')
      
      return newOrder
    } catch (error) {
      toast.error(`Failed to place order: ${error.message}`)
      throw error
    } finally {
      useOrdersStore.getState().setLoading(false)
    }
  }
  
  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`)
      }
      
      await this.repository.updateOrderStatus(orderId, status)
      
      useOrdersStore.getState().updateOrderStatus(orderId, status)
      toast.success(`Order status updated to ${status}`)
      
      return true
    } catch (error) {
      toast.error(`Failed to update order status: ${error.message}`)
      throw error
    }
  }
  
  // Get orders with filters
  async getOrders(filters = {}) {
    try {
      useOrdersStore.getState().setLoading(true)
      
      let orders
      
      if (filters.userId) {
        orders = await this.repository.getOrdersByUser(filters.userId)
      } else if (filters.status) {
        orders = await this.repository.getOrdersByStatus(filters.status)
      } else if (filters.recent) {
        orders = await this.repository.getRecentOrders(filters.limit)
      } else {
        orders = await this.repository.getAll()
      }
      
      useOrdersStore.getState().setOrders(orders)
      return orders
    } catch (error) {
      this.handleOrdersError(error)
      return []
    } finally {
      useOrdersStore.getState().setLoading(false)
    }
  }
  
  // Order fulfillment
  async shipOrder(orderId, trackingInfo) {
    try {
      if (!trackingInfo || !trackingInfo.trackingNumber) {
        throw new Error('Tracking information is required')
      }
      
      await this.repository.markOrderAsShipped(orderId, trackingInfo)
      
      useOrdersStore.getState().updateOrderStatus(orderId, 'shipped')
      toast.success('Order shipped successfully')
      
      return true
    } catch (error) {
      toast.error(`Failed to ship order: ${error.message}`)
      throw error
    }
  }
  
  async deliverOrder(orderId) {
    try {
      await this.repository.markOrderAsDelivered(orderId)
      
      useOrdersStore.getState().updateOrderStatus(orderId, 'delivered')
      toast.success('Order delivered successfully')
      
      return true
    } catch (error) {
      toast.error(`Failed to deliver order: ${error.message}`)
      throw error
    }
  }
  
  async cancelOrder(orderId, reason) {
    try {
      if (!reason) {
        throw new Error('Cancellation reason is required')
      }
      
      await this.repository.cancelOrder(orderId, reason)
      
      useOrdersStore.getState().updateOrderStatus(orderId, 'cancelled')
      toast.success('Order cancelled')
      
      return true
    } catch (error) {
      toast.error(`Failed to cancel order: ${error.message}`)
      throw error
    }
  }
  
  // Order statistics
  async getOrderStats(startDate, endDate) {
    try {
      const stats = await this.repository.getOrderStats(startDate, endDate)
      return stats
    } catch (error) {
      console.error('Error getting order stats:', error)
      return null
    }
  }
  
  // Order validation
  validateOrderData(data) {
    const errors = []
    
    if (!data.userId) {
      errors.push('User ID is required')
    }
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      errors.push('Order must contain at least one item')
    }
    
    if (!data.total || data.total <= 0) {
      errors.push('Order total must be greater than 0')
    }
    
    if (!data.shippingAddress) {
      errors.push('Shipping address is required')
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
    
    // Validate order items
    data.items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Item ${index + 1}: Product ID is required`)
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
      }
      if (!item.price || item.price < 0) {
        errors.push(`Item ${index + 1}: Price must be greater than or equal to 0`)
      }
    })
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
    
    return true
  }
  
  // Calculate order totals
  calculateOrderTotals(items, shipping = 0, tax = 0, discount = 0) {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const total = subtotal + shipping + tax - discount
    
    return {
      subtotal,
      shipping,
      tax,
      discount,
      total: Math.max(0, total)
    }
  }
  
  // Error handling
  handleOrdersError(error) {
    console.error('Order service error:', error)
    useOrdersStore.getState().setError(error.message)
    useOrdersStore.getState().setLoading(false)
    toast.error('Failed to load orders')
  }
  
  // Get order by ID
  async getOrderById(orderId) {
    try {
      const order = await this.repository.getById(orderId)
      if (!order) {
        throw new Error('Order not found')
      }
      return order
    } catch (error) {
      toast.error(`Failed to get order: ${error.message}`)
      throw error
    }
  }
  
  // Customer order history
  async getCustomerOrderHistory(userId, limit = 20) {
    try {
      const orders = await this.repository.getOrdersByUser(userId)
      return orders.slice(0, limit)
    } catch (error) {
      console.error('Error getting customer order history:', error)
      return []
    }
  }
}

// Create singleton instance
export const orderService = new OrderService()