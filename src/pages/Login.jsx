import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { toast } from 'sonner';
import LogoMark from '../components/layout/LogoMark';
import SEO from '../components/SEO';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mo-auth-page">
      <SEO title="Sign In" description="Sign in to your Metro Optics account to access order history, saved frames and account settings." url="/login" noIndex />
      <div className="mo-auth-layout">
        <aside className="mo-auth-story">
          <img src="/metro-hero.webp" alt="A Metro Optics customer wearing considered everyday frames" width="1264" height="848" decoding="async" />
          <div className="mo-auth-story__copy"><p className="mo-eyebrow">A CLEARER VIEW, EVERY DAY</p><h2>Good to see you again.</h2><p>Pick up where you left off. Your orders, saved frames, and vision details are right here.</p></div>
        </aside>
        <section className="mo-auth-card">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto shadow" aria-hidden="true">
            <LogoMark size={21} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Sign In to Metro Optics
          </h1>
          <p className="text-xs text-gray-500">
            Access your orders, saved wishlists, and prescription records
          </p>
        </div>

        <p className="mo-auth-note">Your account keeps orders, saved frames, and prescription records together.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-primary hover:underline font-semibold"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-primary font-bold hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>
        </div>
        </section>
      </div>
    </div>
  );
}
