import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useWishlist } from '../../context/WishlistContext';
import { Package, Heart, TrendingUp, MapPin, Edit2, ArrowRight, HelpCircle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProfilePages.css';

const ProfileOverview = () => {
    const { user } = useAuth();
    const { orders } = useOrders();
    const { wishlistCount } = useWishlist();

    // Get user's orders
    const userOrders = orders.filter(order =>
        order.email === user?.email || order.userId === user?.uid
    );

    // Stats
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    const activeOrdersCount = userOrders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length;
    const completedOrdersCount = userOrders.filter(o => o.status === 'delivered').length;

    // Recent orders (max 5)
    const recentOrders = userOrders.slice(0, 5);

    return (
        <div className="profile-dashboard">
            {/* Welcome Section */}
            <div className="dashboard-welcome">
                <div>
                    <h1>Hello, {user?.displayName?.split(' ')[0] || 'User'}</h1>
                    <p>Here's what's happening with your account today.</p>
                </div>
                <div className="dashboard-date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="dashboard-grid">
                {/* LEFT COLUMN (Main Content) */}
                <div className="dashboard-main">
                    {/* Stats Row */}
                    <div className="stats-row">
                        <div className="dashboard-stat-card">
                            <div className="stat-icon-wrapper blue">
                                <Package size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Total Orders</span>
                                <span className="stat-number">{userOrders.length}</span>
                            </div>
                        </div>
                        <div className="dashboard-stat-card">
                            <div className="stat-icon-wrapper orange">
                                <Clock size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Pending</span>
                                <span className="stat-number">{activeOrdersCount}</span>
                            </div>
                        </div>
                        <div className="dashboard-stat-card">
                            <div className="stat-icon-wrapper green">
                                <CheckCircle size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Completed</span>
                                <span className="stat-number">{completedOrdersCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>Recent Orders</h2>
                            <Link to="/profile/orders" className="view-all-link">View All Orders <ArrowRight size={16} /></Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <div className="dashboard-table-wrapper">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
                                            <tr key={order.id}>
                                                <td className="font-mono">#{order.id.slice(0, 8).toUpperCase()}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge-sm ${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="font-bold">৳{order.total.toLocaleString()}</td>
                                                <td>
                                                    <Link to={`/invoice/${order.id}`} className="table-action-link">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="dashboard-empty">
                                <p>No orders placed yet.</p>
                                <Link to="/shop" className="btn-text">Start Shopping</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN (Sidebar Widgets) */}
                <div className="dashboard-sidebar">
                    {/* Account Summary Card */}
                    <div className="dashboard-card user-card">
                        <div className="user-card-header">
                            <div className="user-avatar-large">
                                {user?.displayName?.[0] || 'U'}
                            </div>
                            <div className="user-details">
                                <h3>{user?.displayName || 'Guest User'}</h3>
                                <p>{user?.email}</p>
                            </div>
                        </div>
                        <div className="user-card-actions">
                            <Link to="/profile/settings" className="btn-outline-sm">
                                <Edit2 size={14} /> Edit Profile
                            </Link>
                        </div>
                    </div>

                    {/* Wishlist Widget */}
                    <div className="dashboard-card wishlist-widget">
                        <div className="widget-header">
                            <h3>Wishlist</h3>
                            <Link to="/profile/wishlist"><Heart size={16} /></Link>
                        </div>
                        <div className="wishlist-summary">
                            <span className="big-number">{wishlistCount}</span>
                            <span className="subtitle">Saved Items</span>
                        </div>
                        <Link to="/profile/wishlist" className="btn-full-width">
                            View Wishlist
                        </Link>
                    </div>

                    {/* Spending Widget */}
                    <div className="dashboard-card spending-widget">
                        <div className="widget-header">
                            <h3>Total Spent</h3>
                            <TrendingUp size={16} />
                        </div>
                        <div className="spending-amount">
                            ৳{totalSpent.toLocaleString()}
                        </div>
                        <p className="spending-note">Lifetime value</p>
                    </div>

                    {/* Support Widget */}
                    <div className="dashboard-card support-widget">
                        <HelpCircle size={24} className="support-icon" />
                        <h3>Need Help?</h3>
                        <p>Have questions about your order or account?</p>
                        <Link to="/contact" className="btn-link">Contact Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;