import { BaseRepository } from './BaseRepository'

export class OrderRepository extends BaseRepository {
  constructor(firestoreService) {
    super(firestoreService)
    this.collection = firestoreService.collection(firestoreService.db, 'orders')
  }
  
  // Order-specific methods
  async createOrder(orderData) {
    const order = {
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...orderData
    }
    return this.create(order)
  }
  
  async updateOrderStatus(id, status) {
    return this.update(id, { 
      status,
      updatedAt: new Date().toISOString()
    })
  }
  
  async getOrdersByUser(userId) {
    return this.getAll({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    })
  }
  
  async getOrdersByStatus(status) {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: { field: 'createdAt', direction: 'desc' }
    })
  }
  
  async getRecentOrders(limit = 10) {
    return this.getAll({
      limit,
      orderBy: { field: 'createdAt', direction: 'desc' }
    })
  }
  
  // Subscribe to real-time updates
  subscribeToOrders(callback, userId = null, isAdmin = false) {
    const options = {
      orderBy: { field: 'createdAt', direction: 'desc' }
    }
    
    if (isAdmin) {
      // Admins see all orders
      return this.subscribe(callback, options)
    } else if (userId) {
      // Regular users only see their orders
      options.where = [{ field: 'userId', operator: '==', value: userId }]
      return this.subscribe(callback, options)
    }
    
    return this.subscribe(callback, options)
  }
  
  // Order statistics
  async getOrderStats(startDate, endDate) {
    const orders = await this.getAll({
      where: [
        { field: 'createdAt', operator: '>=', value: startDate },
        { field: 'createdAt', operator: '<=', value: endDate }
      ]
    })
    
    return {
      total: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      statusBreakdown: orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {})
    }
  }
  
  // Order fulfillment
  async markOrderAsShipped(id, trackingInfo) {
    return this.update(id, {
      status: 'shipped',
      trackingInfo,
      shippedAt: new Date().toISOString()
    })
  }
  
  async markOrderAsDelivered(id) {
    return this.update(id, {
      status: 'delivered',
      deliveredAt: new Date().toISOString()
    })
  }
  
  async cancelOrder(id, reason) {
    return this.update(id, {
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString()
    })
  }
}