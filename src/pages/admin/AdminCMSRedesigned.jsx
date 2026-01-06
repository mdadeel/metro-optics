import { useNavigate } from 'react-router-dom';
import {
    Package, Users, BarChart3, Settings, Edit3, Image,
    FileText, ShoppingBag, TrendingUp, DollarSign, Plus,
    ArrowRight, Database, Layers
} from 'lucide-react';
import './AdminCMSRedesigned.css';

const AdminCMSRedesigned = () => {
    const navigate = useNavigate();

    const quickActions = [
        {
            icon: Package,
            title: 'Products',
            description: 'Manage inventory, pricing, and product details',
            count: '24 items',
            color: 'blue',
            path: '/admin/products',
            actions: ['Add Product', 'View All', 'Stock Alert']
        },
        {
            icon: Users,
            title: 'Customers',
            description: 'View customer data, orders, and analytics',
            count: '156 customers',
            color: 'purple',
            path: '/admin/customers',
            actions: ['View All', 'Analytics', 'Export']
        },
        {
            icon: BarChart3,
            title: 'Reports',
            description: 'Sales analytics, revenue trends, and insights',
            count: 'Live data',
            color: 'green',
            path: '/admin/reports',
            actions: ['Sales Report', 'Analytics', 'Export']
        },
        {
            icon: Settings,
            title: 'Settings',
            description: 'Configure site, payments, and preferences',
            count: '8 sections',
            color: 'orange',
            path: '/admin/settings',
            actions: ['General', 'Payments', 'Shipping']
        }
    ];

    const cmsFeatures = [
        {
            icon: Edit3,
            title: 'Hero Banner',
            description: 'Edit homepage hero section',
            path: '#hero'
        },
        {
            icon: Image,
            title: 'Media Library',
            description: 'Manage images and assets',
            path: '#media'
        },
        {
            icon: FileText,
            title: 'Pages',
            description: 'Edit static pages content',
            path: '#pages'
        },
        {
            icon: Layers,
            title: 'Categories',
            description: 'Manage product categories',
            path: '#categories'
        }
    ];

    const stats = [
        { icon: ShoppingBag, label: 'Total Orders', value: '1,234', trend: '+12%', color: 'blue' },
        { icon: DollarSign, label: 'Revenue', value: '৳45,678', trend: '+8%', color: 'green' },
        { icon: Users, label: 'Customers', value: '856', trend: '+15%', color: 'purple' },
        { icon: TrendingUp, label: 'Growth', value: '23%', trend: '+5%', color: 'orange' }
    ];

    return (
        <div className="cms-redesigned">
            {/* Header */}
            <div className="cms-header">
                <div>
                    <h1 className="cms-title">Content Management System</h1>
                    <p className="cms-subtitle">Centralized hub for managing all aspects of your store</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className={`quick-stat-card stat-${stat.color}`}>
                        <div className="stat-icon-wrapper">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-details">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-trend">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Management Sections */}
            <div className="management-section">
                <h2 className="section-heading">Core Management</h2>
                <div className="management-grid">
                    {quickActions.map((action, index) => (
                        <div key={index} className={`management-card card-${action.color}`}>
                            <div className="card-icon-large">
                                <action.icon size={32} />
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">{action.title}</h3>
                                <p className="card-description">{action.description}</p>
                                <span className="card-count">{action.count}</span>
                            </div>
                            <div className="card-actions">
                                {action.actions.map((btn, i) => (
                                    <button
                                        key={i}
                                        className="action-btn-small"
                                        onClick={() => i === 0 && navigate(action.path)}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="card-primary-btn"
                                onClick={() => navigate(action.path)}
                            >
                                Open {action.title}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CMS Features */}
            <div className="cms-features-section">
                <h2 className="section-heading">Content Management</h2>
                <div className="features-grid">
                    {cmsFeatures.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">
                                <feature.icon size={28} />
                            </div>
                            <div className="feature-info">
                                <h4 className="feature-title">{feature.title}</h4>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                            <button className="feature-btn">
                                Manage
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="quick-links-section">
                <h2 className="section-heading">Quick Access</h2>
                <div className="quick-links-grid">
                    <button className="quick-link-btn" onClick={() => navigate('/admin/products')}>
                        <Plus size={18} />
                        Add New Product
                    </button>
                    <button className="quick-link-btn" onClick={() => navigate('/admin/orders')}>
                        <Database size={18} />
                        View Orders
                    </button>
                    <button className="quick-link-btn" onClick={() => navigate('/admin/reports')}>
                        <BarChart3 size={18} />
                        Generate Report
                    </button>
                    <button className="quick-link-btn" onClick={() => navigate('/admin/settings')}>
                        <Settings size={18} />
                        Site Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCMSRedesigned;
