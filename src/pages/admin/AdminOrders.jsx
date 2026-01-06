import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { Search, Download, Eye, Check, X } from 'lucide-react';

const AdminOrders = () => {
    const { orders, updateOrderStatus } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleBulkAction = (action) => {
        if (selectedOrders.length === 0) {
            alert('Please select orders first');
            return;
        }
        if (action && window.confirm(`Apply "${action}" to ${selectedOrders.length} orders?`)) {
            selectedOrders.forEach(id => updateOrderStatus(id, action));
            setSelectedOrders([]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            Pending: 'pending',
            Processing: 'confirmed',
            Confirmed: 'confirmed',
            Shipped: 'shipped',
            Delivered: 'delivered',
            Cancelled: 'pending',
        };
        return (
            <span className={`status-badge ${colors[status] || 'pending'}`}>
                {status}
            </span>
        );
    };

    return (
        <>
            <div className="wp-page-header">
                <h1 className="wp-page-title">Orders</h1>

                {/* Filters & Actions Bar */}
                <div className="wp-card" style={{ marginBottom: '20px' }}>
                    <div className="wp-card-body">
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {/* Bulk Actions */}
                            <select
                                className="wp-select"
                                style={{ width: 'auto', minWidth: '150px' }}
                                onChange={(e) => handleBulkAction(e.target.value)}
                                value=""
                            >
                                <option value="">Bulk Actions</option>
                                <option value="Processing">Mark Processing</option>
                                <option value="Shipped">Mark Shipped</option>
                                <option value="Delivered">Mark Delivered</option>
                                <option value="Cancelled">Mark Cancelled</option>
                            </select>

                            {/* Status Filter */}
                            <select
                                className="wp-select"
                                style={{ width: 'auto', minWidth: '150px' }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Statuses ({orders.length})</option>
                                <option value="Pending">Pending ({orders.filter(o => o.status === 'Pending').length})</option>
                                <option value="Processing">Processing ({orders.filter(o => o.status === 'Processing').length})</option>
                                <option value="Shipped">Shipped ({orders.filter(o => o.status === 'Shipped').length})</option>
                                <option value="Delivered">Delivered ({orders.filter(o => o.status === 'Delivered').length})</option>
                            </select>

                            {/* Search */}
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="wp-input"
                                    style={{ paddingLeft: '36px' }}
                                />
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--wp-text-light)' }} />
                            </div>

                            {/* Export */}
                            <button className="wp-button">
                                <Download size={16} />
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="wp-table-wrapper">
                <table className="wp-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Order</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--wp-text-light)' }}>
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => {
                                                setSelectedOrders(prev =>
                                                    prev.includes(order.id)
                                                        ? prev.filter(id => id !== order.id)
                                                        : [...prev, order.id]
                                                );
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <strong>#{order.id}</strong>
                                    </td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--wp-text-light)' }}>{order.phone}</div>
                                        </div>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td>{order.paymentMethod}</td>
                                    <td><strong>৳{order.total}</strong></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                className="wp-button"
                                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                                onClick={() => setEditingOrder(order)}
                                                title="Edit Status"
                                            >
                                                <Eye size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Status Modal */}
            {editingOrder && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                    <div className="wp-card" style={{ maxWidth: '500px', width: '100%', margin: 0 }}>
                        <div className="wp-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Update Order #{editingOrder.id}</h3>
                            <button onClick={() => setEditingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="wp-card-body">
                            <div style={{ marginBottom: '16px' }}>
                                <strong>Customer:</strong> {editingOrder.customerName}<br />
                                <strong>Total:</strong> ৳{editingOrder.total}<br />
                                <strong>Payment:</strong> {editingOrder.paymentMethod}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            updateOrderStatus(editingOrder.id, status);
                                            setEditingOrder(null);
                                        }}
                                        className={editingOrder.status === status ? 'wp-button-primary' : 'wp-button'}
                                        style={{ justifyContent: 'space-between' }}
                                    >
                                        {status}
                                        {editingOrder.status === status && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminOrders;
