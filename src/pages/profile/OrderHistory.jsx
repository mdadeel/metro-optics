import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { Link } from 'react-router-dom';
import { Package, MagnifyingGlass as Search, Funnel as Filter, FileText, Truck } from '@phosphor-icons/react';
import { formatPrice } from '../../lib/utils';
import './OrderHistory.css';

function getDateValue(value) {
    if (typeof value?.toDate === 'function') return value.toDate();
    const date = value instanceof Date ? value : new Date(value || 0);
    return Number.isNaN(date.getTime()) ? null : date;
}

const OrderHistory = () => {
    const { user } = useAuth();
    const { orders } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const userEmail = String(user?.email || '').toLowerCase();

    const userOrders = orders.filter((order) => (
        order.userId === user?.uid
        || String(order.userEmail || '').toLowerCase() === userEmail
        || String(order.email || '').toLowerCase() === userEmail
        || String(order.customer?.email || '').toLowerCase() === userEmail
    ));

    const filteredOrders = userOrders.filter((order) => {
        const status = String(order.status || '').toLowerCase();
        const customerName = order.customer?.name || order.customerName || '';
        const matchesSearch = String(order.id || '').toLowerCase().includes(searchTerm.toLowerCase())
            || customerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && (statusFilter === 'all' || status === statusFilter);
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => (
        (getDateValue(b.createdAt)?.getTime() || 0) - (getDateValue(a.createdAt)?.getTime() || 0)
    ));
    const hasFilters = Boolean(searchTerm) || statusFilter !== 'all';

    return (
        <div className="order-history-page">
            <div className="order-history-header">
                <p className="mo-eyebrow">YOUR METRO OPTICS ACCOUNT</p>
                <h1>Order history</h1>
                <p>Review your orders, check their current status, or open a printable invoice.</p>
            </div>

            <div className="order-filters">
                <div className="order-search-input-wrapper">
                    <Search size={17} className="order-search-icon" aria-hidden="true" />
                    <label className="sr-only" htmlFor="order-history-search">Search orders</label>
                    <input
                        id="order-history-search"
                        type="search"
                        placeholder="Search order number or name"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
                <div className="order-status-select-wrapper">
                    <Filter size={16} aria-hidden="true" />
                    <label className="sr-only" htmlFor="order-history-status">Filter orders by status</label>
                    <select
                        id="order-history-status"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="order-status-select"
                    >
                        <option value="all">All orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {sortedOrders.length > 0 ? (
                <div className="orders-list" aria-live="polite">
                    {sortedOrders.map((order) => {
                        const status = String(order.status || 'unknown').toLowerCase();
                        const date = getDateValue(order.createdAt);
                        const itemCount = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
                        return (
                            <article key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h2 className="order-id">Order #{String(order.id).slice(0, 8).toUpperCase()}</h2>
                                        <p className="order-date">
                                            {date ? `Placed ${date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}` : 'Date unavailable'}
                                        </p>
                                    </div>
                                    <span className={`order-status ${status}`}>{status}</span>
                                </div>

                                <div className="order-body">
                                    <p className="order-item-summary">
                                        {itemCount} {itemCount === 1 ? 'item' : 'items'}{order.paymentMethod ? ` · ${String(order.paymentMethod).replace(/[-_]/g, ' ')}` : ''}
                                    </p>
                                    <p className="order-total">{formatPrice(order.total)}</p>
                                </div>

                                <div className="order-actions">
                                    <Link to={`/track-order?id=${encodeURIComponent(order.id)}`} className="order-action-btn secondary">
                                        <Truck size={15} aria-hidden="true" />
                                        Track order
                                    </Link>
                                    <Link to={`/invoice/${encodeURIComponent(order.id)}`} className="order-action-btn primary">
                                        <FileText size={15} aria-hidden="true" />
                                        View invoice
                                    </Link>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className="order-empty-state">
                    <Package size={42} aria-hidden="true" />
                    <h2>{hasFilters ? 'No matching orders' : 'No orders yet'}</h2>
                    <p>{hasFilters ? 'Try another order number or status filter.' : 'Your orders will appear here once you find a pair you love.'}</p>
                    {!hasFilters && <Link to="/shop" className="order-empty-link">Explore the collection</Link>}
                    {hasFilters && <button type="button" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>Clear filters</button>}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
