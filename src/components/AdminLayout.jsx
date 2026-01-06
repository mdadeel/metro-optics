import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingBag, CreditCard, FileText,
    Users, Settings, BarChart3, Menu, X, Bell, ChevronDown, LogOut
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { path: '/admin/cms', icon: FileText, label: 'Content' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="wp-admin">
            {/* Top Admin Bar */}
            <div className="wp-admin-bar">
                <div className="wp-admin-bar-left">
                    <button
                        className="wp-menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <Link to="/" className="wp-site-name">
                        Metro Optics
                    </Link>
                </div>
                <div className="wp-admin-bar-right">
                    <button className="wp-notifications">
                        <Bell size={18} />
                        <span className="wp-badge">3</span>
                    </button>
                    <div className="wp-user-menu">
                        <button
                            className="wp-user-toggle"
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                        >
                            <div className="wp-avatar">A</div>
                            <span>Admin</span>
                            <ChevronDown size={16} />
                        </button>
                        {userMenuOpen && (
                            <div className="wp-user-dropdown">
                                <Link to="/admin/profile" className="wp-dropdown-item">
                                    <Users size={16} />
                                    Profile
                                </Link>
                                <Link to="/admin/settings" className="wp-dropdown-item">
                                    <Settings size={16} />
                                    Settings
                                </Link>
                                <hr className="wp-dropdown-divider" />
                                <button className="wp-dropdown-item logout">
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`wp-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <nav className="wp-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`wp-nav-item ${isActive(item.path) ? 'active' : ''} ${item.badge ? 'disabled' : ''}`}
                        >
                            <item.icon size={20} />
                            <span className="wp-nav-label">{item.label}</span>
                            {item.badge && (
                                <span className="wp-nav-badge">{item.badge}</span>
                            )}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`wp-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
