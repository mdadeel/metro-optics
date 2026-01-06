import { Fragment } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

const CartDrawer = () => {
    const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, getCartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="cart-drawer-overlay">
            <div className="cart-drawer-backdrop" onClick={closeCart} />

            <div className="cart-drawer-container">
                <div className="cart-drawer">

                    {/* Header */}
                    <div className="cart-drawer-header">
                        <h2 className="cart-drawer-title">
                            <ShoppingBag className="cart-drawer-icon" size={20} />
                            Shopping Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                        </h2>
                        <button onClick={closeCart} className="cart-drawer-close">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="cart-drawer-items">
                        {cart.length === 0 ? (
                            <div className="cart-drawer-empty">
                                <div className="cart-drawer-empty-icon">
                                    <ShoppingBag size={32} />
                                </div>
                                <div className="cart-drawer-empty-content">
                                    <p className="cart-drawer-empty-title">Your cart is empty</p>
                                    <p className="cart-drawer-empty-text">Looks like you haven't added any items yet.</p>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="cart-drawer-empty-btn"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={`${item.id}-${item.lensType}`} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="cart-item-header">
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <p className="cart-item-total">৳{item.price * item.quantity}</p>
                                        </div>
                                        <p className="cart-item-type">{item.lensType || item.category}</p>

                                        <div className="cart-item-actions">
                                            <div className="cart-item-quantity">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.lensType)}
                                                    className="cart-item-quantity-btn"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="cart-item-quantity-value">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.lensType)}
                                                    className="cart-item-quantity-btn"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.lensType)}
                                                className="cart-item-remove"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="cart-drawer-footer">
                            <div className="cart-drawer-totals">
                                <div className="cart-drawer-row">
                                    <span>Subtotal</span>
                                    <span>৳{getCartTotal()}</span>
                                </div>
                                <div className="cart-drawer-row">
                                    <span>Shipping</span>
                                    <span>৳100</span>
                                </div>
                                <div className="cart-drawer-total">
                                    <span>Total</span>
                                    <span>৳{getCartTotal() + 100}</span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                onClick={closeCart}
                                className="cart-drawer-checkout-btn"
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
