import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Heart, ShoppingBag, Minus, Plus, ShieldCheck, Check } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { formatPrice, calculateDiscount } from '../../lib/utils';

export default function ProductQuickView() {
  const { quickViewProduct, closeQuickView } = useUIStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedColor, setSelectedColor] = useState(
    () => quickViewProduct?.colors?.[0] || 'Standard'
  );
  const [selectedSize, setSelectedSize] = useState(
    () => quickViewProduct?.sizes?.[0] || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const discount = calculateDiscount(
    quickViewProduct.originalPrice,
    quickViewProduct.price
  );
  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, { selectedColor, selectedSize });
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeQuickView}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in-50 zoom-in-95 duration-200">
        <button
          onClick={closeQuickView}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-gray-800 z-10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square bg-gray-50 dark:bg-gray-800 p-6 flex items-center justify-center">
            <img
              src={quickViewProduct.image || quickViewProduct.images?.[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover rounded-xl shadow-sm"
            />
          </div>

          {/* Product Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {quickViewProduct.brand}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 capitalize">
                  {quickViewProduct.category}
                </span>
              </div>

              <h3 className="text-xl font-black text-gray-900 dark:text-white leading-snug">
                {quickViewProduct.name}
              </h3>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(quickViewProduct.rating || 5)
                          ? 'fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  ({quickViewProduct.reviews || 30} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-black text-primary">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-0.5 rounded">
                    Save {discount}%
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Color options */}
              {quickViewProduct.colors?.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Frame Color: {selectedColor}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                          selectedColor === c
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size options */}
              {quickViewProduct.sizes?.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Size: {selectedSize}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                          selectedSize === s
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Quantity:</span>
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-gray-800 dark:text-gray-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 border rounded-xl transition-colors ${
                  inWishlist
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:text-accent'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              <Link
                to={`/product/${quickViewProduct.id}`}
                onClick={closeQuickView}
                className="py-3 px-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary text-xs font-bold rounded-xl transition-colors flex items-center justify-center"
              >
                Full Specs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
