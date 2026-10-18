import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { formatPrice } from '../../lib/utils';

export default function ProductCard({ product, variant = 'grid' }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  if (!product) return null;

  const saved = isInWishlist(product.id);
  const image = product.image || product.images?.[0] || '/placeholder-glasses.svg';

  return (
    <article className={`mo-catalog-card${variant === 'list' ? ' mo-catalog-card--list' : ''}`}>
      <div className="mo-catalog-card__media">
        <Link to={`/product/${product.id}`} className="mo-catalog-card__image" aria-label={`View ${product.name}`}>
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith('/placeholder-glasses.svg')) {
                e.currentTarget.src = '/placeholder-glasses.svg';
              }
            }}
          />
        </Link>

        <div className="mo-catalog-card__badges">
          {product.tags?.includes('bestseller') && <span className="mo-catalog-card__badge mo-catalog-card__badge--quiet">Bestseller</span>}
          {product.tags?.includes('new') && <span className="mo-catalog-card__badge mo-catalog-card__badge--new">New</span>}
        </div>

        <button
          type="button"
          className={`mo-catalog-card__save${saved ? ' is-active' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={saved}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>

      <div className="mo-catalog-card__details">
        <div className="mo-catalog-card__meta">
          <span>{product.brand || 'Metro Optics'}</span>
        </div>
        <Link to={`/product/${product.id}`} className="mo-catalog-card__name" title={product.name}>
          {product.name}
        </Link>
        <p className="mo-catalog-card__description">{product.description}</p>
        <div className="mo-catalog-card__price-row">
          <span className="mo-catalog-card__price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && <del>{formatPrice(product.originalPrice)}</del>}
        </div>
        <button type="button" className="mo-catalog-card__add" onClick={() => addToCart(product, 1)}>
          <ShoppingBag size={15} aria-hidden="true" /> Add to Cart
        </button>
      </div>
    </article>
  );
}
