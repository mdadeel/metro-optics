import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, XCircle } from '@phosphor-icons/react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'motion/react';
import { formatPrice } from '../lib/utils';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const saved = isInWishlist(product.id);
    const image = product.image || product.images?.[0];

    const handleAddToCartClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        addToCart({ ...product, quantity: 1 });
    };

    const handleWishlist = (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.35 }}
            className="mo-catalog-card"
        >
            <div className="mo-catalog-card__media">
                <Link to={`/product/${product.id}`} className="mo-catalog-card__image" aria-label={`View ${product.name}`}>
                    {!imageLoaded && !imageError && <span className="mo-catalog-card__loader" aria-hidden="true" />}
                    {imageError || !image ? (
                        <img src="/placeholder-glasses.svg" alt={product.name} />
                    ) : (
                        <img
                            src={image}
                            alt={product.name}
                            loading="lazy"
                            onLoad={() => { setImageLoaded(true); setImageError(false); }}
                            onError={() => { setImageError(true); setImageLoaded(false); }}
                        />
                    )}
                </Link>
                <div className="mo-catalog-card__badges">
                    {product.isNew && <span className="mo-catalog-card__badge mo-catalog-card__badge--new">New</span>}
                    {product.tags?.includes('bestseller') && <span className="mo-catalog-card__badge mo-catalog-card__badge--quiet">Bestseller</span>}
                </div>
                <button
                    type="button"
                    className={`mo-catalog-card__save${saved ? ' is-active' : ''}`}
                    onClick={handleWishlist}
                    aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    aria-pressed={saved}
                >
                    <Heart size={17} weight={saved ? 'fill' : 'regular'} />
                </button>
            </div>

            <div className="mo-catalog-card__details">
                <div className="mo-catalog-card__meta">
                    <span>{product.brand || product.category || 'Metro Optics'}</span>
                </div>
                <Link to={`/product/${product.id}`} className="mo-catalog-card__name" title={product.name}>
                    {product.name}
                </Link>
                <div className="mo-catalog-card__price-row">
                    <span className="mo-catalog-card__price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && <del>{formatPrice(product.originalPrice)}</del>}
                </div>
                <button type="button" className="mo-catalog-card__add" onClick={handleAddToCartClick}>
                    <ShoppingCart size={15} /> Add to Cart
                </button>
            </div>
        </motion.article>
    );
};

export default ProductCard;
