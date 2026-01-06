import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, Eye, Download, RotateCcw } from 'lucide-react';
import './OrderHistory.css'; // Import the new CSS file

const OrderHistory = () => {
    const { user } = useAuth();
    const { orders } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Get user's orders
    const userOrders = orders.filter(order =>
        order.email === user?.email || order.userId === user?.uid
    );

    // Filter orders
    const filteredOrders = userOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Sort by date (newest first)
    const sortedOrders = [...filteredOrders].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <div className="order-history-page">
            <div className="order-history-header">
                <h1>Order History</h1>
                <p>Track and manage all your orders</p>
            </div>

            {/* Search & Filter */}
            <div className="order-filters">
                <div className="order-search-input-wrapper">
                    <Search size={18} className="order-search-icon" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="order-status-select-wrapper">
                    <Filter size={18} color="var(--color-gray-600)" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="order-status-select"
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders List */}
            {sortedOrders.length > 0 ? (
                <div className="orders-list">
                    {sortedOrders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3 className="order-id">
                                        Order #{order.id.slice(0, 8).toUpperCase()}
                                    </h3>
                                    <p className="order-date">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`order-status ${order.status}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-body">
                                <p className="order-item-summary">
                                    {order.items?.length || 0} items • {order.paymentMethod}
                                </p>
                                <p className="order-total">
                                    ৳{order.total.toLocaleString()}
                                </p>
                            </div>

                            <div className="order-actions">
                                <Link to={`/invoice/${order.id}`} className="order-action-btn primary">
                                    <Eye size={16} />
                                    View Details
                                </Link>
                                <button className="order-action-btn secondary">
                                    <Download size={16} />
                                    Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="order-empty-state">
                    <Package size={48} />
                    <h3>{searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}</h3>
                    <p>{searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Start shopping to see your orders here'}</p>
                    {!searchTerm && statusFilter === 'all' && (
                        <button onClick={() => window.location.href = '/shop'}>
                            Browse Products
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
