import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductQuickView = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.[0] || null);
    const { addToCart } = useCart();
    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousActiveElement = useRef(null);

    // Store the previously focused element and focus the modal on open
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            // Focus the close button when modal opens
            setTimeout(() => closeButtonRef.current?.focus(), 0);
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Return focus to the trigger element when modal closes
    useEffect(() => {
        if (!isOpen && previousActiveElement.current) {
            previousActiveElement.current.focus();
        }
    }, [isOpen]);

    // Focus trap - keep focus within modal
    const handleTabKey = useCallback((e) => {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }, []);

    if (!isOpen || !product) return null;

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        onClose();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
                fill={index < Math.floor(rating) ? 'currentColor' : 'none'}
                aria-hidden="true"
            />
        ));
    };

    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Tab') {
            handleTabKey(e);
        }
    };

    return (
        <div
            className="quick-view-overlay"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
        >
            <div
                ref={modalRef}
                className="quick-view-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="quick-view-close"
                    aria-label="Close quick view"
                >
                    <X size={24} aria-hidden="true" />
                </button>

                <div className="quick-view-content">
                    {/* Image Section */}
                    <div className="quick-view-image-section">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="quick-view-image"
                        />
                        {product.isBestseller && (
                            <span className="quick-view-badge quick-view-badge-bestseller">
                                Bestseller
                            </span>
                        )}
                        {product.isNew && (
                            <span className="quick-view-badge quick-view-badge-new">
                                New
                            </span>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="quick-view-details">
                        <div className="quick-view-header">
                            <div>
                                <p className="quick-view-category">{product.category}</p>
                                <h2 id="quick-view-title" className="quick-view-title">
                                    {product.name}
                                </h2>
                            </div>
                            <button className="quick-view-wishlist" aria-label="Add to wishlist">
                                <Heart size={24} />
                            </button>
                        </div>

                        {/* Rating */}
                        {product.ratings && (
                            <div className="quick-view-rating">
                                <div className="quick-view-stars">
                                    {renderStars(product.ratings.average)}
                                </div>
                                <span className="quick-view-rating-text">
                                    {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="quick-view-prices">
                            <span className="quick-view-price">৳{product.price}</span>
                            {product.originalPrice && (
                                <span className="quick-view-original-price">
                                    ৳{product.originalPrice}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="quick-view-description">{product.description}</p>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                            <div className="quick-view-features">
                                <h3 className="quick-view-features-title">Features:</h3>
                                <ul className="quick-view-features-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.variants?.colors && product.variants.colors.length > 0 && (
                            <div className="quick-view-options">
                                <label className="quick-view-options-label">Color:</label>
                                <div className="quick-view-color-options">
                                    {product.variants.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`quick-view-color-btn ${selectedColor === color ? 'active' : ''}`}
                                            aria-label={`Select ${color} color`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="quick-view-options">
                            <label className="quick-view-options-label">Quantity:</label>
                            <div className="quick-view-quantity">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="quick-view-quantity-btn"
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>
                                <span className="quick-view-quantity-value">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="quick-view-quantity-btn"
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="quick-view-actions">
                            <button
                                onClick={handleAddToCart}
                                className="quick-view-add-to-cart"
                                disabled={product.inventory?.stock <= 0}
                            >
                                <ShoppingCart size={20} />
                                Add to Cart
                            </button>
                            <Link
                                to={`/product/${product.id}`}
                                className="quick-view-full-details"
                                onClick={onClose}
                            >
                                View Full Details
                            </Link>
                        </div>

                        {/* Stock Info */}
                        {product.inventory && (
                            <p className="quick-view-stock">
                                {product.inventory.stock > 0 ? (
                                    <span className="quick-view-stock-available">
                                        ✓ {product.inventory.stock} in stock
                                    </span>
                                ) : (
                                    <span className="quick-view-stock-out">
                                        Out of stock
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductQuickView;
