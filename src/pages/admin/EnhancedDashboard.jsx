import { useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import StatCard from '../../components/StatCard';
import { EnhancedLineChart, EnhancedBarChart } from '../../components/EnhancedCharts';
import {
    DollarSign, Package, ShoppingCart, TrendingUp,
    Clock, AlertTriangle, Award, ArrowUpRight
} from 'lucide-react';
import './EnhancedDashboard.css';

const EnhancedDashboard = () => {
    const { orders } = useOrders();
    const { products } = useProducts();

    // Calculate key metrics
    const metrics = useMemo(() => {
        const total = orders.reduce((sum, order) => sum + order.total, 0);
        const pending = orders.filter(o => o.status === 'Pending').length;
        const delivered = orders.filter(o => o.status === 'Delivered').length;
        const avgOrder = orders.length > 0 ? Math.round(total / orders.length) : 0;
        const lowStock = products.filter(p => p.stock < 10).length;

        return { total, pending, delivered, avgOrder, lowStock };
    }, [orders, products]);

    // Generate revenue trend data (last 7 days)
    const revenueTrend = useMemo(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // Use deterministic values instead of Math.random() to avoid impure function during render
        const baseValues = [15000, 22000, 18000, 35000, 28000, 42000, 31000];
        return days.map((day, i) => ({
            label: day,
            value: baseValues[i % baseValues.length] // Use modulo to cycle through values
        }));
    }, []);

    // Generate orders trend data
    const ordersTrend = useMemo(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        // Use deterministic values instead of Math.random() to avoid impure function during render
        const baseValues = [8, 12, 9, 15, 11, 18, 13];
        return days.map((day, i) => ({
            label: day,
            value: baseValues[i % baseValues.length] // Use modulo to cycle through values
        }));
    }, []);

    // Top products
    const topProducts = useMemo(() => {
        return products
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5);
    }, [products]);

    // Recent orders
    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    }, [orders]);

    return (
        <div className="enhanced-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard Overview</h1>
                    <p className="dashboard-subtitle">
                        Welcome back! Here's what's happening with your store today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Total Revenue"
                    value={`৳${metrics.total.toLocaleString()}`}
                    icon={DollarSign}
                    trend={12.5}
                    trendLabel="vs last month"
                />
                <StatCard
                    title="Total Orders"
                    value={orders.length}
                    icon={ShoppingCart}
                    trend={-3.2}
                    trendLabel="vs last month"
                />
                <StatCard
                    title="Avg Order Value"
                    value={`৳${metrics.avgOrder}`}
                    icon={TrendingUp}
                    trend={8.7}
                    trendLabel="per order"
                />
                <StatCard
                    title="Pending Orders"
                    value={metrics.pending}
                    icon={Clock}
                    trendLabel="needs attention"
                />
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
                <EnhancedLineChart
                    title="Revenue Trend (Last 7 Days)"
                    data={revenueTrend}
                    color="#111111" 
                />
                <EnhancedBarChart
                    title="Orders Trend (Last 7 Days)"
                    data={ordersTrend}
                />
            </div>

            {/* Content Grid */}
            <div className="content-grid">
                {/* Recent Orders */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Orders</h3>
                        <a href="/admin/orders" className="card-link">
                            View All <ArrowUpRight size={14} />
                        </a>
                    </div>
                    <div className="table-container">
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="font-medium">#{order.id.slice(0, 8)}</td>
                                        <td>{order.customerName}</td>
                                        <td>
                                            <span className={`badge badge-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="font-medium">৳{order.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Top Products</h3>
                        <a href="/admin/products" className="card-link">
                            View All <ArrowUpRight size={14} />
                        </a>
                    </div>
                    <div className="products-list">
                        {topProducts.map((product, index) => (
                            <div key={product.id} className="product-item">
                                <div className="product-rank">#{index + 1}</div>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-meta">
                                        <span className="product-price">৳{product.price}</span>
                                        <span className="product-stock">
                                            {product.stock} in stock
                                        </span>
                                    </div>
                                </div>
                                <div className="product-rating">
                                    ⭐ {product.rating || 'N/A'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Alerts */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <AlertTriangle size={20} />
                            Inventory Alerts
                        </h3>
                    </div>
                    <div className="alerts-container">
                        {metrics.lowStock > 0 ? (
                            <>
                                <div className="alert alert-warning">
                                    <AlertTriangle size={18} />
                                    <span>{metrics.lowStock} products running low on stock</span>
                                </div>
                                <div className="alert alert-info">
                                    <Package size={18} />
                                    <span>{products.length - metrics.lowStock} products well stocked</span>
                                </div>
                            </>
                        ) : (
                            <div className="alert alert-success">
                                <Award size={18} />
                                <span>All products are well stocked!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3 className="card-title">Quick Stats</h3>
                    </div>
                    <div className="quick-stats">
                        <div className="quick-stat-item">
                            <div className="quick-stat-label">Total Products</div>
                            <div className="quick-stat-value">{products.length}</div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-label">Delivered Orders</div>
                            <div className="quick-stat-value">{metrics.delivered}</div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-label">Customers</div>
                            <div className="quick-stat-value">1,234</div>
                        </div>
                        <div className="quick-stat-item">
                            <div className="quick-stat-label">Conversion Rate</div>
                            <div className="quick-stat-value">3.2%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedDashboard;
