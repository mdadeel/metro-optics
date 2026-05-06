import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { ModernButton, ModernBadge, LoadingSkeleton } from '../components/ui'
import { cn } from '../../lib/utils'

const ProductCard = ({ product, className, ...props }) => {
  const { addItem, openCart } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ ...product, quantity: 1 })
    openCart()
  }

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement quick view modal
    console.log('Quick view:', product)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
  }

  const isInWishlistChecked = isInWishlist(product.id)

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = (e) => {
    setImageError(true)
    setImageLoaded(false)
    e.target.src = `https://picsum.photos/seed/${product.id}/400/400.jpg`;
  }

  const getProductImage = (product) => {
    // If image is from external service, try to use a fallback
    if (product.image && product.image.includes('unsplash.com')) {
      // Try to use a placeholder or local image
      return `https://picsum.photos/seed/${product.id}/400/400.jpg`;
    }
    return product.image;
  }

  const getProductImage = (product) => {
    // If image is from external service, try to use a fallback
    if (product.image && product.image.includes('unsplash.com')) {
      // Try to use a placeholder or local image
      return `https://picsum.photos/seed/${product.id}/400/400.jpg`;
    }
    return product.image;
  }

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5',
        className
      )}
      {...props}
    >
        {/* Product Image Container */}
        <Link to={`/product/${product.id}`} className="block relative">
          <div className="aspect-[4/5] relative overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />
            )}
            
            {imageError && (
              <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">📷</div>
                  <div className="text-sm">Image not available</div>
                </div>
              </div>
            )}
            
            <img
              src={getProductImage(product)}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoaded || imageError ? 'block' : 'none' }}
            />
          
          {/* Product Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <ModernBadge variant="primary" size="sm">
                New
              </ModernBadge>
            )}
            {product.isBestseller && (
              <ModernBadge variant="accent" size="sm">
                Bestseller
              </ModernBadge>
            )}
            {product.originalPrice && (
              <ModernBadge variant="danger" size="sm">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </ModernBadge>
            )}
          </div>

          {/* Floating Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className={cn(
                'w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center transition-colors shadow-sm',
                isInWishlistChecked ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-500'
              )}
              title="Add to wishlist"
            >
              <Heart size={18} fill={isInWishlistChecked ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-primary transition-colors shadow-sm"
              title="Quick view"
            >
              <Eye size={18} />
            </button>
          </div>

          {/* Hover Actions */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <ModernButton
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleAddToCart}
              className="shadow-xl shadow-primary/30"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </ModernButton>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tighter mb-1">
              {product.brand || 'Metro Optics'}
            </h3>
            <Link to={`/product/${product.id}`}>
              <h2 className="text-lg font-black leading-tight text-gray-900 dark:text-white hover:text-primary transition-colors truncate">
                {product.name}
              </h2>
            </Link>
          </div>
          <div className="text-right ml-2">
            <p className="text-lg font-black text-primary">
              ৳{product.price.toLocaleString()}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className="text-[16px]">
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-[10px] font-bold text-gray-400">
              ({product.reviews || 0} Reviews)
            </span>
          </div>
        )}

        {/* Category */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {product.category}
        </p>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <ModernBadge 
            variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}
            size="sm"
          >
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </ModernBadge>
          
          {/* Secondary Add to Cart (always visible) */}
          <ModernButton
            variant="ghost"
            size="icon"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-shrink-0"
          >
            <ShoppingCart size={16} />
          </ModernButton>
        </div>
      </div>
    </div>
  )
}

ProductCard.displayName = 'ProductCard'

export { ProductCard }