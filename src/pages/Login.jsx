import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import './AuthPages.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signInWithGoogle } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const from = location.state?.from?.pathname || '/';

    // Validation functions
    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const validateForm = () => {
        const errors = {
            email: validateEmail(formData.email),
            password: validatePassword(formData.password)
        };
        setFieldErrors(errors);
        return !errors.email && !errors.password;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const validators = { email: validateEmail, password: validatePassword };
        if (validators[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: validators[field](formData[field]) }));
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (touched[field]) {
            const validators = { email: validateEmail, password: validatePassword };
            if (validators[field]) {
                setFieldErrors(prev => ({ ...prev, [field]: validators[field](value) }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Mark all fields as touched
        setTouched({ email: true, password: true });

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsGoogleLoading(true);
        try {
            await signInWithGoogle();
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Google sign-in failed.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page-navbar">
                <Link to="/" className="auth-navbar-home">
                    <ArrowLeft size={20} />
                    <span>Back to Store</span>
                </Link>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            Metro Optics
                        </Link>
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to access your orders and account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="login-email" className="text-sm font-medium">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} aria-hidden="true" />
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    placeholder="name@example.com"
                                    className={`input-with-icon ${touched.email && fieldErrors.email ? 'input-error' : ''}`}
                                    disabled={isLoading || isGoogleLoading}
                                    aria-invalid={touched.email && fieldErrors.email ? 'true' : 'false'}
                                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                />
                            </div>
                            {touched.email && fieldErrors.email && (
                                <div id="email-error" className="field-error" role="alert">
                                    <AlertCircle size={14} aria-hidden="true" />
                                    {fieldErrors.email}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <div className="flex justify-between items-center">
                                <label htmlFor="login-password" className="text-sm font-medium">Password</label>
                                <Link to="/forgot-password" className="auth-link text-xs">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} aria-hidden="true" />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    placeholder="••••••••"
                                    className={`input-with-icon ${touched.password && fieldErrors.password ? 'input-error' : ''}`}
                                    disabled={isLoading || isGoogleLoading}
                                    aria-invalid={touched.password && fieldErrors.password ? 'true' : 'false'}
                                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                    disabled={isLoading || isGoogleLoading}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                </button>
                            </div>
                            {touched.password && fieldErrors.password && (
                                <div id="password-error" className="field-error" role="alert">
                                    <AlertCircle size={14} aria-hidden="true" />
                                    {fieldErrors.password}
                                </div>
                            )}
                        </div>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={formData.rememberMe}
                                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                disabled={isLoading || isGoogleLoading}
                            />
                            <label htmlFor="remember" className="checkbox-label">
                                Keep me signed in
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading || isGoogleLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <div className="social-buttons">
                            <button
                                type="button"
                                className="social-btn"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading || isGoogleLoading}
                            >
                                {isGoogleLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <svg className="social-icon" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                                Google
                            </button>
                        </div>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                <div
                    className="auth-image"
                    style={{ backgroundImage: 'url("/luxury_eyewear_login_bg_1767673565881.png")' }}
                >
                    <div className="auth-image-overlay" />
                    <div className="auth-image-content">
                        <h2>The Art of Vision.</h2>
                        <p>Discover a curated collection of designer eyewear that defines your unique perspective.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
