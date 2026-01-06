import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/components/product-card.css';

const ProductCard = ({ product, onQuickView }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const handleAddToCartClick = (e) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        addToCart({ ...product, quantity: 1 });
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onQuickView) onQuickView(product);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <div className="product-card"> {/* Changed to div as the whole card is not a link anymore due to button */}
            <Link to={`/product/${product.id}`} className="product-card-link-img-info">
                <div className="product-card-image-wrapper">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-image"
                        loading="lazy"
                    />

                    {/* Badges */}
                    <div className="product-badge-group">
                        {product.isNew && <span className="product-badge badge-new">New</span>}
                        {product.originalPrice && (
                            <span className="product-badge badge-sale">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                        )}
                    </div>

                    {/* Floating Actions (Top Right) */}
                    <div className="product-actions-floating">
                        <button
                            className={`action-btn-float ${isInWishlist(product.id) ? 'active' : ''}`}
                            onClick={handleWishlist}
                            title="Add to Wishlist"
                        >
                            <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            className="action-btn-float"
                            onClick={handleQuickView}
                            title="Quick View"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                </div>

                <div className="product-card-info">
                    <p className="product-card-category">{product.category}</p>
                    <h3 className="product-card-title" title={product.name}>{product.name}</h3>
                    <div className="product-card-price-row">
                        <span className="product-price">৳{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="product-price-original">৳{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Always Visible Add to Cart Button */}
            <button
                className="btn-add-to-cart-fixed"
                onClick={handleAddToCartClick}
            >
                <ShoppingCart size={16} />
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
