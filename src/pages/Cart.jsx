import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag, TrendingUp } from 'lucide-react';
import './CartPage.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const shipping = cart.length > 0 ? 100 : 0;
    const subtotal = getCartTotal();
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + shipping + tax;

    // Calculate savings goal
    const savingsGoal = 10000;
    const amountToSave = Math.max(savingsGoal - subtotal, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">
                            <ShoppingBag size={64} />
                        </div>
                        <h2>Your Shopping Cart is Empty</h2>
                        <p>Discover our bestselling eyewear collection</p>
                        <Link to="/shop" className="button">
                            <ArrowLeft size={18} />
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                {/* Header */}
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items-section">
                        <div className="cart-items-card">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.lensType || 'default'}`} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} loading="lazy" />
                                    </div>

                                    <div className="cart-item-details">
                                        <div className="cart-item-info">
                                            <h3>{item.name}</h3>
                                            <p className="cart-item-type">{item.lensType || item.category}</p>
                                            {item.prescriptionDetails && (
                                                <p className="cart-item-prescription">
                                                    With prescription
                                                </p>
                                            )}
                                        </div>

                                        <div className="cart-item-price">
                                            <span className="price">৳{item.price.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.lensType)}
                                                disabled={item.quantity <= 1}
                                                className="quantity-btn"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.lensType)}
                                                className="quantity-btn"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id, item.lensType)}
                                            className="remove-btn"
                                            title="Remove item"
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Promo Code Section */}
                        <div className="promo-code-section">
                            <div className="promo-code-input-group">
                                <input
                                    type="text"
                                    placeholder="Enter promo code"
                                    className="promo-code-input"
                                />
                                <button className="apply-promo-btn">
                                    <Tag size={16} />
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary-section">
                        <div className="cart-summary">
                            <h3 className="summary-title">Order Summary</h3>

                            <div className="summary-row subtotal">
                                <span>Subtotal</span>
                                <span>৳{subtotal.toLocaleString()}</span>
                            </div>

                            <div className="summary-row shipping">
                                <span>Shipping</span>
                                <span>৳{shipping}</span>
                            </div>

                            <div className="summary-row tax">
                                <span>Tax (5%)</span>
                                <span>৳{tax}</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span className="amount">৳{total.toLocaleString()}</span>
                            </div>

                            {/* Savings Alert */}
                            {subtotal < savingsGoal && (
                                <div className="savings-alert">
                                    <p>
                                        <TrendingUp size={18} />
                                        Add ৳{amountToSave.toLocaleString()} more to save ৳500!
                                    </p>
                                </div>
                            )}

                            {subtotal >= savingsGoal && (
                                <div className="savings-alert">
                                    <p>
                                        <TrendingUp size={18} />
                                        🎉 You're saving ৳500 on this order!
                                    </p>
                                </div>
                            )}

                            <Link to="/checkout">
                                <button className="checkout-btn">
                                    Proceed to Checkout
                                    <ArrowRight size={20} />
                                </button>
                            </Link>

                            <Link to="/shop">
                                <button className="continue-shopping">
                                    <ArrowLeft size={18} />
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
