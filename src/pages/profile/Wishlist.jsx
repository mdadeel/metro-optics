import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import './Wishlist.css'; // Import the new CSS file

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleMoveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
    };

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later</p>
            </div>

            {wishlist.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlist.map(product => (
                        <div key={product.id} className="wishlist-item">
                            <button
                                className="remove-wishlist-btn"
                                onClick={() => removeFromWishlist(product.id)}
                                title="Remove from wishlist"
                                aria-label="Remove from wishlist"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="wishlist-item-image">
                                <img src={product.image} alt={product.name} loading="lazy" />
                            </div>

                            <div className="wishlist-item-content">
                                <h3>{product.name}</h3>
                                <p className="wishlist-item-category">{product.category}</p>
                                <p className="wishlist-item-price">৳{product.price.toLocaleString()}</p>

                                <button className="wishlist-item-cart-btn" onClick={() => handleMoveToCart(product)}>
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="wishlist-empty-state">
                    <Heart size={64} />
                    <h3>Your wishlist is empty</h3>
                    <p>Save your favorite products to buy them later</p>
                    <button onClick={() => window.location.href = '/shop'}>
                        Browse Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
