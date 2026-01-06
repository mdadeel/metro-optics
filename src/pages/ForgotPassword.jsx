import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page-navbar">
                <Link to="/login" className="auth-navbar-home">
                    <ArrowLeft size={20} />
                    <span>Back to Login</span>
                </Link>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    {success ? (
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-green-50 rounded-full">
                                    <CheckCircle size={48} color="#10b981" />
                                </div>
                            </div>
                            <h1 className="auth-title">Check your email</h1>
                            <p className="auth-subtitle mb-8">
                                We've sent a password reset link to <br />
                                <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-gray-500 mb-8">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <button
                                className="auth-submit-btn w-full mb-4"
                                onClick={() => setSuccess(false)}
                            >
                                Try another email
                            </button>
                            <Link to="/login" className="auth-link text-sm">
                                Back to Log In
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="auth-header">
                                <Link to="/" className="auth-logo">
                                    Metro Optics
                                </Link>
                                <h1 className="auth-title">Reset password</h1>
                                <p className="auth-subtitle">
                                    Enter your registered email address and we'll send you instructions to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                {error && (
                                    <div className="auth-error">
                                        {error}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail className="input-icon" size={18} />
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="input-with-icon"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="auth-submit-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Sending instructions...
                                        </>
                                    ) : (
                                        'Send Reset Instructions'
                                    )}
                                </button>
                            </form>

                            <div className="auth-footer">
                                <p>
                                    Remember your password?{' '}
                                    <Link to="/login" className="auth-link">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div
                    className="auth-image"
                    style={{ backgroundImage: 'url("/luxury_eyewear_login_bg_1767673565881.png")' }}
                >
                    <div className="auth-image-overlay" />
                    <div className="auth-image-content">
                        <h2>Regain Access.</h2>
                        <p>We'll help you get back to your account so you can continue exploring our exclusive collections.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
