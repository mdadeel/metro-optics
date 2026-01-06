import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import '../AuthPages.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Simulated delay for premium feel
            await new Promise(resolve => setTimeout(resolve, 800));
            await login(formData.email, formData.password);
            // AuthContext will update isAdmin via useEffect/onAuthStateChanged
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check your admin credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page admin-auth-page">
            <div className="auth-page-navbar">
                <Link to="/" className="auth-navbar-home" style={{ color: 'white' }}>
                    <ArrowLeft size={20} />
                    <span>Return to Store</span>
                </Link>
            </div>

            <div className="auth-container admin-container">
                <div className="auth-card admin-card">
                    <div className="auth-header">
                        <div className="admin-status-badge">
                            <ShieldCheck size={14} />
                            <span>System Administrator</span>
                        </div>
                        <h1 className="auth-title">Admin Access</h1>
                        <p className="auth-subtitle">Elevated permissions are required to manage Metro Optics</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="admin-label">Admin Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} style={{ color: '#94a3b8' }} />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-with-icon admin-input"
                                    placeholder="admin@metrooptics.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="admin-label">Security Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} style={{ color: '#94a3b8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-with-icon admin-input"
                                    placeholder="••••••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                    style={{ color: '#94a3b8' }}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn premium-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Authenticating...
                                </>
                            ) : (
                                'Verify Identity'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer" style={{ color: '#64748b', fontSize: '13px' }}>
                        <p>Unauthorized access attempts are strictly monitored and logged via IP tracking.</p>
                    </div>
                </div>

                <div
                    className="auth-image admin-image"
                    style={{ backgroundImage: 'url("/admin_security_dashboard_bg_1767673587034.png")' }}
                >
                    <div className="auth-image-overlay admin-image-overlay" />
                    <div className="auth-image-content">
                        <h2>Precision Control.</h2>
                        <p>Access the core systems of Metro Optics. Manage inventory, process orders, and oversee customer relations with enterprise-grade stability.</p>
                        <div className="admin-features-grid">
                            <div className="admin-stat-item">
                                <span className="stat-value">CMS</span>
                                <span className="stat-label">Dynamic Content</span>
                            </div>
                            <div className="admin-stat-item">
                                <span className="stat-value">ERP</span>
                                <span className="stat-label">Inventory Sync</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
