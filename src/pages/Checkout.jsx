import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Truck, CreditCard, ShoppingBag, ArrowLeft, ArrowRight, Phone, Mail, MapPin, User, Banknote, Smartphone, AlertCircle } from 'lucide-react';
import { sanitizeString, sanitizePhone, sanitizeEmail, sanitizeTransactionId } from '../lib/sanitize';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import '../styles/pages/checkout.css';

// Get bKash number from environment variable (more secure than hardcoding)
const BKASH_NUMBER = import.meta.env.VITE_BKASH_NUMBER || '01700000000';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { createOrder } = useOrders();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [bkashData, setBkashData] = useState({ number: '', trxId: '' });
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validation functions
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Full name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            return '';
        },
        phone: (value) => {
            if (!value.trim()) return 'Phone number is required';
            const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid BD phone number';
            return '';
        },
        email: (value) => {
            if (!value) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        },
        address: (value) => {
            if (!value.trim()) return 'Delivery address is required';
            if (value.trim().length < 10) return 'Please enter a complete address (House, Road, Area)';
            return '';
        },
        bkashNumber: (value) => {
            if (paymentMethod !== 'bKash') return '';
            if (!value.trim()) return 'bKash number is required';
            const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Invalid bKash number';
            return '';
        },
        trxId: (value) => {
            if (paymentMethod !== 'bKash') return '';
            if (!value.trim()) return 'Transaction ID is required';
            if (value.trim().length < 8) return 'Invalid Transaction ID';
            return '';
        }
    };

    const validateStep1 = () => {
        const errors = {};
        errors.name = validators.name(formData.name);
        errors.phone = validators.phone(formData.phone);
        errors.email = validators.email(formData.email);
        errors.address = validators.address(formData.address);

        // Filter out empty errors
        const activeErrors = Object.keys(errors).reduce((acc, key) => {
            if (errors[key]) acc[key] = errors[key];
            return acc;
        }, {});

        setFieldErrors(prev => ({ ...prev, ...activeErrors }));
        return Object.keys(activeErrors).length === 0;
    };

    const validateStep2 = () => {
        if (paymentMethod !== 'bKash') return true;

        const errors = {};
        errors.bkashNumber = validators.bkashNumber(bkashData.number);
        errors.trxId = validators.trxId(bkashData.trxId);

        const activeErrors = Object.keys(errors).reduce((acc, key) => {
            if (errors[key]) acc[key] = errors[key];
            return acc;
        }, {});

        setFieldErrors(prev => ({ ...prev, ...activeErrors }));
        return Object.keys(activeErrors).length === 0;
    };

    const handleBlur = (field, value) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const validatorName = field === 'number' ? 'bkashNumber' : field;
        if (validators[validatorName]) {
            setFieldErrors(prev => ({ ...prev, [field]: validators[validatorName](value) }));
        }
    };

    const handleChange = (field, value, isBkash = false) => {
        if (isBkash) {
            setBkashData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        // Clear error when typing
        if (touched[field]) {
            const validatorName = field === 'number' ? 'bkashNumber' : field;
            if (validators[validatorName]) {
                setFieldErrors(prev => ({ ...prev, [field]: validators[validatorName](value) }));
            }
        }
    };

    const subtotal = getCartTotal();
    const shipping = 100;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shipping + tax;

    const handleCopyNumber = () => {
        navigator.clipboard.writeText(BKASH_NUMBER);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent double submission - set loading immediately
        if (loading) return;

        if (step === 1) {
            // Mark Step 1 fields as touched
            setTouched({ name: true, email: true, phone: true, address: true });

            if (validateStep1()) {
                setStep(2);
                setTouched({}); // Reset touched for next step
                window.scrollTo(0, 0);
            }
            return;
        }

        // Validate Step 2 (if bKash)
        if (paymentMethod === 'bKash') {
            setTouched({ number: true, trxId: true });
            if (!validateStep2()) {
                return;
            }
        }

        setLoading(true);

        try {
            // Sanitize all user inputs to prevent XSS attacks
            const orderData = {
                customerName: sanitizeString(formData.name.trim()),
                email: sanitizeEmail(formData.email),
                userId: user?.uid || null,
                address: sanitizeString(formData.address.trim()),
                phone: sanitizePhone(formData.phone),
                items: cart,
                total,
                paymentMethod,
                ...(paymentMethod === 'bKash' ? {
                    bkashNumber: sanitizePhone(bkashData.number),
                    transactionId: sanitizeTransactionId(bkashData.trxId)
                } : {})
            };

            // CRITICAL FIX: Await the order creation before proceeding
            const orderId = await createOrder(orderData);

            // Only clear cart and navigate on success
            if (orderId) {
                clearCart();
                toast.success('Order placed successfully!', {
                    description: `Order #${orderId.slice(-8).toUpperCase()}`,
                    duration: 3000,
                });
                navigate(`/invoice/${orderId}`);
            } else {
                throw new Error('Order creation failed - no order ID returned');
            }
        } catch (error) {
            console.error('Order placement failed:', error);
            toast.error('Failed to place order', {
                description: 'Please check your connection and try again.',
                duration: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <SEO
                    title="Checkout"
                    description="Secure checkout for your Metro Optics order. Complete your purchase with confidence."
                />
                <div className="checkout-container">
                    <div className="checkout-empty">
                        <ShoppingBag size={64} color="#111827" />
                        <h2>Your cart is empty</h2>
                        <p>Add some products to your cart before checking out.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="checkout-btn-submit"
                        >
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <SEO
                title="Checkout"
                description="Secure checkout for your Metro Optics order. Complete your purchase with confidence."
            />
            <div className="checkout-container">
                {/* Progress Stepper */}
                <div className="checkout-progress">
                    <div className={`checkout-step ${step >= 1 ? 'completed' : ''}`}>
                        <div className="checkout-step-icon">
                            {step > 1 ? <Check size={20} /> : <Truck size={20} />}
                        </div>
                        <span className="checkout-step-label">Shipping</span>
                    </div>
                    <div className={`checkout-step-divider ${step >= 2 ? 'completed' : ''}`} />
                    <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
                        <div className="checkout-step-icon">
                            <CreditCard size={20} />
                        </div>
                        <span className="checkout-step-label">Payment</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    {step === 1 ? (
                        /* Step 1: Shipping Information */
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Shipping Information</h2>
                            <div className="checkout-fields">
                                <div className="checkout-field">
                                    <label htmlFor="name" className="checkout-label">
                                        <User size={16} aria-hidden="true" /> Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                        onBlur={e => handleBlur('name', e.target.value)}
                                        className={`checkout-input ${touched.name && fieldErrors.name ? 'input-error' : ''}`}
                                        placeholder="John Doe"
                                        aria-invalid={touched.name && fieldErrors.name ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                                    />
                                    {touched.name && fieldErrors.name && (
                                        <div id="name-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="checkout-field">
                                    <label htmlFor="phone" className="checkout-label">
                                        <Phone size={16} aria-hidden="true" /> Phone Number
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => handleChange('phone', e.target.value)}
                                        onBlur={e => handleBlur('phone', e.target.value)}
                                        className={`checkout-input ${touched.phone && fieldErrors.phone ? 'input-error' : ''}`}
                                        placeholder="+880 1700000000"
                                        aria-invalid={touched.phone && fieldErrors.phone ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                                    />
                                    {touched.phone && fieldErrors.phone && (
                                        <div id="phone-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="checkout-field checkout-field-full">
                                    <label htmlFor="email" className="checkout-label">
                                        <Mail size={16} aria-hidden="true" /> Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                        onBlur={e => handleBlur('email', e.target.value)}
                                        className={`checkout-input ${touched.email && fieldErrors.email ? 'input-error' : ''}`}
                                        placeholder="john@example.com"
                                        aria-invalid={touched.email && fieldErrors.email ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                                    />
                                    {touched.email && fieldErrors.email && (
                                        <div id="email-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="checkout-field checkout-field-full">
                                    <label htmlFor="address" className="checkout-label">
                                        <MapPin size={16} aria-hidden="true" /> Delivery Address
                                    </label>
                                    <textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={e => handleChange('address', e.target.value)}
                                        onBlur={e => handleBlur('address', e.target.value)}
                                        className={`checkout-textarea ${touched.address && fieldErrors.address ? 'input-error' : ''}`}
                                        placeholder="House/Flat, Road, Area, City"
                                        aria-invalid={touched.address && fieldErrors.address ? 'true' : 'false'}
                                        aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                                    />
                                    {touched.address && fieldErrors.address && (
                                        <div id="address-error" className="field-error" role="alert">
                                            <AlertCircle size={14} aria-hidden="true" />
                                            {fieldErrors.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Step 2: Payment Method */
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Payment Method</h2>
                            <div className="checkout-payment-options">
                                {/* Cash on Delivery */}
                                <div
                                    className={`checkout-payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('COD')}
                                >
                                    <div className="checkout-payment-header">
                                        <div className="checkout-payment-radio">
                                            <div className="checkout-payment-radio-dot" />
                                        </div>
                                        <div className="checkout-payment-icon">
                                            <Banknote size={24} />
                                        </div>
                                        <div className="checkout-payment-info">
                                            <h3 className="checkout-payment-label">Cash on Delivery</h3>
                                            <p className="checkout-payment-desc">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                </div>

                                {/* bKash */}
                                <div
                                    className={`checkout-payment-option bkash ${paymentMethod === 'bKash' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('bKash')}
                                >
                                    <div className="checkout-payment-header">
                                        <div className="checkout-payment-radio">
                                            <div className="checkout-payment-radio-dot" />
                                        </div>
                                        <div className="checkout-payment-icon">
                                            <Smartphone size={24} />
                                        </div>
                                        <div className="checkout-payment-info">
                                            <h3 className="checkout-payment-label">bKash</h3>
                                            <p className="checkout-payment-desc">Pay with mobile banking</p>
                                        </div>
                                    </div>

                                    {paymentMethod === 'bKash' && (
                                        <div className="checkout-bkash-details">
                                            <div className="checkout-bkash-number">
                                                <div>
                                                    <span className="checkout-bkash-label">Send Money to:</span>
                                                    <p className="checkout-bkash-value">{BKASH_NUMBER}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyNumber}
                                                    className="checkout-copy-btn"
                                                    title="Copy number"
                                                    aria-label="Copy bKash number"
                                                >
                                                    {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                                                </button>
                                            </div>

                                            <div className="checkout-field">
                                                <label htmlFor="bkash-number" className="checkout-label">Your bKash Number</label>
                                                <input
                                                    id="bkash-number"
                                                    type="tel"
                                                    value={bkashData.number}
                                                    onChange={e => handleChange('number', e.target.value, true)}
                                                    onBlur={e => handleBlur('number', e.target.value)}
                                                    className={`checkout-bkash-input ${touched.number && fieldErrors.bkashNumber ? 'input-error' : ''}`}
                                                    placeholder="01XXXXXXXXX"
                                                    aria-invalid={touched.number && fieldErrors.bkashNumber ? 'true' : 'false'}
                                                    aria-describedby={fieldErrors.bkashNumber ? 'bkash-number-error' : undefined}
                                                />
                                                {touched.number && fieldErrors.bkashNumber && (
                                                    <div id="bkash-number-error" className="field-error" role="alert">
                                                        <AlertCircle size={14} aria-hidden="true" />
                                                        {fieldErrors.bkashNumber}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="checkout-field">
                                                <label htmlFor="bkash-trx-id" className="checkout-label">Transaction ID</label>
                                                <input
                                                    id="bkash-trx-id"
                                                    type="text"
                                                    value={bkashData.trxId}
                                                    onChange={e => handleChange('trxId', e.target.value, true)}
                                                    onBlur={e => handleBlur('trxId', e.target.value)}
                                                    className={`checkout-bkash-input ${touched.trxId && fieldErrors.trxId ? 'input-error' : ''}`}
                                                    placeholder="8N7A5B3C2D"
                                                    aria-invalid={touched.trxId && fieldErrors.trxId ? 'true' : 'false'}
                                                    aria-describedby={fieldErrors.trxId ? 'trx-id-error' : undefined}
                                                />
                                                {touched.trxId && fieldErrors.trxId && (
                                                    <div id="trx-id-error" className="field-error" role="alert">
                                                        <AlertCircle size={14} aria-hidden="true" />
                                                        {fieldErrors.trxId}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Credit Card */}
                                <div className={`checkout-payment-option ${paymentMethod === 'Card' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('Card')}
                                >
                                    <div className="checkout-payment-header">
                                        <div className="checkout-payment-radio">
                                            <div className="checkout-payment-radio-dot" />
                                        </div>
                                        <div className="checkout-payment-icon">
                                            <CreditCard size={24} />
                                        </div>
                                        <div className="checkout-payment-info">
                                            <h3 className="checkout-payment-label">Credit / Debit Card</h3>
                                            <p className="checkout-payment-desc">Fast & secure payment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <div className="summary-row">
                            <span>Subtotal ({cart.length} items)</span>
                            <span>৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>৳{shipping}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (5%)</span>
                            <span>৳{tax}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span className="amount">৳{total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="checkout-actions">
                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="checkout-btn-back"
                                disabled={loading}
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            className={`checkout-btn-submit ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {!loading && (
                                <>
                                    {step === 1 ? 'Continue to Payment' : 'Place Order'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                            {loading && 'Processing...'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
