import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Eye, GitCompare } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCompareStore } from '../../stores/useCompareStore';
import { useUIStore } from '../../stores/useUIStore';
import { formatPrice, calculateDiscount } from '../../lib/utils';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCompare, isInCompare } = useCompareStore();
  const setQuickViewProduct = useUIStore((state) => state.setQuickViewProduct);

  if (!product) return null;

  const discount = calculateDiscount(product.originalPrice, product.price);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Badges & Floating Actions */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="bg-accent text-white text-[11px] font-black px-2 py-0.5 rounded shadow-sm">
            -{discount}%
          </span>
        )}
        {product.tags?.includes('bestseller') && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
            Hot
          </span>
        )}
      </div>

      {/* Wishlist & Compare Icons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
            inWishlist
              ? 'bg-red-50 text-accent dark:bg-red-950/40'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-500 hover:text-accent'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCompare(product);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
            inCompare
              ? 'bg-blue-50 text-primary dark:bg-blue-950/40'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-500 hover:text-primary'
          }`}
          aria-label="Add to comparison"
        >
          <GitCompare className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800"
      >
        <img
          src={product.image || product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Button overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-gray-100 text-xs font-bold py-1.5 px-3 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-1">
          <span className="uppercase tracking-wider truncate">{product.brand}</span>
          <span className="capitalize">{product.category}</span>
        </div>

        {/* Product Title (truncated to 2 lines) */}
        <Link
          to={`/product/${product.id}`}
          className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 hover:text-primary transition-colors mb-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 5)
                    ? 'fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviews || 42})</span>
        </div>

        {/* Price Row */}
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex items-baseline gap-2">
          <span className="text-base font-black text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button (StarTech style full width) */}
        <button
          onClick={() => addToCart(product, 1)}
          className="mt-3 w-full py-2 px-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
