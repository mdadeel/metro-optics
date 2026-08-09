import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, XCircle } from '@phosphor-icons/react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'motion/react';

const ProductCard = ({ product, onQuickView }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleAddToCartClick = (e) => {
        e.preventDefault();
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

    const handleImageLoad = () => {
        setImageLoaded(true);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(false);
    };

    const getProductImage = (product) => {
        if (product.image && product.image.includes('unsplash.com')) {
            return `https://picsum.photos/seed/${product.id}/400/400.jpg`;
        }
        return product.image;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="group bg-surface rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col"
        >
            <Link to={`/product/${product.id}`} className="flex flex-col flex-1">
                <div className="relative aspect-square overflow-hidden bg-surface-secondary">
                    {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#1E3A5F] rounded-full animate-spin" />
                        </div>
                    )}

                    {imageError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-300 gap-2">
                            <XCircle size={32} />
                            <span className="text-xs text-neutral-400">Image not available</span>
                        </div>
                    ) : (
                        <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading="lazy"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />
                    )}

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.isNew && (
                            <span className="px-2.5 py-1 rounded-md bg-[#1E3A5F] text-white text-[11px] font-semibold tracking-wide uppercase">
                                New
                            </span>
                        )}
                        {product.originalPrice && (
                            <span className="px-2.5 py-1 rounded-md bg-[#B89458]/90 text-white text-[11px] font-semibold tracking-wide uppercase">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                        )}
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-sm ${
                                isInWishlist(product.id)
                                    ? 'bg-[#1E3A5F] text-white'
                                    : 'bg-white/90 text-neutral-600 hover:bg-white'
                            }`}
                            onClick={handleWishlist}
                            title="Add to Wishlist"
                        >
                            <Heart size={14} weight={isInWishlist(product.id) ? 'fill' : 'regular'} />
                        </button>
                        <button
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-neutral-600 hover:bg-white flex items-center justify-center transition-all duration-200 shadow-sm"
                            onClick={handleQuickView}
                            title="Quick View"
                        >
                            <Eye size={14} />
                        </button>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <p className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground mb-1">
                        {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2" title={product.name}>
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-auto">
                        <span className="text-base font-bold text-foreground">
                            ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-neutral-400 line-through">
                                ৳{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="px-4 pb-4">
                <button
                    onClick={handleAddToCartClick}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-medium transition-all duration-200 active:scale-[0.98]"
                >
                    <ShoppingCart size={15} />
                    Add to Cart
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
