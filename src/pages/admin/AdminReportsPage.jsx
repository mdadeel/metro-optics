import { useMemo } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { EnhancedLineChart, EnhancedBarChart } from '../../components/EnhancedCharts';
import {
    BarChart3, TrendingUp, DollarSign, ShoppingBag, Package,
    Download, Calendar, Award
} from 'lucide-react';
import './AdminReportsPage.css';

const AdminReportsPage = () => {
    const { orders } = useOrders();
    const { products } = useProducts();

    // Sales metrics
    const metrics = useMemo(() => {
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const completedOrders = orders.filter(o => o.status === 'Delivered').length;

        return { totalRevenue, totalOrders, avgOrderValue, completedOrders };
    }, [orders]);

    // Revenue by status
    const revenueByStatus = useMemo(() => {
        const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        return statuses.map(status => ({
            label: status,
            value: orders
                .filter(o => o.status === status)
                .reduce((sum, o) => sum + o.total, 0)
        }));
    }, [orders]);

    // Top products by revenue
    const topProducts = useMemo(() => {
        return products
            .sort((a, b) => (b.price * (100 - b.stock || 0)) - (a.price * (100 - a.stock || 0)))
            .slice(0, 5);
    }, [products]);

    // Monthly revenue trend (mock data for demo)
    const monthlyTrend = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        // Use deterministic values instead of Math.random() to avoid impure function during render
        const baseValues = [65000, 78000, 82000, 95000, 72000, 88000];
        return months.map((month, i) => ({
            label: month,
            value: baseValues[i % baseValues.length]
        }));
    }, []);

    return (
        <div className="reports-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Comprehensive insights into your business performance</p>
                </div>
                <button className="btn-export">
                    <Download size={16} />
                    Export Report
                </button>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon green">
                        <DollarSign size={24} />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Total Revenue</div>
                        <div className="metric-value">৳{Math.round(metrics.totalRevenue).toLocaleString()}</div>
                        <div className="metric-change positive">+12.5% from last month</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon blue">
                        <ShoppingBag size={24} />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Total Orders</div>
                        <div className="metric-value">{metrics.totalOrders}</div>
                        <div className="metric-change negative">-3.2% from last month</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon purple">
                        <TrendingUp size={24} />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Avg Order Value</div>
                        <div className="metric-value">৳{Math.round(metrics.avgOrderValue)}</div>
                        <div className="metric-change positive">+8.7% from last month</div>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon orange">
                        <Award size={24} />
                    </div>
                    <div className="metric-content">
                        <div className="metric-label">Completed Orders</div>
                        <div className="metric-value">{metrics.completedOrders}</div>
                        <div className="metric-change">{Math.round((metrics.completedOrders / metrics.totalOrders) * 100)}% completion rate</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <EnhancedLineChart
                    title="Monthly Revenue Trend"
                    data={monthlyTrend}
                    color="#2563eb"
                />

                <EnhancedBarChart
                    title="Revenue by Order Status"
                    data={revenueByStatus}
                />
            </div>

            {/* Performance Tables */}
            <div className="tables-section">
                {/* Top Products */}
                <div className="report-card">
                    <div className="report-card-header">
                        <h3>
                            <Package size={20} />
                            Top Performing Products
                        </h3>
                    </div>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock Sold</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={product.id}>
                                    <td className="rank-cell">#{index + 1}</td>
                                    <td className="product-name-cell">{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>৳{product.price}</td>
                                    <td>{100 - (product.stock || 0)}</td>
                                    <td className="revenue-cell">
                                        ৳{(product.price * (100 - (product.stock || 0))).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sales Summary */}
                <div className="report-card">
                    <div className="report-card-header">
                        <h3>
                            <BarChart3 size={20} />
                            Sales Summary
                        </h3>
                    </div>
                    <div className="summary-stats">
                        <div className="summary-row">
                            <span>Total Products</span>
                            <strong>{products.length}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Products in Stock</span>
                            <strong>{products.filter(p => p.stock > 0).length}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Low Stock Products</span>
                            <strong className="warning">{products.filter(p => p.stock < 10 && p.stock > 0).length}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Out of Stock</span>
                            <strong className="danger">{products.filter(p => p.stock === 0).length}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Pending Orders</span>
                            <strong>{orders.filter(o => o.status === 'Pending').length}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Processing Orders</span>
                            <strong>{orders.filter(o => o.status === 'Processing').length}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
