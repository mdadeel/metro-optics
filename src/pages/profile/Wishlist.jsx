import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash as Trash2 } from '@phosphor-icons/react';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { formatPrice } from '../../lib/utils';
import './Wishlist.css';

const Wishlist = () => {
    const wishlist = useWishlistStore((state) => state.items);
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
    const addToCart = useCartStore((state) => state.addToCart);

    const handleMoveToCart = (product) => {
        addToCart(product, 1);
        removeFromWishlist(product.id);
    };

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <p className="mo-eyebrow">SAVED FOR LATER</p>
                <h1>Your wishlist</h1>
                <p>{wishlist.length} {wishlist.length === 1 ? 'frame' : 'frames'} saved for later</p>
            </div>

            {wishlist.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlist.map((product) => (
                        <article key={product.id} className="wishlist-item">
                            <button
                                type="button"
                                className="remove-wishlist-btn"
                                onClick={() => removeFromWishlist(product.id)}
                                aria-label={`Remove ${product.name} from wishlist`}
                            >
                                <Trash2 size={16} aria-hidden="true" />
                            </button>

                            <Link to={`/product/${product.id}`} className="wishlist-item-image" aria-label={`View ${product.name}`}>
                                <img src={product.image || product.images?.[0]} alt={product.name} loading="lazy" />
                            </Link>

                            <div className="wishlist-item-content">
                                <p className="wishlist-item-category">{product.brand || product.category || 'Metro Optics'}</p>
                                <h2>{product.name}</h2>
                                <p className="wishlist-item-price">{formatPrice(product.price)}</p>
                                <button type="button" className="wishlist-item-cart-btn" onClick={() => handleMoveToCart(product)}>
                                    <ShoppingBag size={16} aria-hidden="true" />
                                    Add to bag
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="wishlist-empty-state">
                    <Heart size={48} aria-hidden="true" />
                    <h2>Your wishlist is empty</h2>
                    <p>Save frames you love and come back to them whenever you’re ready.</p>
                    <Link to="/shop" className="wishlist-empty-link">Explore the collection</Link>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
