import { useState, useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import {
    Users, Search, Mail, Phone, ShoppingBag, DollarSign,
    Calendar, TrendingUp, Eye, X
} from 'lucide-react';
import usePagination from '../../hooks/usePagination';
import Pagination from '../../components/Pagination';
import { useToast } from '../../hooks/useToast';
import './AdminCustomersPage.css';

const AdminCustomersPage = () => {
    const { orders } = useOrders();
    const { ToastContainer } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Extract unique customers from orders
    const customers = useMemo(() => {
        const customerMap = {};

        orders.forEach(order => {
            if (!customerMap[order.customerName]) {
                customerMap[order.customerName] = {
                    name: order.customerName,
                    email: order.email || `${order.customerName.toLowerCase().replace(/\s/g, '')}@example.com`,
                    phone: order.phone,
                    orders: [],
                    totalSpent: 0,
                    joinDate: order.date
                };
            }
            const customer = customerMap[order.customerName];
            customer.orders.push(order);
            customer.totalSpent += order.total;
            // Keep earliest join date
            if (new Date(order.date) < new Date(customer.joinDate)) {
                customer.joinDate = order.date;
            }
        });

        return Object.values(customerMap);
    }, [orders]);

    // Filter customers
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    // Pagination
    const {
        currentData: paginatedCustomers,
        currentPage,
        totalPages,
        goToPage
    } = usePagination(filteredCustomers, 10);

    // Calculate stats
    const stats = useMemo(() => {
        const totalCustomers = customers.length;
        const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
        const avgOrderValue = totalRevenue / orders.length || 0;
        const repeatCustomers = customers.filter(c => c.orders.length > 1).length;

        return { totalCustomers, totalRevenue, avgOrderValue, repeatCustomers };
    }, [customers, orders]);

    return (
        <div className="customers-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Customers</h1>
                    <p className="page-subtitle">{filteredCustomers.length} customers total</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stat-card-small">
                    <div className="stat-icon blue">
                        <Users size={20} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.totalCustomers}</div>
                        <div className="stat-label">Total Customers</div>
                    </div>
                </div>
                <div className="stat-card-small">
                    <div className="stat-icon green">
                        <DollarSign size={20} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">৳{Math.round(stats.totalRevenue)}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                </div>
                <div className="stat-card-small">
                    <div className="stat-icon purple">
                        <ShoppingBag size={20} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">৳{Math.round(stats.avgOrderValue)}</div>
                        <div className="stat-label">Avg Order Value</div>
                    </div>
                </div>
                <div className="stat-card-small">
                    <div className="stat-icon orange">
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.repeatCustomers}</div>
                        <div className="stat-label">Repeat Customers</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="search-section">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="customers-table-container">
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Orders</th>
                            <th>Total Spent</th>
                            <th>Join Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCustomers.map((customer, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="customer-cell">
                                        <div className="customer-avatar">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="customer-name">{customer.name}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-cell">
                                        <div className="contact-item">
                                            <Mail size={14} />
                                            {customer.email}
                                        </div>
                                        <div className="contact-item">
                                            <Phone size={14} />
                                            {customer.phone}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="orders-badge">
                                        {customer.orders.length} {customer.orders.length === 1 ? 'order' : 'orders'}
                                    </span>
                                </td>
                                <td className="price-cell">৳{customer.totalSpent}</td>
                                <td>{new Date(customer.joinDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn-view"
                                        onClick={() => setSelectedCustomer(customer)}
                                    >
                                        <Eye size={14} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCustomers.length === 0 && (
                    <div className="empty-state">
                        <Users size={48} />
                        <p>No customers found</p>
                    </div>
                )}

                {filteredCustomers.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                    />
                )}
            </div>

            <ToastContainer />

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
                    <div className="modal-content customer-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Customer Details</h2>
                            <button className="modal-close" onClick={() => setSelectedCustomer(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Customer Info */}
                            <div className="customer-info-card">
                                <div className="customer-avatar-large">
                                    {selectedCustomer.name.charAt(0).toUpperCase()}
                                </div>
                                <h3>{selectedCustomer.name}</h3>
                                <div className="customer-contact-info">
                                    <div className="info-row">
                                        <Mail size={16} />
                                        {selectedCustomer.email}
                                    </div>
                                    <div className="info-row">
                                        <Phone size={16} />
                                        {selectedCustomer.phone}
                                    </div>
                                    <div className="info-row">
                                        <Calendar size={16} />
                                        Joined {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Purchase Summary */}
                            <div className="purchase-summary">
                                <div className="summary-item">
                                    <div className="summary-label">Total Orders</div>
                                    <div className="summary-value">{selectedCustomer.orders.length}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Total Spent</div>
                                    <div className="summary-value">৳{selectedCustomer.totalSpent}</div>
                                </div>
                                <div className="summary-item">
                                    <div className="summary-label">Avg Order Value</div>
                                    <div className="summary-value">
                                        ৳{Math.round(selectedCustomer.totalSpent / selectedCustomer.orders.length)}
                                    </div>
                                </div>
                            </div>

                            {/* Order History */}
                            <div className="order-history">
                                <h4>Order History</h4>
                                <div className="order-list">
                                    {selectedCustomer.orders.map(order => (
                                        <div key={order.id} className="order-item">
                                            <div className="order-item-header">
                                                <span className="order-id">#{order.id}</span>
                                                <span className={`order-status status-${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order-item-details">
                                                <span>{new Date(order.date).toLocaleDateString()}</span>
                                                <span className="order-total">৳{order.total}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomersPage;
