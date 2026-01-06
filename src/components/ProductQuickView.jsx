import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductQuickView = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product?.variants?.colors?.[0] || null);
    const { addToCart } = useCart();

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
            />
        ));
    };

    // Close on ESC key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
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
                className="quick-view-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="quick-view-close"
                    aria-label="Close quick view"
                >
                    <X size={24} />
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
