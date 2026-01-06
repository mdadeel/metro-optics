import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Truck, CreditCard, ShoppingBag, ArrowLeft, ArrowRight, Phone, Mail, MapPin, User, Banknote, Smartphone } from 'lucide-react';
import { sanitizeString, sanitizePhone, sanitizeEmail, sanitizeTransactionId } from '../lib/sanitize';
import { toast } from 'sonner';
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
        setLoading(true);

        if (step === 1) {
            setStep(2);
            setLoading(false);
            return;
        }

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
                                    <label className="checkout-label">
                                        <User size={16} /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="checkout-input"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="checkout-field">
                                    <label className="checkout-label">
                                        <Phone size={16} /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="checkout-input"
                                        placeholder="+880 1700000000"
                                    />
                                </div>

                                <div className="checkout-field checkout-field-full">
                                    <label className="checkout-label">
                                        <Mail size={16} /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="checkout-input"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="checkout-field checkout-field-full">
                                    <label className="checkout-label">
                                        <MapPin size={16} /> Delivery Address
                                    </label>
                                    <textarea
                                        required
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="checkout-textarea"
                                        placeholder="House/Flat, Road, Area, City"
                                    />
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
                                                    <p className="checkout-bkash-value">01700000000</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyNumber}
                                                    className="checkout-copy-btn"
                                                    title="Copy number"
                                                >
                                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                                </button>
                                            </div>

                                            <div className="checkout-field">
                                                <label className="checkout-label">Your bKash Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={bkashData.number}
                                                    onChange={e => setBkashData({ ...bkashData, number: e.target.value })}
                                                    className="checkout-bkash-input"
                                                    placeholder="01XXXXXXXXX"
                                                />
                                            </div>

                                            <div className="checkout-field">
                                                <label className="checkout-label">Transaction ID</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={bkashData.trxId}
                                                    onChange={e => setBkashData({ ...bkashData, trxId: e.target.value })}
                                                    className="checkout-bkash-input"
                                                    placeholder="8N7A5B3C2D"
                                                />
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
