import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, User, Check, X, ArrowLeft, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import './AuthPages.css';

const Register = () => {
    const navigate = useNavigate();
    const { register, signInWithGoogle } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });

    // Validation functions
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Full name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        },
        email: (value) => {
            if (!value) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        },
        password: (value) => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Password must be at least 8 characters';
            return '';
        },
        confirmPassword: (value) => {
            if (!value) return 'Please confirm your password';
            if (value !== formData.password) return 'Passwords do not match';
            return '';
        },
        acceptTerms: (value) => {
            if (!value) return 'You must accept the terms and conditions';
            return '';
        }
    };

    const validateForm = () => {
        const errors = {};
        Object.keys(validators).forEach(field => {
            errors[field] = validators[field](formData[field]);
        });
        setFieldErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        if (validators[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: validators[field](formData[field]) }));
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Re-validate confirmPassword when password changes
        if (field === 'password' && touched.confirmPassword) {
            setFieldErrors(prev => ({
                ...prev,
                password: validators.password(value),
                confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : ''
            }));
        } else if (touched[field] && validators[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: validators[field](value) }));
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Mark all fields as touched
        setTouched({ name: true, email: true, password: true, confirmPassword: true, acceptTerms: true });

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await register(formData.email, formData.password, formData.name);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsGoogleLoading(true);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            setError(err.message || 'Google sign-in failed.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <SEO
                title="Create Account"
                description="Create a Metro Optics account to unlock exclusive features, faster checkout, and personalized recommendations."
            />
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
                        <h1 className="auth-title">Create account</h1>
                        <p className="auth-subtitle">Join the vision of premium clarity</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form" noValidate>
                        {error && (
                            <div className="auth-error" role="alert">
                                <AlertCircle size={16} aria-hidden="true" />
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="register-name" className="text-sm font-medium">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} aria-hidden="true" />
                                <input
                                    id="register-name"
                                    type="text"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    onBlur={() => handleBlur('name')}
                                    placeholder="John Doe"
                                    className={`input-with-icon ${touched.name && fieldErrors.name ? 'input-error' : ''}`}
                                    disabled={isLoading || isGoogleLoading}
                                    aria-invalid={touched.name && fieldErrors.name ? 'true' : 'false'}
                                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                                />
                            </div>
                            {touched.name && fieldErrors.name && (
                                <div id="name-error" className="field-error" role="alert">
                                    <AlertCircle size={14} aria-hidden="true" />
                                    {fieldErrors.name}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="register-email" className="text-sm font-medium">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} aria-hidden="true" />
                                <input
                                    id="register-email"
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
                            <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} aria-hidden="true" />
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    onBlur={() => handleBlur('password')}
                                    placeholder="Create a strong password"
                                    className={`input-with-icon ${touched.password && fieldErrors.password ? 'input-error' : ''}`}
                                    disabled={isLoading || isGoogleLoading}
                                    aria-invalid={touched.password && fieldErrors.password ? 'true' : 'false'}
                                    aria-describedby="password-requirements"
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
                                <div className="field-error" role="alert">
                                    <AlertCircle size={14} aria-hidden="true" />
                                    {fieldErrors.password}
                                </div>
                            )}
                            {formData.password && (
                                <div className="password-strength" id="password-requirements">
                                    <div className="strength-bars" role="progressbar" aria-valuenow={passwordStrength.strength} aria-valuemin="0" aria-valuemax="4">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className="strength-bar"
                                                style={{
                                                    background: level <= passwordStrength.strength
                                                        ? passwordStrength.color
                                                        : '#e5e7eb'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ color: passwordStrength.color, fontSize: '12px', fontWeight: '500' }}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="register-confirm-password" className="text-sm font-medium">Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} aria-hidden="true" />
                                <input
                                    id="register-confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    onBlur={() => handleBlur('confirmPassword')}
                                    placeholder="Confirm your password"
                                    className={`input-with-icon ${touched.confirmPassword && fieldErrors.confirmPassword ? 'input-error' : ''}`}
                                    disabled={isLoading || isGoogleLoading}
                                    aria-invalid={touched.confirmPassword && fieldErrors.confirmPassword ? 'true' : 'false'}
                                    aria-describedby={fieldErrors.confirmPassword ? 'confirm-password-error' : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="password-toggle"
                                    disabled={isLoading || isGoogleLoading}
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                                </button>
                                {formData.confirmPassword && (
                                    <div className="password-match-indicator" aria-hidden="true">
                                        {formData.password === formData.confirmPassword ? (
                                            <Check size={16} color="#10b981" />
                                        ) : (
                                            <X size={16} color="#ef4444" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {touched.confirmPassword && fieldErrors.confirmPassword && (
                                <div id="confirm-password-error" className="field-error" role="alert">
                                    <AlertCircle size={14} aria-hidden="true" />
                                    {fieldErrors.confirmPassword}
                                </div>
                            )}
                        </div>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={formData.acceptTerms}
                                onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                                onBlur={() => handleBlur('acceptTerms')}
                                disabled={isLoading || isGoogleLoading}
                                aria-invalid={touched.acceptTerms && fieldErrors.acceptTerms ? 'true' : 'false'}
                                aria-describedby={fieldErrors.acceptTerms ? 'terms-error' : undefined}
                            />
                            <label htmlFor="terms" className="checkbox-label">
                                I accept the <Link to="/terms" className="auth-link">Terms</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                            </label>
                        </div>
                        {touched.acceptTerms && fieldErrors.acceptTerms && (
                            <div id="terms-error" className="field-error" role="alert">
                                <AlertCircle size={14} aria-hidden="true" />
                                {fieldErrors.acceptTerms}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={isLoading || isGoogleLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
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
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Sign in
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
                        <h2>Join the Vision.</h2>
                        <p>Experience personalized recommendations and exclusive access to limited edition collections.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
